const apiBase = "https://api.github.com";
const queueTitle = "Contributor Queue - who needs help next";
const queueLabel = "contributor queue";
const ownerLogin = "P-r-e-m-i-u-m";
const weeklyThreadUrl = "https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/discussions/44";

interface GitHubUser {
  login: string;
  type: string;
}

interface GitHubLabel {
  name: string;
}

interface GitHubIssue {
  number: number;
  title: string;
  html_url: string;
  comments: number;
  updated_at: string;
  pull_request?: unknown;
  labels: GitHubLabel[];
  assignees: GitHubUser[];
}

interface GitHubComment {
  body: string;
  created_at: string;
  html_url: string;
  issue_url: string;
  user: GitHubUser;
}

interface GitHubPullRequest {
  number: number;
  title: string;
  html_url: string;
  updated_at: string;
  user: GitHubUser;
  draft: boolean;
}

interface QueueCandidate {
  issue: GitHubIssue;
  requester: string;
  commentUrl: string;
  requestedAt: string;
  hasOwnerReplyAfterRequest: boolean;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function isAssignmentRequest(body: string): boolean {
  return /\b(assign|assigned|work on|take this|pick this|gssoc|gsoc|next issue|first issue)\b/i.test(body);
}

function isOwner(user: GitHubUser): boolean {
  return user.login.toLowerCase() === ownerLogin.toLowerCase();
}

function isGoodFirstIssue(issue: GitHubIssue): boolean {
  return issue.labels.some((label) => label.name === "good first issue");
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata"
  }).format(new Date(value));
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

function isSecondaryRateLimit(error: unknown): boolean {
  return error instanceof Error && /secondary rate limit/i.test(error.message);
}

async function ensureLabel(owner: string, repo: string, token: string): Promise<void> {
  const response = await fetch(`${apiBase}/repos/${owner}/${repo}/labels/${encodeURIComponent(queueLabel)}`, {
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
        name: queueLabel,
        color: "0e8a16",
        description: "Live maintainer queue for contributor follow-up"
      })
    });
    return;
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Could not inspect label ${queueLabel}: ${text}`);
  }
}

async function getOpenIssues(owner: string, repo: string, token: string): Promise<GitHubIssue[]> {
  const issues = await githubRequest<GitHubIssue[]>(
    `/repos/${owner}/${repo}/issues?state=open&per_page=100&sort=updated&direction=desc`,
    token
  );

  return issues.filter((issue) => !issue.pull_request);
}

async function getOpenPullRequests(owner: string, repo: string, token: string): Promise<GitHubPullRequest[]> {
  return githubRequest<GitHubPullRequest[]>(
    `/repos/${owner}/${repo}/pulls?state=open&per_page=100&sort=updated&direction=desc`,
    token
  );
}

async function getRecentIssueComments(owner: string, repo: string, token: string): Promise<GitHubComment[]> {
  return githubRequest<GitHubComment[]>(
    `/repos/${owner}/${repo}/issues/comments?per_page=100&sort=updated&direction=desc`,
    token
  );
}

function getIssueNumberFromComment(comment: GitHubComment): number | undefined {
  const match = comment.issue_url.match(/\/issues\/(\d+)$/);
  return match ? Number(match[1]) : undefined;
}

async function buildQueueCandidates(
  owner: string,
  repo: string,
  token: string,
  issues: GitHubIssue[]
): Promise<QueueCandidate[]> {
  const candidates: QueueCandidate[] = [];
  const recentComments = await getRecentIssueComments(owner, repo, token);
  const commentsByIssue = new Map<number, GitHubComment[]>();

  for (const comment of recentComments) {
    const issueNumber = getIssueNumberFromComment(comment);
    if (!issueNumber) {
      continue;
    }

    const comments = commentsByIssue.get(issueNumber) || [];
    comments.push(comment);
    commentsByIssue.set(issueNumber, comments);
  }

  for (const issue of issues.filter((candidate) => candidate.comments > 0)) {
    const comments = commentsByIssue.get(issue.number) || [];
    const requests = comments.filter(
      (comment) => comment.user.type !== "Bot" && !isOwner(comment.user) && isAssignmentRequest(comment.body)
    );

    for (const request of requests) {
      const hasOwnerReplyAfterRequest = comments.some(
        (comment) => isOwner(comment.user) && new Date(comment.created_at) > new Date(request.created_at)
      );

      candidates.push({
        issue,
        requester: request.user.login,
        commentUrl: request.html_url,
        requestedAt: request.created_at,
        hasOwnerReplyAfterRequest
      });
    }
  }

  return candidates.sort((a, b) => Number(new Date(b.requestedAt)) - Number(new Date(a.requestedAt)));
}

function renderCandidate(candidate: QueueCandidate): string {
  const assigned = candidate.issue.assignees.some(
    (assignee) => assignee.login.toLowerCase() === candidate.requester.toLowerCase()
  );
  const assignedText = assigned ? "assigned" : "not assigned yet";
  return `- @${candidate.requester} on [#${candidate.issue.number} ${candidate.issue.title}](${candidate.issue.html_url}) - ${assignedText}, asked ${formatDate(candidate.requestedAt)} ([comment](${candidate.commentUrl}))`;
}

function renderPr(pr: GitHubPullRequest): string {
  const draftText = pr.draft ? "draft" : "ready";
  return `- [#${pr.number} ${pr.title}](${pr.html_url}) by @${pr.user.login} - ${draftText}, updated ${formatDate(pr.updated_at)}`;
}

function renderIssue(issue: GitHubIssue): string {
  const labels = issue.labels.map((label) => `\`${label.name}\``).join(", ");
  return `- [#${issue.number} ${issue.title}](${issue.html_url}) - ${labels || "no labels"}`;
}

function renderQueueBody(issues: GitHubIssue[], prs: GitHubPullRequest[], candidates: QueueCandidate[]): string {
  const needsReply = candidates.filter((candidate) => !candidate.hasOwnerReplyAfterRequest).slice(0, 10);
  const waitingForPr = candidates.filter((candidate) => candidate.hasOwnerReplyAfterRequest).slice(0, 10);
  const readyToClaim = issues
    .filter((issue) => isGoodFirstIssue(issue) && issue.assignees.length === 0)
    .slice(0, 10);

  return [
    "# Contributor Queue",
    "",
    `Last refreshed: ${new Date().toISOString()}`,
    "",
    "This queue shows where contributors need maintainer attention. It is intentionally simple: reply, assign, review, or suggest the next issue.",
    "",
    `Weekly assignment thread: ${weeklyThreadUrl}`,
    "",
    "## Needs Maintainer Reply",
    "",
    needsReply.length ? needsReply.map(renderCandidate).join("\n") : "- Nothing waiting right now.",
    "",
    "## Assigned Or Waiting For PR",
    "",
    waitingForPr.length ? waitingForPr.map(renderCandidate).join("\n") : "- No active assignment follow-ups right now.",
    "",
    "## Open PRs To Review",
    "",
    prs.length ? prs.map(renderPr).join("\n") : "- No open PRs right now.",
    "",
    "## Ready To Claim",
    "",
    readyToClaim.length ? readyToClaim.map(renderIssue).join("\n") : "- No unassigned good first issues right now.",
    "",
    "## Maintainer Rule",
    "",
    "If someone asks to work on an issue, reply with the exact first command and one proof item. Keep it short, warm, and specific.",
    "",
    "<!-- oss-lab-contributor-queue -->"
  ].join("\n");
}

function findQueueIssue(issues: GitHubIssue[]): GitHubIssue | undefined {
  return issues.find((issue) => issue.title === queueTitle);
}

async function main(): Promise<void> {
  const repository = requireEnv("GITHUB_REPOSITORY");
  const token = process.env.MAINTAINER_TOKEN || requireEnv("GITHUB_TOKEN");
  const [owner, repo] = repository.split("/");

  if (!owner || !repo) {
    throw new Error(`Invalid repository name: ${repository}`);
  }

  await ensureLabel(owner, repo, token);

  const issues = await getOpenIssues(owner, repo, token);
  const prs = await getOpenPullRequests(owner, repo, token);
  const candidates = await buildQueueCandidates(owner, repo, token, issues);
  const body = renderQueueBody(issues, prs, candidates);
  const existing = findQueueIssue(issues);

  if (existing) {
    await githubRequest(`/repos/${owner}/${repo}/issues/${existing.number}`, token, {
      method: "PATCH",
      body: JSON.stringify({
        body,
        labels: [queueLabel, "community"]
      })
    });
    console.log(`Updated contributor queue: ${existing.html_url}`);
    return;
  }

  const created = await githubRequest<GitHubIssue>(`/repos/${owner}/${repo}/issues`, token, {
    method: "POST",
    body: JSON.stringify({
      title: queueTitle,
      body,
      labels: [queueLabel, "community"]
    })
  });

  console.log(`Created contributor queue: ${created.html_url}`);
}

main().catch((error: unknown) => {
  if (isSecondaryRateLimit(error)) {
    console.warn("GitHub secondary rate limit hit. Skipping this queue refresh; the next scheduled run will update it.");
    process.exit(0);
  }

  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
