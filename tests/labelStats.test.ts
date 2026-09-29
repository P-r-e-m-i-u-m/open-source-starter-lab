import assert from "node:assert/strict";

import {
  mostUsedOpenIssueLabels,
  type GitHubIssue
} from "../src/plugins/labelStats.js";

const issues: GitHubIssue[] = [
  {
    labels: [
      { name: "documentation" },
      { name: "good first issue" }
    ]
  },
  {
    labels: [
      { name: "documentation" },
      { name: "testing" }
    ]
  },
  {
    labels: [
      "documentation",
      { name: "good first issue" },
      { name: "testing" }
    ]
  },
  {
    labels: [{ name: "documentation" }],
    pull_request: {}
  },
  {
    labels: [{ name: null }, "  "]
  }
];

const result = mostUsedOpenIssueLabels(issues);

assert.deepEqual(result, [
  { name: "documentation", openIssues: 3 },
  { name: "good first issue", openIssues: 2 },
  { name: "testing", openIssues: 2 }
]);

// Pull requests should not affect issue-label counts.
assert.equal(result[0].openIssues, 3);

// Ties are sorted alphabetically for stable output.
assert.equal(result[1].name, "good first issue");
assert.equal(result[2].name, "testing");

// The optional limit keeps the command output focused.
assert.deepEqual(mostUsedOpenIssueLabels(issues, 2), result.slice(0, 2));
assert.deepEqual(mostUsedOpenIssueLabels(issues, 0), []);

console.log("Label stats tests passed.");
