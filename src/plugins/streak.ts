const apiBase = "https://api.github.com";
const repository = "P-r-e-m-i-u-m/open-source-starter-lab";
const PAGE_SIZE = 100;
const MAX_SEARCH_PAGES = 10;

interface GitHubSearchItem {
  closed_at: string | null;
}

interface GitHubSearchResult {
  items: GitHubSearchItem[];
}

export interface PrStreak {
  days: number;
  latestMergeDate: string | null;
}

function normalizeContributor(contributor: string): string | undefined {
  const normalized = contributor.trim().replace(/^@/, "").toLowerCase();

  if (!/^[a-z0-9-]+$/.test(normalized)) {
    return undefined;
  }

  return normalized;
}

async function githubSearch(
  contributor: string,
  page: number
): Promise<GitHubSearchResult> {
  const token = process.env.GITHUB_TOKEN;
  const params = new URLSearchParams({
    q: `repo:${repository} is:pr is:merged author:${contributor}`,
    per_page: String(PAGE_SIZE),
    page: String(page),
    sort: "updated",
    order: "desc"
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

async function fetchMergedDates(contributor: string): Promise<string[]> {
  const mergedDates: string[] = [];

  for (let page = 1; page <= MAX_SEARCH_PAGES; page += 1) {
    const result = await githubSearch(contributor, page);

    for (const item of result.items) {
      if (item.closed_at) {
        mergedDates.push(item.closed_at);
      }
    }

    if (result.items.length < PAGE_SIZE) {
      break;
    }
  }

  return mergedDates;
}

function dateOnly(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function parsedDateOnly(value: string): string | null {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : dateOnly(parsed);
}

function shiftUtcDate(date: string, days: number): string {
  const shifted = new Date(`${date}T00:00:00Z`);
  shifted.setUTCDate(shifted.getUTCDate() + days);
  return dateOnly(shifted);
}

export function currentPrStreak(
  mergedDates: string[],
  referenceDate: Date = new Date()
): PrStreak {
  const dates = Array.from(
    new Set(
      mergedDates
        .map(parsedDateOnly)
        .filter((date): date is string => Boolean(date))
    )
  ).sort((a, b) => b.localeCompare(a));

  if (dates.length === 0) {
    return { days: 0, latestMergeDate: null };
  }

  const latestMergeDate = dates[0];
  const today = dateOnly(referenceDate);
  const yesterday = shiftUtcDate(today, -1);

  if (latestMergeDate !== today && latestMergeDate !== yesterday) {
    return { days: 0, latestMergeDate };
  }

  let streakDays = 0;
  let expectedDate = latestMergeDate;

  for (const date of dates) {
    if (date !== expectedDate) {
      break;
    }

    streakDays += 1;
    expectedDate = shiftUtcDate(expectedDate, -1);
  }

  return {
    days: streakDays,
    latestMergeDate
  };
}

export function formatPrStreak(
  contributor: string,
  result: PrStreak
): string {
  const dayLabel = result.days === 1 ? "day" : "days";

  return [
    `@${contributor} merged PR streak`,
    "",
    `Current streak: ${result.days} ${dayLabel}`,
    `Most recent merge: ${result.latestMergeDate ?? "none"}`
  ].join("\n");
}

export async function streak(contributor: string): Promise<void> {
  const normalized = normalizeContributor(contributor);

  if (!normalized) {
    throw new Error("Provide a valid GitHub username.");
  }

  const mergedDates = await fetchMergedDates(normalized);
  console.log(formatPrStreak(normalized, currentPrStreak(mergedDates)));
}
