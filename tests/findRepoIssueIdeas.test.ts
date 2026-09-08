import assert from "node:assert/strict";
import { findRepoIssueIdeas } from "../scripts/findRepoIssueIdeas.js";

const issues = findRepoIssueIdeas();

assert.ok(Array.isArray(issues));
assert.ok(issues.length > 0);
assert.ok(issues.length <= 9);

for (const issue of issues) {
  assert.ok(typeof issue.title === "string");
  assert.ok(issue.title.length > 0);

  assert.ok(Array.isArray(issue.labels));
  assert.ok(issue.labels.includes("help wanted"));

  assert.ok(typeof issue.context === "string");
  assert.ok(issue.context.length > 0);

  assert.ok(typeof issue.goal === "string");
  assert.ok(issue.goal.length > 0);

  assert.ok(Array.isArray(issue.suggestedFiles));
  assert.ok(issue.suggestedFiles.length > 0);

  assert.ok(Array.isArray(issue.acceptanceCriteria));
  assert.ok(issue.acceptanceCriteria.length > 0);
}

// Passing the paths of all discovered issues as existing titles
// should prevent those issues from being suggested again.
const existingTitles = issues.flatMap((issue) => issue.suggestedFiles);

const filteredIssues = findRepoIssueIdeas(existingTitles);

assert.ok(
  filteredIssues.length < issues.length,
  "Known issue paths should be filtered out"
);

console.log("Find repo issue ideas tests passed.");