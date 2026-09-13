import assert from "node:assert/strict";
import { topContributorsByMergedPRs, type MergedPullRequest } from "../src/plugins/leaderboard.js";

const referenceDate = new Date("2026-09-12");

const sample: MergedPullRequest[] = [
  { username: "alice", mergedAt: new Date("2026-09-01") },
  { username: "alice", mergedAt: new Date("2026-09-05") },
  { username: "alice", mergedAt: new Date("2026-09-10") },
  { username: "bob", mergedAt: new Date("2026-09-08") },
  { username: "bob", mergedAt: new Date("2026-09-09") },
  { username: "carol", mergedAt: new Date("2026-09-11") },
  // Outside the 30-day window from the reference date, should not be counted.
  { username: "dave", mergedAt: new Date("2026-06-01") }
];

const result = topContributorsByMergedPRs(sample, referenceDate);

assert.equal(result.length, 3);
assert.deepEqual(result[0], { username: "alice", mergedPullRequests: 3 });
assert.deepEqual(result[1], { username: "bob", mergedPullRequests: 2 });
assert.deepEqual(result[2], { username: "carol", mergedPullRequests: 1 });
assert.ok(!result.some((entry) => entry.username === "dave"));

// Respects a custom limit.
const top1 = topContributorsByMergedPRs(sample, referenceDate, 30, 1);
assert.equal(top1.length, 1);
assert.equal(top1[0].username, "alice");

// Ties are broken alphabetically by username.
const tied: MergedPullRequest[] = [
  { username: "zed", mergedAt: new Date("2026-09-05") },
  { username: "amy", mergedAt: new Date("2026-09-05") }
];
const tiedResult = topContributorsByMergedPRs(tied, referenceDate);
assert.equal(tiedResult[0].username, "amy");
assert.equal(tiedResult[1].username, "zed");

// A PR merged exactly on the cutoff boundary should still count.
const cutoffDate = new Date(referenceDate);
cutoffDate.setDate(cutoffDate.getDate() - 30);
const boundary: MergedPullRequest[] = [{ username: "edge", mergedAt: cutoffDate }];
const boundaryResult = topContributorsByMergedPRs(boundary, referenceDate);
assert.equal(boundaryResult.length, 1);
assert.equal(boundaryResult[0].username, "edge");

// No merged PRs in range returns an empty list.
const empty = topContributorsByMergedPRs([{ username: "old", mergedAt: new Date("2020-01-01") }], referenceDate);
assert.equal(empty.length, 0);

console.log("leaderboard.test.ts passed");