import assert from "node:assert/strict";

import {
  currentPrStreak,
  formatPrStreak
} from "../src/plugins/streak.js";

const referenceDate = new Date("2026-09-16T12:00:00Z");

assert.deepEqual(
  currentPrStreak(
    [
      "2026-09-16T08:00:00Z",
      "2026-09-15T14:00:00Z",
      "2026-09-14T09:00:00Z"
    ],
    referenceDate
  ),
  {
    days: 3,
    latestMergeDate: "2026-09-16"
  }
);

// Multiple merges on one calendar day only count once.
assert.deepEqual(
  currentPrStreak(
    [
      "2026-09-16T18:00:00Z",
      "2026-09-16T08:00:00Z",
      "2026-09-15T14:00:00Z"
    ],
    referenceDate
  ),
  {
    days: 2,
    latestMergeDate: "2026-09-16"
  }
);

// A streak through yesterday remains active while today is still in progress.
assert.deepEqual(
  currentPrStreak(
    [
      "2026-09-15T14:00:00Z",
      "2026-09-14T09:00:00Z",
      "2026-09-13T20:00:00Z"
    ],
    referenceDate
  ),
  {
    days: 3,
    latestMergeDate: "2026-09-15"
  }
);

// A missing calendar day ends the streak at the gap.
assert.deepEqual(
  currentPrStreak(
    [
      "2026-09-16T08:00:00Z",
      "2026-09-15T14:00:00Z",
      "2026-09-13T20:00:00Z"
    ],
    referenceDate
  ),
  {
    days: 2,
    latestMergeDate: "2026-09-16"
  }
);

// Old activity is preserved as the latest merge date but is not a current streak.
assert.deepEqual(
  currentPrStreak(
    [
      "2026-09-12T08:00:00Z",
      "2026-09-11T08:00:00Z"
    ],
    referenceDate
  ),
  {
    days: 0,
    latestMergeDate: "2026-09-12"
  }
);

assert.deepEqual(
  currentPrStreak(["not-a-date"], referenceDate),
  {
    days: 0,
    latestMergeDate: null
  }
);

assert.equal(
  formatPrStreak("octocat", {
    days: 1,
    latestMergeDate: "2026-09-16"
  }),
  [
    "@octocat merged PR streak",
    "",
    "Current streak: 1 day",
    "Most recent merge: 2026-09-16"
  ].join("\n")
);

assert.equal(
  formatPrStreak("octocat", {
    days: 0,
    latestMergeDate: null
  }),
  [
    "@octocat merged PR streak",
    "",
    "Current streak: 0 days",
    "Most recent merge: none"
  ].join("\n")
);

console.log("Contributor PR streak tests passed.");
