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
assert.ok(!comment.includes("Suggested next edit:"));
assert.ok(!comment.includes("Optional cleanup:"));

// 5. An incomplete returning-contributor PR gets specific, unchecked feedback.
const incompletePr = { ...samplePr, body: null };
const incompleteComment = buildComment(
  incompletePr,
  false,
  analyzePrBody(incompletePr.body)
);

assert.ok(
  incompleteComment.includes(
    "Thanks @new-contributor. I picked this up for a quick review-readiness check."
  )
);
assert.ok(!incompleteComment.includes("first PR here"));
assert.ok(incompleteComment.includes("A few small things will make this easier to review:"));
assert.ok(
  incompleteComment.includes([
    "- [ ] Clear summary of what changed",
    "- [ ] Testing or verification section",
    "- [ ] Mentions `npm run check`",
    "- [ ] Links an issue when there is one"
  ].join("\n"))
);
assert.ok(
  incompleteComment.includes([
    "Suggested next edit:",
    "- add a short `What changed` or `Summary` section",
    "- add a `Testing` section",
    "- paste the `npm run check` result when you have it"
  ].join("\n"))
);

// 6. Missing only an issue link is optional cleanup, not a readiness blocker.
const unlinkedPr = {
  ...samplePr,
  body: "## Summary\nImproved the guide.\n## Testing\nnpm run check passed."
};
const unlinkedComment = buildComment(unlinkedPr, false, analyzePrBody(unlinkedPr.body));

assert.ok(unlinkedComment.includes("This already has the main review signals I look for."));
assert.ok(unlinkedComment.includes("- [ ] Links an issue when there is one"));
assert.ok(
  unlinkedComment.includes(
    "Optional cleanup:\n- If this PR solves an issue, add `Closes #issue-number` so GitHub can close it cleanly."
  )
);
assert.ok(!unlinkedComment.includes("Suggested next edit:"));

console.log("Welcome pull request script tests passed.");