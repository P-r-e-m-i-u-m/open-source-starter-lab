import { dailyIssueBacklog, type DailyIssue } from "./dailyIssueBacklog.js";

export interface ExistingIssue {
  title: string;
  html_url: string;
}

export interface DuplicateDailyIssue {
  issue: DailyIssue;
  existing: ExistingIssue;
}

export interface DailyIssueSelection {
  fresh: DailyIssue[];
  duplicates: DuplicateDailyIssue[];
}

export function getDayIndex(date = new Date()): number {
  const start = Date.UTC(2026, 0, 1);
  const today = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());

  return Math.max(0, Math.floor((today - start) / 86_400_000));
}

export function chooseIssues(count: number, date = new Date()): DailyIssue[] {
  const dayIndex = getDayIndex(date);
  const startIndex = (dayIndex * count) % dailyIssueBacklog.length;

  return Array.from({ length: count }, (_, offset) => dailyIssueBacklog[(startIndex + offset) % dailyIssueBacklog.length]);
}

export function chooseIssueCandidates(date = new Date()): DailyIssue[] {
  const dayIndex = getDayIndex(date);
  const startIndex = dayIndex % dailyIssueBacklog.length;

  return Array.from(
    { length: dailyIssueBacklog.length },
    (_, offset) => dailyIssueBacklog[(startIndex + offset) % dailyIssueBacklog.length]
  );
}

export function issueAlreadyExists(issues: ExistingIssue[], title: string): ExistingIssue | undefined {
  return issues.find((issue) => issue.title.trim().toLowerCase() === title.trim().toLowerCase());
}

/**
 * Decides which curated issues the bot should create today.
 *
 * Candidates whose title is already open are skipped, and the bot keeps walking
 * the backlog until it has `count` fresh issues or runs out of candidates.
 */
export function selectFreshDailyIssues(
  candidates: DailyIssue[],
  openIssues: ExistingIssue[],
  count: number
): DailyIssueSelection {
  const fresh: DailyIssue[] = [];
  const duplicates: DuplicateDailyIssue[] = [];

  for (const issue of candidates) {
    if (fresh.length >= count) {
      break;
    }

    const existing = issueAlreadyExists(openIssues, issue.title);
    if (existing) {
      duplicates.push({ issue, existing });
      continue;
    }

    fresh.push(issue);
  }

  return { fresh, duplicates };
}
