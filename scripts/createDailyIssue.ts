import { dailyIssueBacklog, type DailyIssue } from "../src/dailyIssueBacklog.js";
import { scoreDailyIssue } from "../src/issueQuality.js";

const apiBase = "https://api.github.com";

interface GitHubIssue {
  title: string;
  html_url: string;
}

function hasFlag(flag: string): boolean {
  return process.argv.includes(flag);
}

function getOptionValue(name: string): string | undefined {
  const prefix = `${name}=`;
  const inline = process.argv.find((arg) => arg.startsWith(prefix));

  if (inline) {
    return inline.slice(prefix.length);
  }

  const index = process.argv.indexOf(name);
  if (index >= 0) {
    return process.argv[index + 1];
  }

  return undefined;
}

function getIssueCount(): number {
  const rawValue = getOptionValue("--count") ?? process.env.DAILY_ISSUE_COUNT ?? "5";
  const count = Number.parseInt(rawValue, 10);

  if (!Number.isFinite(count) || count < 1 || count > 5) {
    throw new Error("Daily issue count must be a number between 1 and 5.");
  }

  return count;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getDayIndex(date = new Date()): number {
  const start = Date.UTC(2026, 0, 1);
  const today = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());

  return Math.max(0, Math.floor((today - start) / 86_400_000));
}

function chooseIssues(count: number, date = new Date()): DailyIssue[] {
  const dayIndex = getDayIndex(date);
  const startIndex = (dayIndex * count) % dailyIssueBacklog.length;

  return Array.from({ length: count }, (_, offset) => dailyIssueBacklog[(startIndex + offset) % dailyIssueBacklog.length]);
}

function chooseIssueCandidates(date = new Date()): DailyIssue[] {
  const dayIndex = getDayIndex(date);
  const startIndex = dayIndex % dailyIssueBacklog.length;

  return Array.from(
    { length: dailyIssueBacklog.length },
    (_, offset) => dailyIssueBacklog[(startIndex + offset) % dailyIssueBacklog.length]
  );
}

function formatBody(issue: DailyIssue): string {
  const quality = scoreDailyIssue(issue);

  return [
    `> Curated issue quality: ${quality.score}/100 (${quality.rating})`,
    "",
    "## Context",
    issue.context,
    "",
    "## Goal",
    issue.goal,
    "",
    "## Suggested files",
    ...issue.suggestedFiles.map((file) => `- \`${file}\``),
    "",
    "## Done when",
    ...issue.acceptanceCriteria.map((item) => `- [ ] ${item}`),
    "",
    "## Helpful notes",
    ...issue.helpfulNotes.map((note) => `- ${note}`),
    "",
    "## Curation checks",
    ...quality.checks.map((check) => `- ${check}`),
    "",
    "---",
    "If you are not sure this fits you, reply in Discussion #44 with your skill:",
    "https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/discussions/44",
    "",
    "Created from a curated maintainer backlog. A maintainer should still review scope before assigning."
  ].join("\n");
}

async function githubRequest<T>(
  path: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${apiBase}${path}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...options.headers
    }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub API failed ${response.status}: ${text}`);
  }

  return (await response.json()) as T;
}

async function ensureLabels(owner: string, repo: string, token: string, labels: string[]): Promise<void> {
  const labelColors: Record<string, string> = {
    "daily starter issue": "5319e7",
    documentation: "0075ca",
    "good first issue": "7057ff",
    "beginner friendly": "c2e0c6",
    "help wanted": "008672",
    community: "fbca04",
    cli: "d876e3",
    testing: "0e8a16",
    "developer tooling": "1d76db",
    website: "1d76db",
    accessibility: "6f42c1",
    "needs triage": "d93f0b",
    "time: 15 min": "bfdadc",
    "time: 30 min": "c5def5",
    "time: 1 hour": "fef2c0",
    "level: first-pr": "7057ff",
    "level: second-pr": "1d76db",
    "level: trust-builder": "0e8a16",
    "level: maintainer-practice": "fbca04"
  };

  const labelDescriptions: Record<string, string> = {
    "daily starter issue": "Generated from the curated daily issue backlog",
    documentation: "Docs, examples, or wording",
    "good first issue": "Small task for new contributors",
    "beginner friendly": "Safe for first-time contributors",
    "help wanted": "Open for community contribution",
    community: "Contributor and discussion work",
    cli: "CLI behavior or examples",
    testing: "Tasks related to testing, validation, and quality assurance",
    "developer tooling": "Tasks related to automation, scripts, developer tools, and workflow improvements",
    website: "Use for website pages, UI, frontend behavior, or site content",
    accessibility: "Use for accessibility, inclusive UX, keyboard navigation, screen readers, or assistive technology",
    "needs triage": "Needs maintainer review before it becomes ready for contribution",
    "time: 15 min": "Small issue expected to fit in about 15 minutes",
    "time: 30 min": "Small issue expected to fit in about 30 minutes",
    "time: 1 hour": "Focused issue expected to fit in about one hour",
    "level: first-pr": "Safe task for a first pull request",
    "level: second-pr": "Good next task after a first merge",
    "level: trust-builder": "Community task for contributors building repo trust",
    "level: maintainer-practice": "Small maintainer-style task for triage and review practice"
  };

  for (const label of labels) {
    const color = labelColors[label] ?? "ededed";
    const response = await fetch(`${apiBase}/repos/${owner}/${repo}/labels/${encodeURIComponent(label)}`, {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28"
      }
    });

    if (response.status === 404) {
      await githubRequest(`/repos/${owner}/${repo}/labels`, token, {
        method: "POST",
        body: JSON.stringify({
          name: label,
          color,
          description: labelDescriptions[label]
        })
      });
    } else if (!response.ok) {
      const text = await response.text();
      throw new Error(`Could not inspect label ${label}: ${text}`);
    }
  }
}

async function fetchOpenDailyStarterIssues(owner: string, repo: string, token: string): Promise<GitHubIssue[]> {
  return githubRequest<GitHubIssue[]>(
    `/repos/${owner}/${repo}/issues?state=open&per_page=100&labels=${encodeURIComponent("daily starter issue")}`,
    token
  );
}

function issueAlreadyExists(issues: GitHubIssue[], title: string): GitHubIssue | undefined {
  return issues.find((issue) => issue.title.toLowerCase() === title.toLowerCase());
}

async function fetchAllDailyStarterIssues(owner: string, repo: string, token: string): Promise<GitHubIssue[]> {
  const issues = await githubRequest<GitHubIssue[]>(
    `/repos/${owner}/${repo}/issues?state=all&per_page=100&labels=${encodeURIComponent("daily starter issue")}`,
    token
  );

  return issues;
}

async function main(): Promise<void> {
  const dryRun = hasFlag("--dry-run");
  const issueCount = getIssueCount();
  const issues = chooseIssues(issueCount);

  if (dryRun) {
    console.log(`Daily issue dry-run: ${issues.length} curated issue(s)`);

    for (const [index, issue] of issues.entries()) {
      const quality = scoreDailyIssue(issue);

      console.log("");
      console.log(`## ${index + 1}. ${issue.title}`);
      console.log(`Labels: ${issue.labels.join(", ")}`);
      console.log(`Quality: ${quality.score}/100 (${quality.rating})`);
      console.log("");
      console.log(formatBody(issue));
    }

    return;
  }

  const repository = requireEnv("GITHUB_REPOSITORY");
  const token = requireEnv("GITHUB_TOKEN");
  const [owner, repo] = repository.split("/");

  if (!owner || !repo) {
    throw new Error(`Invalid GITHUB_REPOSITORY value: ${repository}`);
  }

  const openDailyIssues = await fetchOpenDailyStarterIssues(owner, repo, token);
  const allDailyIssues = await fetchAllDailyStarterIssues(owner, repo, token);
  let createdCount = 0;

  for (const issue of chooseIssueCandidates()) {
    if (createdCount >= issueCount) {
      break;
    }

    await ensureLabels(owner, repo, token, issue.labels);

    const existing = issueAlreadyExists(openDailyIssues, issue.title);
    if (existing) {
      console.log(`Open daily issue already exists: ${existing.html_url}`);
      continue;
    }

    const previouslyUsed = issueAlreadyExists(allDailyIssues, issue.title);
    if (previouslyUsed) {
      console.log(`Reopening fresh slot for previously used issue title: ${issue.title}`);
    }

    const created = await githubRequest<GitHubIssue>(`/repos/${owner}/${repo}/issues`, token, {
      method: "POST",
      body: JSON.stringify({
        title: issue.title,
        body: formatBody(issue),
        labels: issue.labels
      })
    });

    console.log(`Created daily issue: ${created.html_url}`);
    openDailyIssues.push(created);
    allDailyIssues.push(created);
    createdCount += 1;
  }

  if (createdCount < issueCount) {
    console.log(`Created ${createdCount}/${issueCount} requested daily issue(s). Add more backlog items to keep the queue fresh.`);
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
