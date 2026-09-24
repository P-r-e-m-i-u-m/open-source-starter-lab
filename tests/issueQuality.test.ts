import assert from "node:assert/strict";
import { scoreDailyIssue, type IssueQualityScore } from "../src/issueQuality.js";
import type { DailyIssue } from "../src/dailyIssueBacklog.js";

type Rating = IssueQualityScore["rating"];

const contextPass = "c".repeat(50);
const goalPass = "g".repeat(40);
const timeLabelPass = "time: 30 min";
const levelLabelPass = "level: first-pr";

function issueWithChecks(count: number): DailyIssue {
  const labels: string[] = [];
  if (count >= 5) {
    labels.push(timeLabelPass);
  }
  if (count >= 6) {
    labels.push(levelLabelPass);
  }

  return {
    title: "Synthetic issue for quality scoring",
    labels,
    context: count >= 1 ? contextPass : "",
    goal: count >= 2 ? goalPass : "",
    suggestedFiles: count >= 3 ? ["README.md"] : [],
    acceptanceCriteria: count >= 4 ? ["first", "second", "third"] : [],
    helpfulNotes: count >= 7 ? ["one useful tip"] : []
  };
}

function withCheck(label: string, passed: boolean): string {
  return `${passed ? "pass" : "needs work"}: ${label}`;
}

const checkLabels = [
  "clear context",
  "focused goal",
  "suggested files",
  "reviewable acceptance criteria",
  "beginner time label",
  "contributor level label",
  "human helpful notes"
];

// Table 1: score/rating progression by how many checks pass, covering the
// 0 and 100 extremes and the rating boundaries (100 >= 95 excellent,
// 86 >= 80 strong, 71 and below needs polish).
const progressionCases: { passedChecks: number; score: number; rating: Rating }[] = [
  { passedChecks: 0, score: 0, rating: "needs polish" },
  { passedChecks: 1, score: 14, rating: "needs polish" },
  { passedChecks: 2, score: 29, rating: "needs polish" },
  { passedChecks: 3, score: 43, rating: "needs polish" },
  { passedChecks: 4, score: 57, rating: "needs polish" },
  { passedChecks: 5, score: 71, rating: "needs polish" },
  { passedChecks: 6, score: 86, rating: "strong" },
  { passedChecks: 7, score: 100, rating: "excellent" }
];

for (const testCase of progressionCases) {
  const result = scoreDailyIssue(issueWithChecks(testCase.passedChecks));
  assert.equal(
    result.score,
    testCase.score,
    `expected score ${testCase.score} when ${testCase.passedChecks} check(s) pass`
  );
  assert.equal(
    result.rating,
    testCase.rating,
    `expected rating "${testCase.rating}" when ${testCase.passedChecks} check(s) pass`
  );
}

// Perfect issue reports every check as passing, in order.
const perfect = scoreDailyIssue(issueWithChecks(7));
assert.deepEqual(
  perfect.checks,
  checkLabels.map((label) => withCheck(label, true))
);

// Nothing passing reports every check as needing work.
const empty = scoreDailyIssue(issueWithChecks(0));
assert.equal(empty.score, 0);
assert.equal(empty.rating, "needs polish");
assert.deepEqual(
  empty.checks,
  checkLabels.map((label) => withCheck(label, false))
);

// Table 2: each individual check in isolation. One broken check on an
// otherwise perfect issue drops the score to 86 ("strong") and flags exactly
// that one label as needing work.
const singleCheckCases: {
  name: string;
  overrides: Partial<DailyIssue>;
  failedLabel: string;
}[] = [
  {
    name: "context one char below the 50 trim threshold",
    overrides: { context: "c".repeat(49) },
    failedLabel: "clear context"
  },
  {
    name: "goal one char below the 40 trim threshold",
    overrides: { goal: "g".repeat(39) },
    failedLabel: "focused goal"
  },
  {
    name: "no suggested files",
    overrides: { suggestedFiles: [] },
    failedLabel: "suggested files"
  },
  {
    name: "only two acceptance criteria",
    overrides: { acceptanceCriteria: ["first", "second"] },
    failedLabel: "reviewable acceptance criteria"
  },
  {
    name: "time label missing the space after the prefix",
    overrides: { labels: ["time:30 min", levelLabelPass] },
    failedLabel: "beginner time label"
  },
  {
    name: "level label with the wrong capitalization",
    overrides: { labels: [timeLabelPass, "Level: first-pr"] },
    failedLabel: "contributor level label"
  },
  {
    name: "no helpful notes",
    overrides: { helpfulNotes: [] },
    failedLabel: "human helpful notes"
  }
];

for (const testCase of singleCheckCases) {
  const broken = scoreDailyIssue({ ...issueWithChecks(7), ...testCase.overrides });
  assert.equal(broken.score, 86, testCase.name);
  assert.equal(broken.rating, "strong", testCase.name);
  assert.equal(
    broken.checks.filter((check) => check.startsWith("needs work:")).length,
    1,
    `${testCase.name}: exactly one check should need work`
  );
  assert.ok(
    broken.checks.includes(withCheck(testCase.failedLabel, false)),
    `${testCase.name}: expected "needs work" on "${testCase.failedLabel}"`
  );
}

// Exactly three acceptance criteria pass the minimum, exactly one file/note
// passes the "non-empty" checks.
const atMinimum = scoreDailyIssue({
  ...issueWithChecks(7),
  suggestedFiles: ["one file"],
  acceptanceCriteria: ["one", "two", "three"],
  helpfulNotes: ["one note"]
});
assert.equal(atMinimum.score, 100, "minimum list sizes should still pass");

// Table 3: trim/length edges. Whitespace is stripped before measuring, and
// prefix matching is exact (no trimming, case-sensitive).
const trimEdgeCases: {
  name: string;
  overrides: Partial<DailyIssue>;
  score: number;
}[] = [
  {
    name: "context reaches 50 chars after trimming padding",
    overrides: { context: `   ${"c".repeat(50)}   ` },
    score: 100
  },
  {
    name: "context padding cannot rescue 49 real chars",
    overrides: { context: `   ${"c".repeat(49)}   ` },
    score: 86
  },
  {
    name: "goal reaches 40 chars after trimming tabs and newlines",
    overrides: { goal: `\t\n${"g".repeat(40)}\t\n` },
    score: 100
  },
  {
    name: "goal padding cannot rescue 39 real chars",
    overrides: { goal: `  ${"g".repeat(39)}  ` },
    score: 86
  },
  {
    name: "whitespace-only context fails despite being long",
    overrides: { context: " ".repeat(80) },
    score: 86
  },
  {
    name: "leading space in a time label breaks the prefix match",
    overrides: { labels: [` ${timeLabelPass}`, levelLabelPass] },
    score: 86
  },
  {
    name: "whitespace-only suggested file still counts",
    overrides: { suggestedFiles: [" "] },
    score: 100
  },
  {
    name: "blank acceptance criteria still count toward the minimum of three",
    overrides: { acceptanceCriteria: ["", "", ""] },
    score: 100
  },
  {
    name: "whitespace-only helpful note still counts",
    overrides: { helpfulNotes: [" "] },
    score: 100
  }
];

for (const testCase of trimEdgeCases) {
  const result = scoreDailyIssue({ ...issueWithChecks(7), ...testCase.overrides });
  assert.equal(result.score, testCase.score, testCase.name);
}

// Labels from other prefixes do not satisfy the time/level checks.
const foreignLabels = scoreDailyIssue({
  ...issueWithChecks(7),
  labels: ["daily starter issue", "good first issue", "level: first-pr"]
});
assert.equal(foreignLabels.score, 86, "missing time label should cost exactly one check");
assert.ok(
  foreignLabels.checks.includes(withCheck("beginner time label", false)),
  "missing time label should be flagged"
);
assert.ok(
  foreignLabels.checks.includes(withCheck("contributor level label", true)),
  "present level label should still pass"
);

console.log("Issue quality scoring tests passed.");
