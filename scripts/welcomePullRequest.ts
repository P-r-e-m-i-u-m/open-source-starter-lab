import { fileURLToPath } from "node:url";

const apiBase = "https://api.github.com";
const botMarker = "<!-- oss-lab-pr-welcome-guard -->";
const issueSearchUrl = "https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/issues?q=is%3Aissue+is%3Aopen+no%3Aassignee";

export interface GitHubUser {
  login: string;
  type: string;
}

export interface GitHubPullRequest {
  number: number;
  title: string;
  body: string | null;
  html_url: string;
  user: GitHubUser | null;
  base: {
    repo: {
      full_name: string;
    };
  };
}

interface PullRequestEvent {
  action?: string;
  pull_request?: GitHubPullRequest;
  repository?: {
    full_name: string;
  };
}

interface GitHubIssueComment {
  id: number;
  body?: string;
  user?: GitHubUser;
}

interface GitHubSearchResult {
  total_count: number;
}

export interface PrQuality {
  hasWhatChanged: boolean;
  hasTesting: boolean;
  hasCheckCommand: boolean;
  hasLinkedIssue: boolean;
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

async function readEvent(): Promise<PullRequestEvent> {
  const eventPath = requireEnv("GITHUB_EVENT_PATH");
  const { readFile } = await import("node:fs/promises");
  return JSON.parse(await readFile(eventPath, "utf8")) as PullRequestEvent;
}

async function githubRequest<T>(path: string, token: string, options: RequestInit = {}): Promise<T> {
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

export function analyzePrBody(body: string | null): PrQuality {
  const text = body ?? "";

  return {
    hasWhatChanged: /what changed|summary|changes made|changes/i.test(text),
    hasTesting: /testing|test result|verified|verification/i.test(text),
    hasCheckCommand: /npm run check/i.test(text),
    hasLinkedIssue: /\b(?:close[sd]?|fix(?:e[sd])?|resolve[sd]?)\s+(?:#\d+|https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/issues\/\d+)/i.test(text)
  };
}

export function formatCheck(label: string, passed: boolean): string {
  return `- [${passed ? "x" : " "}] ${label}`;
}

export function buildComment(pr: GitHubPullRequest, firstPrHere: boolean, quality: PrQuality): string {
  const username = pr.user?.login ?? "there";
  const missing: string[] = [];

  if (!quality.hasWhatChanged) {
    missing.push("add a short `What changed` or `Summary` section");
  }
  if (!quality.hasTesting) {
    missing.push("add a `Testing` section");
  }
  if (!quality.hasCheckCommand) {
    missing.push("paste the `npm run check` result when you have it");
  }
  const optionalIssueLink = quality.hasLinkedIssue
    ? undefined
    : "If this PR solves an issue, add `Closes #issue-number` so GitHub can close it cleanly.";

  const opening = firstPrHere
    ? `Thanks @${username}. I see this is your first PR here, welcome.`
    : `Thanks @${username}. I picked this up for a quick review-readiness check.`;

  const statusLine = missing.length
    ? "A few small things will make this easier to review:"
    : "This already has the main review signals I look for.";

  const nextLine = missing.length
    ? "No stress. Small PRs are supposed to be easy to adjust."
    : "Nice work keeping the PR easy to follow.";

  return [
    botMarker,
    opening,
    "",
    statusLine,
    "",
    formatCheck("Clear summary of what changed", quality.hasWhatChanged),
    formatCheck("Testing or verification section", quality.hasTesting),
    formatCheck("Mentions `npm run check`", quality.hasCheckCommand),
    formatCheck("Links an issue when there is one", quality.hasLinkedIssue),
    "",
    ...(missing.length ? ["Suggested next edit:", ...missing.map((item) => `- ${item}`), ""] : []),
    ...(optionalIssueLink ? ["Optional cleanup:", `- ${optionalIssueLink}`, ""] : []),
    nextLine,
    "",
    "Keep the change focused. One useful change with proof is better than a big PR that is hard to review.",
    "",
    `If you are not sure which issue to take next after this, use the open issue queue: ${issueSearchUrl}`
  ].join("\n");
}

async function isFirstPrInRepo(owner: string, repo: string, token: string, username: string): Promise<boolean> {
  const query = `repo:${owner}/${repo} is:pr author:${username}`;
  const result = await githubRequest<GitHubSearchResult>(
    `/search/issues?q=${encodeURIComponent(query)}&per_page=1`,
    token
  );

  return result.total_count <= 1;
}

async function upsertComment(
  owner: string,
  repo: string,
  token: string,
  prNumber: number,
  body: string
): Promise<void> {
  const comments = await githubRequest<GitHubIssueComment[]>(
    `/repos/${owner}/${repo}/issues/${prNumber}/comments?per_page=100`,
    token
  );

  const existing = comments.find((comment) => comment.body?.includes(botMarker));
  if (existing) {
    await githubRequest(`/repos/${owner}/${repo}/issues/comments/${existing.id}`, token, {
      method: "PATCH",
      body: JSON.stringify({ body })
    });
    return;
  }

  await githubRequest(`/repos/${owner}/${repo}/issues/${prNumber}/comments`, token, {
    method: "POST",
    body: JSON.stringify({ body })
  });
}

async function main(): Promise<void> {
  if (hasFlag("--dry-run")) {
    const samplePr: GitHubPullRequest = {
      number: 123,
      title: "docs: improve first PR guide",
      body: "## What changed?\n\nUpdated the guide.\n\n## Testing\n\nI ran npm run check.",
      html_url: "https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/pull/123",
      user: { login: "new-contributor", type: "User" },
      base: { repo: { full_name: "P-r-e-m-i-u-m/open-source-starter-lab" } }
    };
    console.log(buildComment(samplePr, true, analyzePrBody(samplePr.body)));
    return;
  }

  const event = await readEvent();
  const pr = event.pull_request;

  if (!pr || !pr.user || pr.user.type === "Bot") {
    console.log("No human pull request to welcome.");
    return;
  }

  const repository = event.repository?.full_name ?? pr.base.repo.full_name;
  const token = process.env.MAINTAINER_TOKEN || requireEnv("GITHUB_TOKEN");
  const [owner, repo] = repository.split("/");
  if (!owner || !repo) {
    throw new Error(`Invalid repository name: ${repository}`);
  }

  const firstPrHere = await isFirstPrInRepo(owner, repo, token, pr.user.login);
  const quality = analyzePrBody(pr.body);
  const comment = buildComment(pr, firstPrHere, quality);

  await upsertComment(owner, repo, token, pr.number, comment);
  console.log(`Updated PR welcome guard on #${pr.number}.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
