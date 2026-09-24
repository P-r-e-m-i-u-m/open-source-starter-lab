import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { findRepoIssueIdeas } from "../scripts/findRepoIssueIdeas.js";

const root = mkdtempSync(join(tmpdir(), "repo-issue-ideas-"));

mkdirSync(join(root, "src"), { recursive: true });
mkdirSync(join(root, "scripts"), { recursive: true });
mkdirSync(join(root, "tests"), { recursive: true });
mkdirSync(join(root, "docs/recipes"), { recursive: true });

writeFileSync(
  join(root, "src", "example.ts"),
  "// TODO: wire this up to the real API\nexport function example() {}\n"
);
writeFileSync(
  join(root, "src", "untested.ts"),
  "export function untested() { return 1; }\n"
);
writeFileSync(join(root, "tests", "smoke.test.ts"), "// no coverage here\n");
writeFileSync(
  join(root, "docs/recipes", "sample-recipe.md"),
  "# Recipe: Sample Recipe\n\n<!-- TODO: explain the sample recipe -->\n"
);

const issues = findRepoIssueIdeas([], root);

assert.ok(Array.isArray(issues));
assert.ok(issues.length > 0);

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

const existingTitles = issues.flatMap((issue) => issue.suggestedFiles);
const filteredIssues = findRepoIssueIdeas(existingTitles, root);

assert.ok(
  filteredIssues.length < issues.length,
  "Known issue paths should be filtered out"
);

rmSync(root, { recursive: true, force: true });

console.log("Find repo issue ideas tests passed.");
