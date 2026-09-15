import assert from "node:assert/strict";
import {
  getDayIndex,
  chooseIssues,
  chooseIssueCandidates,
  issueAlreadyExists,
  selectFreshDailyIssues,
  type ExistingIssue
} from "../src/dailyIssueSelection.js";
import { dailyIssueBacklog } from "../src/dailyIssueBacklog.js";

// getDayIndex should return 0 for the first day of 2026.
assert.equal(getDayIndex(new Date("2026-01-01T00:00:00Z")), 0);

// Each following day should increase the index by one.
assert.equal(getDayIndex(new Date("2026-01-02T00:00:00Z")), 1);
assert.equal(getDayIndex(new Date("2026-01-10T00:00:00Z")), 9);

// Dates before the backlog start should not produce a negative index.
assert.equal(getDayIndex(new Date("2025-12-31T00:00:00Z")), 0);

// chooseIssues should return exactly the requested number of issues.
const chosen = chooseIssues(3, new Date("2026-01-01T00:00:00Z"));
assert.equal(chosen.length, 3);
assert.deepEqual(chosen, dailyIssueBacklog.slice(0, 3));

// chooseIssues should continue from the calculated position on another day.
const nextDay = chooseIssues(2, new Date("2026-01-02T00:00:00Z"));
assert.deepEqual(nextDay, dailyIssueBacklog.slice(2, 4));

// chooseIssueCandidates should return the complete backlog in rotated order.
const candidates = chooseIssueCandidates(new Date("2026-01-01T00:00:00Z"));
assert.equal(candidates.length, dailyIssueBacklog.length);
assert.deepEqual(candidates, dailyIssueBacklog);

// On the second day, candidates should start from the second backlog item
// and wrap around to the beginning.
const rotatedCandidates = chooseIssueCandidates(new Date("2026-01-02T00:00:00Z"));
assert.equal(rotatedCandidates[0], dailyIssueBacklog[1]);
assert.equal(
  rotatedCandidates[rotatedCandidates.length - 1],
  dailyIssueBacklog[0]
);

// issueAlreadyExists should find a matching title.
const existingIssue: ExistingIssue = {
  title: "Example issue",
  html_url: "https://github.com/example/repo/issues/1"
};

assert.deepEqual(
  issueAlreadyExists([existingIssue], "Example issue"),
  existingIssue
);

// Matching should ignore capitalization and surrounding whitespace.
assert.deepEqual(
  issueAlreadyExists([existingIssue], "  EXAMPLE ISSUE  "),
  existingIssue
);

// A different title should not be treated as a duplicate.
assert.equal(
  issueAlreadyExists([existingIssue], "Different issue"),
  undefined
);

// selectFreshDailyIssues should return requested fresh issues when
// there are no duplicates.
const nothingOpen = selectFreshDailyIssues(candidates, [], 3);

assert.equal(nothingOpen.fresh.length, 3);
assert.equal(nothingOpen.duplicates.length, 0);
assert.deepEqual(
  nothingOpen.fresh,
  candidates.slice(0, 3)
);

// When candidates already exist as open issues, they should be skipped
// and recorded as duplicates while the selector continues looking.
function asOpenIssues(titles: string[]): ExistingIssue[] {
  return titles.map((title, index) => ({
    title,
    html_url: `https://github.com/example/repo/issues/${index + 1}`
  }));
}

const alreadyOpen = asOpenIssues(
  candidates.slice(0, 2).map((issue) => issue.title)
);

const withDuplicates = selectFreshDailyIssues(candidates, alreadyOpen, 3);

assert.equal(withDuplicates.duplicates.length, 2);
assert.deepEqual(
  withDuplicates.duplicates.map((duplicate) => duplicate.issue.title),
  alreadyOpen.map((issue) => issue.title)
);
assert.deepEqual(
  withDuplicates.duplicates.map((duplicate) => duplicate.existing.html_url),
  alreadyOpen.map((issue) => issue.html_url)
);
assert.equal(withDuplicates.fresh.length, 3);
assert.deepEqual(
  withDuplicates.fresh.map((issue) => issue.title),
  candidates.slice(2, 5).map((issue) => issue.title)
);

// If every candidate already exists, no fresh issues should be selected.
const everythingOpen = selectFreshDailyIssues(
  candidates,
  asOpenIssues(candidates.map((issue) => issue.title)),
  5
);

assert.equal(everythingOpen.fresh.length, 0);
assert.equal(everythingOpen.duplicates.length, candidates.length);

console.log("Daily issue selection tests passed.");