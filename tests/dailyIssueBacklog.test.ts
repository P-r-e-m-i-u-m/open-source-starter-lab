import assert from "node:assert/strict";
import { dailyIssueBacklog, type DailyIssue } from "../src/dailyIssueBacklog.js";

// The backlog is a static curated list: no network or API calls here,
// only structural checks so regressions in shape or content get caught.
assert.ok(Array.isArray(dailyIssueBacklog), "backlog should be an array");
assert.ok(
  dailyIssueBacklog.length > 0,
  "backlog should contain at least one issue"
);

// Every entry must carry the shared label so the daily issue bot
// picks it up as a starter issue.
for (const issue of dailyIssueBacklog) {
  assert.ok(
    issue.labels.includes("daily starter issue"),
    `"${issue.title}" should be labeled "daily starter issue"`
  );
}

// Titles must be unique so duplicate detection in dailyIssueSelection
// can tell backlog items apart.
const titles = dailyIssueBacklog.map((issue) => issue.title);
assert.equal(
  new Set(titles).size,
  titles.length,
  "backlog titles should be unique"
);

function assertNonEmptyString(value: unknown, context: string): void {
  assert.equal(typeof value, "string", `${context} should be a string`);
  assert.ok(
    (value as string).trim().length > 0,
    `${context} should not be blank`
  );
}

function assertNonEmptyStringArray(
  value: unknown,
  context: string
): void {
  assert.ok(Array.isArray(value), `${context} should be an array`);
  assert.ok(
    (value as unknown[]).length > 0,
    `${context} should not be empty`
  );
  for (const entry of value as unknown[]) {
    assertNonEmptyString(entry, `${context} entry`);
  }
}

// Every entry must satisfy the DailyIssue shape with usable content.
function assertIssueShape(issue: DailyIssue): void {
  assertNonEmptyString(issue.title, "title");
  assertNonEmptyString(issue.context, `context for "${issue.title}"`);
  assertNonEmptyString(issue.goal, `goal for "${issue.title}"`);
  assertNonEmptyStringArray(issue.labels, `labels for "${issue.title}"`);
  assertNonEmptyStringArray(
    issue.suggestedFiles,
    `suggestedFiles for "${issue.title}"`
  );
  assertNonEmptyStringArray(
    issue.acceptanceCriteria,
    `acceptanceCriteria for "${issue.title}"`
  );
  assertNonEmptyStringArray(
    issue.helpfulNotes,
    `helpfulNotes for "${issue.title}"`
  );
}

for (const issue of dailyIssueBacklog) {
  assertIssueShape(issue);
}

console.log("Daily issue backlog tests passed.");
