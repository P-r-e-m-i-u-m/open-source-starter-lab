import assert from "node:assert/strict";
import { extractTip } from "../src/plugins/mentor.js";

// Strips internal HTML comments
assert.equal(
  extractTip("<!-- oss-lab-assignment-helper --> Done.", "docs"),
  "Done."
);

// Strips markdown blockquote indicators
assert.equal(
  extractTip("> Always run tests before opening a PR. Check the logs.", "testing"),
  "Always run tests before opening a PR."
);

// Strips markdown links and preserves link text
assert.equal(
  extractTip("Refer to the [contributing guide](https://example.com/docs) for details.", "docs"),
  "Refer to the contributing guide for details."
);

// Strips user @mentions
assert.equal(
  extractTip("Thanks @maintainer for reviewing this solution.", "git"),
  "Thanks for reviewing this solution."
);

// Normalizes extra whitespace and newlines
assert.equal(
  extractTip("Keep   functions    small and focused.\n\nNext sentence.", "javascript"),
  "Keep functions small and focused."
);

// Provides default fallback message when body is undefined
assert.equal(
  extractTip(undefined, "python"),
  "Ask them how they approach python work in this repository."
);

// Provides default fallback message when body is empty or whitespace-only
assert.equal(
  extractTip("   \n\t  ", "html-css"),
  "Ask them how they approach html-css work in this repository."
);

// Provides default fallback message when body only contains stripped comments
assert.equal(
  extractTip("<!-- only a comment -->", "testing"),
  "Ask them how they approach testing work in this repository."
);

// Extracts only the first sentence when multiple sentences are present
assert.equal(
  extractTip("Start with smaller issues first! They help build confidence.", "git"),
  "Start with smaller issues first!"
);

// Truncates long first sentence exceeding 160 characters to 157 characters + '...'
const longSentence = "A".repeat(170) + ". Second sentence.";
const truncated = extractTip(longSentence, "testing");
assert.equal(truncated.length, 160);
assert.equal(truncated, "A".repeat(157) + "...");

console.log("Mentor tests passed.");
