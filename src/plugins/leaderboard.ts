import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

export interface MergedPullRequest {
  username: string;
  mergedAt: Date;
}

export interface ContributorRank {
  username: string;
  mergedPullRequests: number;
}

const PASSPORTS_DIR = join("contributors", "passports");
const WINDOW_DAYS = 30;
const TOP_N = 5;

function parsePassportFile(fileName: string, contents: string): MergedPullRequest[] {
  const username = fileName.replace(/\.md$/, "");
  const rows: MergedPullRequest[] = [];

  for (const line of contents.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("| #")) continue;

    const cells = trimmed
      .split("|")
      .map((cell) => cell.trim())
      .filter((cell) => cell.length > 0);

    const dateText = cells[1];
    if (!dateText) continue;

    const mergedAt = new Date(dateText);
    if (Number.isNaN(mergedAt.getTime())) continue;

    rows.push({ username, mergedAt });
  }

  return rows;
}

function loadMergedPullRequests(): MergedPullRequest[] {
  let fileNames: string[];
  try {
    fileNames = readdirSync(PASSPORTS_DIR);
  } catch {
    return [];
  }

  const merged: MergedPullRequest[] = [];
  for (const fileName of fileNames) {
    if (!fileName.endsWith(".md") || fileName.toLowerCase() === "readme.md") continue;
    const contents = readFileSync(join(PASSPORTS_DIR, fileName), "utf8");
    merged.push(...parsePassportFile(fileName, contents));
  }

  return merged;
}

export function topContributorsByMergedPRs(
  mergedPullRequests: MergedPullRequest[],
  referenceDate: Date = new Date(),
  windowDays: number = WINDOW_DAYS,
  limit: number = TOP_N
): ContributorRank[] {
  const cutoff = new Date(referenceDate);
  cutoff.setDate(cutoff.getDate() - windowDays);

  const counts = new Map<string, number>();
  for (const pr of mergedPullRequests) {
    if (pr.mergedAt >= cutoff && pr.mergedAt <= referenceDate) {
      counts.set(pr.username, (counts.get(pr.username) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([username, mergedPullRequests]) => ({ username, mergedPullRequests }))
    .sort((a, b) => b.mergedPullRequests - a.mergedPullRequests || a.username.localeCompare(b.username))
    .slice(0, limit);
}

export function leaderboard(): void {
  const mergedPullRequests = loadMergedPullRequests();
  const top = topContributorsByMergedPRs(mergedPullRequests);

  console.log(`Top ${TOP_N} contributors by merged PRs in the last ${WINDOW_DAYS} days\n`);

  if (top.length === 0) {
    console.log("No merged pull requests recorded in the last 30 days.");
    return;
  }

  top.forEach((contributor, index) => {
    const label = contributor.mergedPullRequests === 1 ? "merged PR" : "merged PRs";
    console.log(`${index + 1}. ${contributor.username} - ${contributor.mergedPullRequests} ${label}`);
  });
}