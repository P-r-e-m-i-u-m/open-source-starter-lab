const apiBase = "https://api.github.com";
const repository = "P-r-e-m-i-u-m/open-source-starter-lab";
const WINDOW_DAYS = 7;

interface GitHubUser {
  login: string;
  type: string;
}

interface GitHubSearchItem {
  user?: GitHubUser | null;
}

export interface GitHubSearchResult {
  total_count: number;
  items: GitHubSearchItem[];
}

export interface WeeklyActivity {
  windowDays: number;
  since: string;
  issuesOpened: number;
  pullRequestsMerged: number;
  newContributors: number;
}

export type SearchIssues = (query: string) => Promise<GitHubSearchResult>;

async function searchGitHubIssues(query: string): Promise<GitHubSearchResult> {
  const token = process.env.GITHUB_TOKEN;
  const params = new URLSearchParams({
    q: query,
    per_page: "100"
  });

  const response = await fetch(`${apiBase}/search/issues?${params.toString()}`, {
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

  return (await response.json()) as GitHubSearchResult;
}

function dateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export async function getWeeklyActivity(
  referenceDate: Date = new Date(),
  search: SearchIssues = searchGitHubIssues
): Promise<WeeklyActivity> {
  const since = new Date(referenceDate);
  since.setUTCDate(since.getUTCDate() - WINDOW_DAYS);
  const sinceDate = dateOnly(since);

  const [issues, mergedPullRequests] = await Promise.all([
    search(`repo:${repository} is:issue created:>=${sinceDate}`),
    search(`repo:${repository} is:pr is:merged merged:>=${sinceDate}`)
  ]);

  const contributorLogins = Array.from(
    new Set(
      mergedPullRequests.items
        .map((item) => item.user)
        .filter(
          (user): user is GitHubUser =>
            Boolean(user?.login) && user?.type !== "Bot"
        )
        .map((user) => user.login)
    )
  );

  let newContributors = 0;

  for (const login of contributorLogins) {
    const previousPullRequests = await search(
      `repo:${repository} is:pr is:merged author:${login} merged:<${sinceDate}`
    );

    if (previousPullRequests.total_count === 0) {
      newContributors += 1;
    }
  }

  return {
    windowDays: WINDOW_DAYS,
    since: sinceDate,
    issuesOpened: issues.total_count,
    pullRequestsMerged: mergedPullRequests.total_count,
    newContributors
  };
}

export function formatWeeklyActivity(summary: WeeklyActivity): string {
  return [
    `Weekly repository summary (last ${summary.windowDays} days)`,
    `Since: ${summary.since}`,
    "",
    `Issues opened: ${summary.issuesOpened}`,
    `PRs merged: ${summary.pullRequestsMerged}`,
    `New contributors: ${summary.newContributors}`
  ].join("\n");
}

export async function weeklySummary(): Promise<void> {
  const summary = await getWeeklyActivity();
  console.log(formatWeeklyActivity(summary));
}
