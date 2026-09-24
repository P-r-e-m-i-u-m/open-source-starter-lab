import { findIssueFit, type ContributorSkill } from "../issueFitFinder.js";

const apiBase = "https://api.github.com";
const repository = "P-r-e-m-i-u-m/open-source-starter-lab";

const mentorLevels = [
  "level: second-pr",
  "level: trust-builder",
  "level: maintainer-shadow",
  "level: bigger-task"
] as const;

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
  body: string | null;
  state: string;
  labels: GitHubLabel[];
  pull_request?: unknown;
}

interface GitHubIssueComment {
  body?: string;
  user?: GitHubUser;
  issue_url?: string;
}

async function githubRequest<T>(path: string): Promise<T> {
  const token = process.env.GITHUB_TOKEN;

  const response = await fetch(`${apiBase}${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub API failed ${response.status}: ${text}`);
  }

  return (await response.json()) as T;
}

function issueMatchesSkill(
  issue: GitHubIssue,
  commentBody: string,
  skill: ContributorSkill
): boolean {
  const text = `${issue.title} ${issue.body ?? ""} ${commentBody}`.toLowerCase();

  const skillTerms: Record<ContributorSkill, string[]> = {
    "html-css": ["html", "css", "frontend", "markup", "layout"],
    javascript: ["javascript", "typescript", "js", "ts", "node", "cli"],
    python: ["python"],
    docs: ["docs", "documentation", "readme", "guide", "markdown", "writing"],
    testing: ["test", "testing", "coverage", "assertion", "smoke test"],
    git: ["git", "github", "branch", "commit", "pull request", "rebase"]
  };

  return skillTerms[skill].some((term) => text.includes(term));
}

function extractTip(body: string | undefined, skill: ContributorSkill): string {
  const cleaned = (body ?? "")
    .replace(/^\s*>\s*/gm, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/@\w[\w-]*/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) {
    return `Ask them how they approach ${skill} work in this repository.`;
  }

  const firstSentence = cleaned.split(/(?<=[.!?])\s+/)[0];

  return firstSentence.length <= 160
    ? firstSentence
    : `${firstSentence.slice(0, 157)}...`;
}

function hasMentorLevel(issue: GitHubIssue): boolean {
  return issue.labels.some((label) =>
    mentorLevels.includes(label.name as (typeof mentorLevels)[number])
  );
}

async function findMentor(
  skill: ContributorSkill
): Promise<{ login: string; tip: string } | null> {
  const comments = await githubRequest<GitHubIssueComment[]>(
    `/repos/${repository}/issues/comments?sort=created&direction=desc&per_page=50`
  );

  const seenIssues = new Set<number>();

  for (const comment of comments) {
    if (!comment.user || comment.user.type === "Bot" || !comment.issue_url) {
      continue;
    }

    const match = comment.issue_url.match(/\/issues\/(\d+)$/);

    if (!match) {
      continue;
    }

    const issueNumber = Number(match[1]);

    if (seenIssues.has(issueNumber)) {
      continue;
    }

    seenIssues.add(issueNumber);

    const issue = await githubRequest<GitHubIssue>(
      `/repos/${repository}/issues/${issueNumber}`
    );

    if (issue.pull_request || issue.state !== "open") {
      continue;
    }

    if (!hasMentorLevel(issue)) {
      continue;
    }

    if (!issueMatchesSkill(issue, comment.body ?? "", skill)) {
      continue;
    }

    return {
      login: comment.user.login,
      tip: extractTip(comment.body, skill)
    };
  }

  return null;
}

export async function mentor(skillInput: string): Promise<void> {
  const skill = findIssueFit(skillInput).skill;
  const result = await findMentor(skill);

  if (!result) {
    throw new Error(`No recent mentor match found for skill: ${skill}`);
  }

  console.log("Mentor suggestion\n");
  console.log(`Skill: ${skill}`);
  console.log(`Mentor: @${result.login}`);
  console.log(`Tip: ${result.tip}`);
}