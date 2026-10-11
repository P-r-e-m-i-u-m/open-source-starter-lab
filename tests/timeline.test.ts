import assert from "node:assert/strict";
import {
  getContributorTimeline,
  parseContributorTimeline,
  timeline
} from "../src/plugins/timeline.js";

const contents = `
| #304 | 2026-09-10 | merged | Add timeline command |
| #279 | 2026-09-07 | merged | Add contributor timeline |
| #283 | 2026-09-10 | merged | Improve timeline output |
| invalid | not-a-date | merged | Ignore this row |
`;

const entries = parseContributorTimeline(contents);

assert.deepEqual(entries, [
  {
    prNumber: 279,
    date: "2026-09-07",
    title: "Add contributor timeline"
  },
  {
    prNumber: 283,
    date: "2026-09-10",
    title: "Improve timeline output"
  },
  {
    prNumber: 304,
    date: "2026-09-10",
    title: "Add timeline command"
  }
]);

const manyEntries = parseContributorTimeline(`
| #1 | 2026-01-01 | merged | First PR |
| #2 | 2026-01-02 | merged | Second PR |
| #3 | 2026-01-03 | merged | Third PR |
| #4 | 2026-01-04 | merged | Fourth PR |
| #5 | 2026-01-05 | merged | Fifth PR |
| #6 | 2026-01-06 | merged | Sixth PR |
`);

assert.equal(manyEntries.length, 5);

// getContributorTimeline tests
// Returns empty array for invalid usernames
assert.deepEqual(getContributorTimeline(""), []);
assert.deepEqual(getContributorTimeline("invalid username!"), []);
assert.deepEqual(getContributorTimeline("@user/with/slashes"), []);

// Returns empty array for non-existent contributor passport file
assert.deepEqual(getContributorTimeline("non-existent-contributor-xyz"), []);

// Returns parsed timeline entries for existing contributor passport
const premEntries = getContributorTimeline("p-r-e-m-i-u-m");
assert.ok(premEntries.length > 0);
assert.equal(premEntries[0].prNumber, 77);
assert.equal(premEntries[0].date, "2026-06-04");

// Handles leading @ symbol properly for existing contributor
const premWithAt = getContributorTimeline("@P-r-e-m-i-u-m");
assert.deepEqual(premWithAt, premEntries);

// timeline CLI output tests
const originalLog = console.log;

// Logs error message when username is invalid
const invalidLogMessages: string[] = [];
try {
  console.log = (message: string) => invalidLogMessages.push(message);
  timeline("invalid username!");
} finally {
  console.log = originalLog;
}
assert.deepEqual(invalidLogMessages, ["Provide a valid GitHub username."]);

// Logs notice when contributor has no verified merged PRs
const missingLogMessages: string[] = [];
try {
  console.log = (message: string) => missingLogMessages.push(message);
  timeline("non-existent-contributor-xyz");
} finally {
  console.log = originalLog;
}
assert.deepEqual(missingLogMessages, [
  "@non-existent-contributor-xyz first merged PR timeline\n",
  "No verified merged pull requests found for this contributor."
]);

// Logs formatted list for contributor with verified merged PRs
const validLogMessages: string[] = [];
try {
  console.log = (message: string) => validLogMessages.push(message);
  timeline("p-r-e-m-i-u-m");
} finally {
  console.log = originalLog;
}
assert.equal(validLogMessages[0], "@p-r-e-m-i-u-m first merged PR timeline\n");
assert.ok(validLogMessages[1].startsWith("1. 2026-06-04 -> #77 -> "));

console.log("Timeline tests passed.");

// Empty input returns no entries
assert.deepEqual(parseContributorTimeline(""), []);

// Malformed and incomplete rows are ignored
assert.deepEqual(
  parseContributorTimeline(`
| #10 | 2026-01-01 | merged |
| #11 | 2026-01-02 |
| #12 | invalid-date | merged | Invalid date |
| not-a-number | 2026-01-03 | merged | Invalid PR |
`),
  []
);

// PR numbers must contain digits only
assert.deepEqual(
  parseContributorTimeline(`
| #abc | 2026-01-01 | merged | Invalid PR |
| #12x | 2026-01-02 | merged | Invalid PR |
| #13 | 2026-01-03 | merged | Valid PR |
`),
  [
    {
      prNumber: 13,
      date: "2026-01-03",
      title: "Valid PR"
    }
  ]
);

// Equal dates are sorted by ascending PR number
assert.deepEqual(
  parseContributorTimeline(`
| #30 | 2026-01-01 | merged | Third |
| #10 | 2026-01-01 | merged | First |
| #20 | 2026-01-01 | merged | Second |
`),
  [
    { prNumber: 10, date: "2026-01-01", title: "First" },
    { prNumber: 20, date: "2026-01-01", title: "Second" },
    { prNumber: 30, date: "2026-01-01", title: "Third" }
  ]
);

// Entries are sorted before the five-entry limit is applied
const limitedEntries = parseContributorTimeline(`
| #6 | 2026-01-06 | merged | Sixth |
| #5 | 2026-01-05 | merged | Fifth |
| #4 | 2026-01-04 | merged | Fourth |
| #3 | 2026-01-03 | merged | Third |
| #2 | 2026-01-02 | merged | Second |
| #1 | 2026-01-01 | merged | First |
`);

assert.deepEqual(
  limitedEntries.map((entry) => entry.prNumber),
  [1, 2, 3, 4, 5]
);

// Whitespace and uppercase usernames are normalized
assert.deepEqual(
  getContributorTimeline("  @P-r-e-m-i-u-m  "),
  premEntries
);

console.log("Additional timeline tests passed.");

