import { dailyIssueBacklog, type DailyIssue } from "../dailyIssueBacklog.js";

export interface LabelStat {
  label: string;
  count: number;
}

/**
 * Aggregates label frequencies from the daily issue backlog, sorted descending by count.
 */
export function calculateLabelStats(backlog: DailyIssue[] = dailyIssueBacklog): LabelStat[] {
  const counts = new Map<string, number>();

  for (const issue of backlog) {
    for (const label of issue.labels) {
      const normalized = label.trim();
      if (!normalized) continue;
      counts.set(normalized, (counts.get(normalized) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

/**
 * Prints a summary of issue label statistics.
 */
export function labelStats(backlog: DailyIssue[] = dailyIssueBacklog): void {
  const stats = calculateLabelStats(backlog);

  if (stats.length === 0) {
    console.log("No issue labels found in the backlog.");
    return;
  }

  console.log(`Issue Label Statistics (${backlog.length} total backlog issues):\n`);
  for (const [index, { label, count }] of stats.entries()) {
    const issueText = count === 1 ? "issue" : "issues";
    console.log(`${index + 1}. ${label} (${count} ${issueText})`);
  }
}
