const apiBase = "https://api.github.com";
const firstMergeWallPath = "docs/FIRST_MERGE_WALL.md";
const passportDirectory = "contributors/passports";

interface GitHubUser {
  login: string;
  type: string;
}

interface GitHubPullRequest {
  number: number;
  title: string;
  body: string | null;
  html_url: string;
  merged: boolean;
  merged_at: string | null;
  user: GitHubUser | null;
  base: {
    repo: {
      full_name: string;
    };
  };
}

interface GitHubIssue {
  number: number;
  title: string;
  html_url: string;
  state: "open" | "closed";
  pull_request?: unknown;
}

interface NextIssueSuggestion {
  route: string;
  issue: GitHubIssue;
}

interface GitHubLabel {
  name: string;
}

interface GitHubEvent {
  pull_request?: GitHubPullRequest;
  repository?: {
    full_name: string;
  };
}

interface MaintainerActionPlan {
  shouldRun: boolean;
  reason?: string;
  repository: string;
  contributor: string;
  pullRequestNumber: number;
  pullRequestTitle: string;
  pullRequestUrl: string;
  linkedIssues: number[];
  passportPath?: string;
  nextIssues?: NextIssueSuggestion[];
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

async function readEvent(): Promise<GitHubEvent> {
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!eventPath) {
    throw new Error("Missing GITHUB_EVENT_PATH. Use --dry-run locally or run from GitHub Actions.");
  }

  const { readFile } = await import("node:fs/promises");
  return JSON.parse(await readFile(eventPath, "utf8")) as GitHubEvent;
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

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

function parseLinkedIssueNumbers(pr: GitHubPullRequest): number[] {
  const text = `${pr.title}\n${pr.body ?? ""}`;
  const closingKeywordPattern =
    /\b(?:close[sd]?|fix(?:e[sd])?|resolve[sd]?)\s+(?:https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/issues\/)?#?(\d+)\b/gi;
  const numbers = new Set<number>();
  let match = closingKeywordPattern.exec(text);

  while (match) {
    numbers.add(Number(match[1]));
    match = closingKeywordPattern.exec(text);
  }

  return [...numbers].sort((a, b) => a - b);
}

function formatIssueList(issues: number[]): string {
  if (issues.length === 0) {
    return "No linked issue was found in the PR body.";
  }

  return issues.map((issue) => `#${issue}`).join(", ");
}

function formatIssueCleanup(linkedIssues: number[], skippedIssues: number[]): string {
  if (linkedIssues.length === 0) {
    return "No linked issue was found in the PR body.";
  }

  const foundIssues = linkedIssues.filter((issue) => !skippedIssues.includes(issue));
  const foundText = foundIssues.length ? `cleaned ${formatIssueList(foundIssues)}` : "no managed issue was cleaned";
  const skippedText = skippedIssues.length
    ? ` Referenced issue(s) ${formatIssueList(skippedIssues)} were not found, so I skipped them.`
    : "";

  return `${foundText}.${skippedText}`;
}

function isMissingIssueError(error: unknown): boolean {
  return error instanceof Error && /GitHub API failed 404/i.test(error.message);
}

function slugifyContributor(login: string): string {
  return login.toLowerCase().replace(/[^a-z0-9-]/g, "-");
}

function inferSkillFromLabels(labels: GitHubLabel[]): string | undefined {
  const skillLabel = labels.find((label) => label.name.startsWith("skill: "));
  if (skillLabel) {
    return skillLabel.name.replace("skill: ", "");
  }

  if (labels.some((label) => label.name === "documentation")) {
    return "docs";
  }
  if (labels.some((label) => label.name === "testing")) {
    return "testing";
  }
  if (labels.some((label) => label.name === "cli")) {
    return "cli";
  }

  return undefined;
}

function inferSkillFromTitle(title: string): string {
  const text = title.toLowerCase();
  if (/\b(test|testing|check|verify)\b/.test(text)) {
    return "testing";
  }
  if (/\b(cli|command|json|output)\b/.test(text)) {
    return "cli";
  }
  if (/\b(site|website|css|html|accessibility)\b/.test(text)) {
    return "website";
  }
  if (/\b(doc|guide|readme|checklist|glossary)\b/.test(text)) {
    return "docs";
  }

  return "open source workflow";
}

function formatPassportDate(value: string | null): string {
  if (!value) {
    return new Date().toISOString().slice(0, 10);
  }

  return new Date(value).toISOString().slice(0, 10);
}

function formatNextIssueLine(nextIssues: NextIssueSuggestion[]): string {
  const nextIssue = nextIssues[0];
  if (!nextIssue) {
    return "Ask in the weekly assignment thread for a second PR suggestion.";
  }

  return `${nextIssue.route}: #${nextIssue.issue.number} ${nextIssue.issue.title}`;
}

async function ensureWallEntry(contributor: string, pr: GitHubPullRequest): Promise<boolean> {
  const { readFile, writeFile } = await import("node:fs/promises");
  const wall = await readFile(firstMergeWallPath, "utf8");

  if (wall.includes(`### @${contributor}`) || wall.includes(`First merged PR: #${pr.number}`)) {
    return false;
  }

  const entry = [
    `### @${contributor}`,
    "",
    `- First merged PR: #${pr.number}`,
    `- I worked on: ${pr.title}`,
    "- I learned: how a focused pull request becomes a visible open-source contribution",
    ""
  ].join("\n");

  const marker = "## Why This Exists";
  const updated = wall.includes(marker)
    ? wall.replace(marker, `${entry}\n${marker}`)
    : `${wall.trimEnd()}\n\n${entry}`;

  await writeFile(firstMergeWallPath, updated, "utf8");
  return true;
}

async function ensureContributorPassport(
  contributor: string,
  pr: GitHubPullRequest,
  skill: string,
  linkedIssues: number[],
  nextIssues: NextIssueSuggestion[]
): Promise<string> {
  const { mkdir, readFile, writeFile } = await import("node:fs/promises");
  const path = `${passportDirectory}/${slugifyContributor(contributor)}.md`;
  const contributionLine = `| #${pr.number} | ${formatPassportDate(pr.merged_at)} | ${skill} | ${pr.title} | ${formatIssueList(linkedIssues)} |`;

  await mkdir(passportDirectory, { recursive: true });

  let existing = "";
  try {
    existing = await readFile(path, "utf8");
  } catch {
    existing = "";
  }

  if (existing.includes(`| #${pr.number} |`)) {
    return path;
  }

  if (!existing.trim()) {
    const content = [
      `# @${contributor} Open Source Trust Passport`,
      "",
      "This passport records reviewed, merged contributions in Open Source Starter Lab.",
      "",
      "## Current Level",
      "",
      "- Level: 1 - First PR Contributor",
      `- First merged PR: #${pr.number}`,
      `- Primary skill: ${skill}`,
      "- Proof: merged pull request with maintainer review and project checks",
      "",
      "## Verified Contributions",
      "",
      "| PR | Date | Skill | Work | Linked issues |",
      "| --- | --- | --- | --- | --- |",
      contributionLine,
      "",
      "## Suggested Next Step",
      "",
      `- ${formatNextIssueLine(nextIssues)}`,
      "",
      "## Share Line",
      "",
      `I earned my Open Source Trust Passport by getting #${pr.number} merged in Open Source Starter Lab.`,
      ""
    ].join("\n");

    await writeFile(path, content, "utf8");
    return path;
  }

  const updated = existing.includes("## Suggested Next Step")
    ? existing
        .replace("## Suggested Next Step", `${contributionLine}\n\n## Suggested Next Step`)
        .replace(/- .+\n(?=\n## Share Line)/, `- ${formatNextIssueLine(nextIssues)}\n`)
    : `${existing.trimEnd()}\n\n${contributionLine}\n`;

  await writeFile(path, updated, "utf8");
  return path;
}

async function searchNextIssue(
  owner: string,
  repo: string,
  token: string,
  labels: string[]
): Promise<GitHubIssue | undefined> {
  const issues = await githubRequest<GitHubIssue[]>(
    `/repos/${owner}/${repo}/issues?state=open&per_page=30&labels=${encodeURIComponent(labels.join(","))}`,
    token
  );

  return issues.find((issue) => !issue.pull_request);
}

async function findNextIssueSuggestions(
  owner: string,
  repo: string,
  token: string
): Promise<NextIssueSuggestion[]> {
  const routes = [
    {
      route: "Second PR route",
      labels: ["level: second-pr"]
    },
    {
      route: "Docs route",
      labels: ["documentation", "time: 30 min"]
    },
    {
      route: "Code route",
      labels: ["cli"]
    },
    {
      route: "Testing route",
      labels: ["testing"]
    }
  ];

  const suggestions: NextIssueSuggestion[] = [];
  const seen = new Set<number>();

  for (const route of routes) {
    const issue = await searchNextIssue(owner, repo, token, route.labels);
    if (issue && !seen.has(issue.number)) {
      suggestions.push({ route: route.route, issue });
      seen.add(issue.number);
    }
  }

  return suggestions.slice(0, 3);
}

async function fetchIssue(owner: string, repo: string, token: string, issueNumber: number): Promise<GitHubIssue> {
  return githubRequest<GitHubIssue>(`/repos/${owner}/${repo}/issues/${issueNumber}`, token);
}

async function fetchIssueLabels(owner: string, repo: string, token: string, issueNumber: number): Promise<GitHubLabel[]> {
  return githubRequest<GitHubLabel[]>(`/repos/${owner}/${repo}/issues/${issueNumber}/labels?per_page=100`, token);
}

async function commentOnIssue(owner: string, repo: string, token: string, issue: GitHubIssue, pr: GitHubPullRequest): Promise<void> {
  const body = [
    `Closed cleanly by #${pr.number}.`,
    "",
    `Thanks to @${pr.user?.login ?? "the contributor"} for shipping this through a reviewed PR.`
  ].join("\n");

  await githubRequest(`/repos/${owner}/${repo}/issues/${issue.number}/comments`, token, {
    method: "POST",
    body: JSON.stringify({ body })
  });
}

async function closeIssue(owner: string, repo: string, token: string, issue: GitHubIssue): Promise<void> {
  if (issue.state === "closed") {
    return;
  }

  await githubRequest(`/repos/${owner}/${repo}/issues/${issue.number}`, token, {
    method: "PATCH",
    body: JSON.stringify({
      state: "closed",
      state_reason: "completed"
    })
  });
}

async function commentOnPullRequest(
  owner: string,
  repo: string,
  token: string,
  pr: GitHubPullRequest,
  linkedIssues: number[],
  skippedIssues: number[],
  nextIssues: NextIssueSuggestion[] = []
): Promise<void> {
  const contributor = pr.user?.login ?? "there";
  const nextLines = nextIssues.length
    ? [
        "Good next steps if you want another small PR:",
        ...nextIssues.map(
          (suggestion) => `- ${suggestion.route}: #${suggestion.issue.number} ${suggestion.issue.title}`
        )
      ]
    : ["If you want another small one, check the open `good first issue` queue and I can help you choose."];

  const body = [
    `Thanks @${contributor}, this is merged.`,
    "",
    "I added you to the First Merge Wall so the contribution is visible to future visitors.",
    `Related issue cleanup: ${formatIssueCleanup(linkedIssues, skippedIssues)}`,
    "",
    ...nextLines,
    "",
    `No pressure. Your first merge already counts. If you want to keep going, the second PR path is here: https://github.com/${owner}/${repo}/blob/main/docs/SECOND_PR_PATH.md`,
    "",
    "Appreciate you helping make this repo more useful for first-time contributors."
  ].join("\n");

  await githubRequest(`/repos/${owner}/${repo}/issues/${pr.number}/comments`, token, {
    method: "POST",
    body: JSON.stringify({ body })
  });
}

async function buildPlan(): Promise<MaintainerActionPlan> {
  if (hasFlag("--dry-run")) {
    return {
      shouldRun: true,
      repository: process.env.GITHUB_REPOSITORY ?? "P-r-e-m-i-u-m/open-source-starter-lab",
      contributor: "example-contributor",
      pullRequestNumber: 123,
      pullRequestTitle: "docs: improve first PR checklist",
      pullRequestUrl: "https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/pull/123",
      linkedIssues: [42],
      passportPath: `${passportDirectory}/example-contributor.md`
    };
  }

  const event = await readEvent();
  const pr = event.pull_request;

  if (!pr) {
    return {
      shouldRun: false,
      reason: "No pull request found in the event payload.",
      repository: event.repository?.full_name ?? requireEnv("GITHUB_REPOSITORY"),
      contributor: "",
      pullRequestNumber: 0,
      pullRequestTitle: "",
      pullRequestUrl: "",
      linkedIssues: []
    };
  }

  if (!pr.merged) {
    return {
      shouldRun: false,
      reason: "Pull request was closed without being merged.",
      repository: pr.base.repo.full_name,
      contributor: pr.user?.login ?? "",
      pullRequestNumber: pr.number,
      pullRequestTitle: pr.title,
      pullRequestUrl: pr.html_url,
      linkedIssues: []
    };
  }

  if (!pr.user || pr.user.type === "Bot") {
    return {
      shouldRun: false,
      reason: "Merged pull request author is a bot.",
      repository: pr.base.repo.full_name,
      contributor: pr.user?.login ?? "",
      pullRequestNumber: pr.number,
      pullRequestTitle: pr.title,
      pullRequestUrl: pr.html_url,
      linkedIssues: []
    };
  }

  return {
    shouldRun: true,
    repository: pr.base.repo.full_name,
    contributor: pr.user.login,
    pullRequestNumber: pr.number,
    pullRequestTitle: pr.title,
    pullRequestUrl: pr.html_url,
    linkedIssues: parseLinkedIssueNumbers(pr)
  };
}

async function main(): Promise<void> {
  const dryRun = hasFlag("--dry-run");
  const plan = await buildPlan();

  if (!plan.shouldRun) {
    console.log(plan.reason ?? "No after-merge work required.");
    return;
  }

  if (dryRun) {
    console.log(JSON.stringify(plan, null, 2));
    return;
  }

  const event = await readEvent();
  const pr = event.pull_request;
  if (!pr) {
    throw new Error("Pull request payload disappeared after planning.");
  }

  const token = process.env.MAINTAINER_TOKEN || requireEnv("GITHUB_TOKEN");
  const [owner, repo] = plan.repository.split("/");
  if (!owner || !repo) {
    throw new Error(`Invalid repository name: ${plan.repository}`);
  }

  const changedWall = await ensureWallEntry(plan.contributor, pr);
  const nextIssues = await findNextIssueSuggestions(owner, repo, token);
  const skippedIssues: number[] = [];
  let inferredSkill: string | undefined;

  for (const issueNumber of plan.linkedIssues) {
    let issue: GitHubIssue;
    try {
      issue = await fetchIssue(owner, repo, token, issueNumber);
    } catch (error: unknown) {
      if (isMissingIssueError(error)) {
        skippedIssues.push(issueNumber);
        console.warn(`Skipping linked issue #${issueNumber}: issue was not found.`);
        continue;
      }

      throw error;
    }

    const labels = await fetchIssueLabels(owner, repo, token, issueNumber);
    inferredSkill ??= inferSkillFromLabels(labels);
    const isManagedIssue = labels.some((label) =>
      ["good first issue", "beginner friendly", "daily starter issue"].includes(label.name)
    );

    if (isManagedIssue) {
      await commentOnIssue(owner, repo, token, issue, pr);
      await closeIssue(owner, repo, token, issue);
    }
  }

  const passportPath = await ensureContributorPassport(
    plan.contributor,
    pr,
    inferredSkill ?? inferSkillFromTitle(pr.title),
    plan.linkedIssues,
    nextIssues
  );
  await commentOnPullRequest(owner, repo, token, pr, plan.linkedIssues, skippedIssues, nextIssues);
  console.log(changedWall ? "First Merge Wall updated." : "First Merge Wall already had this entry.");
  console.log(`Trust Passport updated: ${passportPath}`);
  console.log(`Thanked @${plan.contributor} on #${plan.pullRequestNumber}.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
