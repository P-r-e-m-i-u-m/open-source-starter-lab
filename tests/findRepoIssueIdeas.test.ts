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
// should prevent those exact paths from being suggested again,
// even if a large enough candidate pool means the total count stays the same.
const existingTitles = issues.flatMap((issue) => issue.suggestedFiles);
const knownPrimaryPaths = new Set(issues.map((issue) => issue.suggestedFiles[0]));

const filteredIssues = findRepoIssueIdeas(existingTitles);

for (const issue of filteredIssues) {
  assert.ok(
    !knownPrimaryPaths.has(issue.suggestedFiles[0]),
    `Known issue path ${issue.suggestedFiles[0]} should have been filtered out`
  );
}

console.log("Find repo issue ideas tests passed.");
