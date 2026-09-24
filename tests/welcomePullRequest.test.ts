import assert from "node:assert";
import {
  analyzePrBody,
  formatCheck,
  buildComment
} from "../scripts/welcomePullRequest.js";

// 1. Complete PR body
const completeBody =
  "## What changed\nAdded docs\n## Testing\nVerified with npm run check. Closes #123";

const quality = analyzePrBody(completeBody);

assert.strictEqual(quality.hasWhatChanged, true);
assert.strictEqual(quality.hasTesting, true);
assert.strictEqual(quality.hasCheckCommand, true);
assert.strictEqual(quality.hasLinkedIssue, true);

// 2. Incomplete PR body
const sparseQuality = analyzePrBody(null);

assert.strictEqual(sparseQuality.hasWhatChanged, false);
assert.strictEqual(sparseQuality.hasTesting, false);
assert.strictEqual(sparseQuality.hasCheckCommand, false);
assert.strictEqual(sparseQuality.hasLinkedIssue, false);

// 3. Check formatting
assert.strictEqual(
  formatCheck("Test label", true),
  "- [x] Test label"
);

assert.strictEqual(
  formatCheck("Test label", false),
  "- [ ] Test label"
);

// 4. Build comment
const samplePr = {
  number: 123,
  title: "docs: improve first PR guide",
  body: completeBody,
  html_url:
    "https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/pull/123",
  user: {
    login: "new-contributor",
    type: "User"
  },
  base: {
    repo: {
      full_name: "P-r-e-m-i-u-m/open-source-starter-lab"
    }
  }
};

const comment = buildComment(samplePr, true, quality);

assert.ok(comment.includes("Thanks @new-contributor"));
assert.ok(comment.includes("first PR here"));
assert.ok(comment.includes("Clear summary of what changed"));
assert.ok(comment.includes("- [x] Testing or verification section"));
assert.ok(comment.includes("- [x] Mentions `npm run check`"));
assert.ok(comment.includes("- [x] Links an issue when there is one"));
assert.ok(comment.includes("oss-lab-pr-welcome-guard"));

console.log("Welcome pull request script tests passed.");