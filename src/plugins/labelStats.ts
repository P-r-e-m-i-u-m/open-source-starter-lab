const apiBase = "https://api.github.com";
const repository = "P-r-e-m-i-u-m/open-source-starter-lab";
const PAGE_SIZE = 100;
const DEFAULT_LIMIT = 10;

interface GitHubLabel {
  name: string | null;
}

export interface GitHubIssue {
  labels: Array<GitHubLabel | string>;
  pull_request?: unknown;
}

export interface LabelCount {
  name: string;
  openIssues: number;
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

async function fetchOpenIssues(): Promise<GitHubIssue[]> {
  const issues: GitHubIssue[] = [];

  for (let page = 1; ; page += 1) {
    const batch = await githubRequest<GitHubIssue[]>(
      `/repos/${repository}/issues?state=open&per_page=${PAGE_SIZE}&page=${page}`
    );

    issues.push(...batch.filter((issue) => !issue.pull_request));

    if (batch.length < PAGE_SIZE) {
      break;
    }
  }

  return issues;
}

function labelName(label: GitHubLabel | string): string | null {
  if (typeof label === "string") {
    return label.trim() || null;
  }

  return label.name?.trim() || null;
}

export function mostUsedOpenIssueLabels(
  issues: GitHubIssue[],
  limit: number = DEFAULT_LIMIT
): LabelCount[] {
  const counts = new Map<string, number>();

  for (const issue of issues) {
    if (issue.pull_request) {
      continue;
    }

    for (const label of issue.labels) {
      const name = labelName(label);

      if (!name) {
        continue;
      }

      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([name, openIssues]) => ({ name, openIssues }))
    .sort((a, b) => b.openIssues - a.openIssues || a.name.localeCompare(b.name))
    .slice(0, Math.max(0, limit));
}

export async function labelStats(): Promise<void> {
  const issues = await fetchOpenIssues();
  const labels = mostUsedOpenIssueLabels(issues);

  console.log("Most used labels on open issues\n");

  if (labels.length === 0) {
    console.log("No labels found on open issues.");
    return;
  }

  labels.forEach((label, index) => {
    const issueLabel = label.openIssues === 1 ? "open issue" : "open issues";
    console.log(`${index + 1}. ${label.name} - ${label.openIssues} ${issueLabel}`);
  });
}
