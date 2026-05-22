const apiBase = "https://api.github.com";
const weeklyDiscussionUrl = "https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/discussions/44";
const botMarker = "<!-- oss-lab-assignment-helper -->";
const ownerLogin = "P-r-e-m-i-u-m";

interface GitHubUser {
  login: string;
  type: string;
}

interface GitHubIssuePayload {
  number: number;
  pull_request?: unknown;
}

interface GitHubCommentPayload {
  body?: string;
  user?: GitHubUser;
}

interface IssueCommentEvent {
  action?: string;
  issue?: GitHubIssuePayload;
  comment?: GitHubCommentPayload;
  repository?: {
    full_name: string;
  };
}

interface GitHubIssueComment {
  body?: string;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

async function readEvent(): Promise<IssueCommentEvent> {
  const eventPath = requireEnv("GITHUB_EVENT_PATH");
  const { readFile } = await import("node:fs/promises");
  return JSON.parse(await readFile(eventPath, "utf8")) as IssueCommentEvent;
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

function isAssignmentRequest(body: string): boolean {
  return /\b(assign|assigned|work on|take this|pick this|gssoc|gsoc)\b/i.test(body);
}

function isMaintainer(user: GitHubUser): boolean {
  return user.login.toLowerCase() === ownerLogin.toLowerCase();
}

function buildReply(username: string): string {
  return [
    botMarker,
    `Done @${username}.`,
    "",
    `Also introduce yourself in the weekly thread so I can suggest your next task after this: ${weeklyDiscussionUrl}`,
    "",
    "When you open the PR, include what changed and the command you used to check it."
  ].join("\n");
}

async function main(): Promise<void> {
  const event = await readEvent();
  const issue = event.issue;
  const comment = event.comment;

  if (event.action !== "created" || !issue || !comment?.body || !comment.user) {
    console.log("No new issue comment to process.");
    return;
  }

  if (issue.pull_request || comment.user.type === "Bot" || isMaintainer(comment.user)) {
    console.log("Skipping pull request comments, bot comments, and maintainer comments.");
    return;
  }

  if (!isAssignmentRequest(comment.body)) {
    console.log("Comment does not look like an assignment request.");
    return;
  }

  const repository = event.repository?.full_name ?? requireEnv("GITHUB_REPOSITORY");
  const token = process.env.MAINTAINER_TOKEN || requireEnv("GITHUB_TOKEN");
  const [owner, repo] = repository.split("/");

  if (!owner || !repo) {
    throw new Error(`Invalid repository name: ${repository}`);
  }

  const comments = await githubRequest<GitHubIssueComment[]>(
    `/repos/${owner}/${repo}/issues/${issue.number}/comments?per_page=100`,
    token
  );

  const alreadyReplied = comments.some((existing) => existing.body?.includes(botMarker));
  if (alreadyReplied) {
    console.log("Assignment helper already replied on this issue.");
    return;
  }

  try {
    await githubRequest(`/repos/${owner}/${repo}/issues/${issue.number}/assignees`, token, {
      method: "POST",
      body: JSON.stringify({ assignees: [comment.user.login] })
    });
  } catch (error: unknown) {
    console.warn(error instanceof Error ? error.message : error);
  }

  await githubRequest(`/repos/${owner}/${repo}/issues/${issue.number}/comments`, token, {
    method: "POST",
    body: JSON.stringify({ body: buildReply(comment.user.login) })
  });

  console.log(`Replied to @${comment.user.login} on issue #${issue.number}.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
