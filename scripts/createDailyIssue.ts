import { dailyIssueBacklog, type DailyIssue } from "../src/dailyIssueBacklog.js";

const apiBase = "https://api.github.com";

interface GitHubIssue {
  title: string;
  html_url: string;
}

function hasFlag(flag: string): boolean {
  return process.argv.includes(flag);
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function chooseIssue(date = new Date()): DailyIssue {
  const start = Date.UTC(2026, 0, 1);
  const today = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  const dayIndex = Math.max(0, Math.floor((today - start) / 86_400_000));
  return dailyIssueBacklog[dayIndex % dailyIssueBacklog.length];
}

function formatBody(issue: DailyIssue): string {
  return [
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
    "---",
    "Created by Daily Issue Bot from a curated maintainer backlog. A maintainer should still review scope before assigning."
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
    cli: "d876e3"
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
          description: label === "daily starter issue" ? "Generated from the curated daily issue backlog" : undefined
        })
      });
    } else if (!response.ok) {
      const text = await response.text();
      throw new Error(`Could not inspect label ${label}: ${text}`);
    }
  }
}

async function issueAlreadyExists(owner: string, repo: string, token: string, title: string): Promise<GitHubIssue | undefined> {
  const issues = await githubRequest<GitHubIssue[]>(
    `/repos/${owner}/${repo}/issues?state=all&per_page=100&labels=${encodeURIComponent("daily starter issue")}`,
    token
  );

  return issues.find((issue) => issue.title.toLowerCase() === title.toLowerCase());
}

async function main(): Promise<void> {
  const dryRun = hasFlag("--dry-run");
  const issue = chooseIssue();
  const body = formatBody(issue);

  if (dryRun) {
    console.log(`# ${issue.title}`);
    console.log(`Labels: ${issue.labels.join(", ")}`);
    console.log("");
    console.log(body);
    return;
  }

  const repository = requireEnv("GITHUB_REPOSITORY");
  const token = requireEnv("GITHUB_TOKEN");
  const [owner, repo] = repository.split("/");

  if (!owner || !repo) {
    throw new Error(`Invalid GITHUB_REPOSITORY value: ${repository}`);
  }

  await ensureLabels(owner, repo, token, issue.labels);

  const existing = await issueAlreadyExists(owner, repo, token, issue.title);
  if (existing) {
    console.log(`Daily issue already exists: ${existing.html_url}`);
    return;
  }

  const created = await githubRequest<GitHubIssue>(`/repos/${owner}/${repo}/issues`, token, {
    method: "POST",
    body: JSON.stringify({
      title: issue.title,
      body,
      labels: issue.labels
    })
  });

  console.log(`Created daily issue: ${created.html_url}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
