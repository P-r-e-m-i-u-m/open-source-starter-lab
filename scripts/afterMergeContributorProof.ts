const apiBase = "https://api.github.com";
const firstMergeWallPath = "docs/FIRST_MERGE_WALL.md";

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

interface GitHubSearchResult {
  items: GitHubIssue[];
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
  nextIssue?: GitHubIssue;
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

async function findNextIssue(owner: string, repo: string, token: string): Promise<GitHubIssue | undefined> {
  const query = [
    `repo:${owner}/${repo}`,
    "is:issue",
    "is:open",
    'label:"good first issue"',
    "no:assignee"
  ].join(" ");

  const result = await githubRequest<GitHubSearchResult>(
    `/search/issues?q=${encodeURIComponent(query)}&sort=created&order=desc&per_page=10`,
    token
  );

  return result.items.find((issue) => !issue.pull_request);
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
  nextIssue?: GitHubIssue
): Promise<void> {
  const contributor = pr.user?.login ?? "there";
  const nextLine = nextIssue
    ? `If you want another small one, #${nextIssue.number} looks like a good next pick: ${nextIssue.title}`
    : "If you want another small one, check the open `good first issue` queue and I can help you choose.";

  const body = [
    `Thanks @${contributor}, this is merged.`,
    "",
    "I added you to the First Merge Wall so the contribution is visible to future visitors.",
    `Related issue cleanup: ${formatIssueCleanup(linkedIssues, skippedIssues)}`,
    "",
    nextLine,
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
      linkedIssues: [42]
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
  const nextIssue = await findNextIssue(owner, repo, token);
  const skippedIssues: number[] = [];

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
    const isManagedIssue = labels.some((label) =>
      ["good first issue", "beginner friendly", "daily starter issue"].includes(label.name)
    );

    if (isManagedIssue) {
      await commentOnIssue(owner, repo, token, issue, pr);
      await closeIssue(owner, repo, token, issue);
    }
  }

  await commentOnPullRequest(owner, repo, token, pr, plan.linkedIssues, skippedIssues, nextIssue);
  console.log(changedWall ? "First Merge Wall updated." : "First Merge Wall already had this entry.");
  console.log(`Thanked @${plan.contributor} on #${plan.pullRequestNumber}.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
