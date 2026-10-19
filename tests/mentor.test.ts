import assert from "node:assert/strict";
import { extractTip, mentor } from "../src/plugins/mentor.js";

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

// Tests the main mentor workflow without contacting GitHub.
const originalFetch = globalThis.fetch;
const originalLog = console.log;
const output: string[] = [];
const issueBase = "https://api.github.com/repos/P-r-e-m-i-u-m/open-source-starter-lab/issues";
const commentsUrl = `${issueBase}/comments?sort=created&direction=desc&per_page=50`;
const requestedUrls: string[] = [];

globalThis.fetch = async (input) => {
  const url = String(input);
  requestedUrls.push(url);

  if (url === commentsUrl) {
    return new Response(
      JSON.stringify([
        {
          body: "Write focused JavaScript tests.",
          user: { login: "automation", type: "Bot" },
          issue_url: `${issueBase}/100`
        },
        // Closed (twice), PR, missing mentor level, wrong skill, match, then unused.
        ...[101, 101, 102, 103, 104, 123, 124].map((number) => ({
          body: number === 104
            ? "Write a concise guide."
            : "Write focused JavaScript tests.",
          user: { login: "test-mentor", type: "User" },
          issue_url: `${issueBase}/${number}`
        }))
      ]),
      { status: 200 }
    );
  }

  const issueNumber = Number(url.slice(url.lastIndexOf("/") + 1));
  if (
    [101, 102, 103, 104, 123].includes(issueNumber)
    && url === `${issueBase}/${issueNumber}`
  ) {
    return new Response(
      JSON.stringify({
        number: issueNumber,
        title: issueNumber === 104 ? "Write a documentation guide" : "Add JavaScript tests",
        body: null,
        state: issueNumber === 101 ? "closed" : "open",
        labels: issueNumber === 103 ? [] : [{ name: "level: second-pr" }],
        ...(issueNumber === 102 ? { pull_request: {} } : {})
      }),
      { status: 200 }
    );
  }

  throw new Error(`Unexpected URL: ${url}`);
};

console.log = (...args: unknown[]) => {
  output.push(args.join(" "));
};

try {
  await mentor("javascript");

  assert.deepEqual(output, [
    "Mentor suggestion\n",
    "Skill: javascript",
    "Mentor: @test-mentor",
    "Tip: Write focused JavaScript tests."
  ]);
  assert.deepEqual(requestedUrls, [
    commentsUrl,
    `${issueBase}/101`,
    `${issueBase}/102`,
    `${issueBase}/103`,
    `${issueBase}/104`,
    `${issueBase}/123`
  ], "skip bots, deduplicate issues, and stop fetching after the first eligible match");

  // No match must reject without printing a misleading success suggestion.
  output.length = 0;
  globalThis.fetch = async (input) => {
    assert.equal(String(input), commentsUrl);
    return new Response("[]", { status: 200 });
  };
  await assert.rejects(mentor("python"), {
    message: "No recent mentor match found for skill: python"
  });
  assert.deepEqual(output, []);
} finally {
  globalThis.fetch = originalFetch;
  console.log = originalLog;
}
console.log("Mentor tests passed.");
