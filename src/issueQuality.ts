import type { DailyIssue } from "./dailyIssueBacklog.js";

export interface IssueQualityScore {
  score: number;
  rating: "excellent" | "strong" | "needs polish";
  checks: string[];
}

export function scoreDailyIssue(issue: DailyIssue): IssueQualityScore {
  const checks = [
    {
      label: "clear context",
      passed: issue.context.trim().length >= 50
    },
    {
      label: "focused goal",
      passed: issue.goal.trim().length >= 40
    },
    {
      label: "suggested files",
      passed: issue.suggestedFiles.length > 0
    },
    {
      label: "reviewable acceptance criteria",
      passed: issue.acceptanceCriteria.length >= 3
    },
    {
      label: "beginner time label",
      passed: issue.labels.some((label) => label.startsWith("time: "))
    },
    {
      label: "contributor level label",
      passed: issue.labels.some((label) => label.startsWith("level: "))
    },
    {
      label: "human helpful notes",
      passed: issue.helpfulNotes.length > 0
    }
  ];

  const passedCount = checks.filter((check) => check.passed).length;
  const score = Math.round((passedCount / checks.length) * 100);

  return {
    score,
    rating: score >= 95 ? "excellent" : score >= 80 ? "strong" : "needs polish",
    checks: checks.map((check) => `${check.passed ? "pass" : "needs work"}: ${check.label}`)
  };
}
