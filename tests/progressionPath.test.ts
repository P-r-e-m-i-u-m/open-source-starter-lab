import assert from "node:assert/strict";
import {
  getProgressionStep,
  listProgressionSteps,
  normalizeContributorLevel
} from "../src/progressionPath.js";

const firstPr = getProgressionStep("first-pr");
assert.equal(firstPr.level, "first-pr");
assert.equal(firstPr.title, "First PR");
assert.equal(firstPr.firstCommand, "npm run check");
for (const level of [
  "first-pr",
  "second-pr",
  "trust-builder",
  "maintainer-shadow",
  "bigger-task"
] as const) {
  assert.equal(getProgressionStep(level).level, level);
}
assert.throws(() => getProgressionStep("unknown" as never), /Unknown contributor level/);
const steps = listProgressionSteps();
assert.deepEqual(
  steps.map((step) => step.level),
  ["first-pr", "second-pr", "trust-builder", "maintainer-shadow", "bigger-task"]
);
assert.notEqual(listProgressionSteps(), steps);
assert.equal(normalizeContributorLevel("second-pr"), "second-pr");
assert.equal(normalizeContributorLevel(" First PR "), "first-pr");
assert.equal(normalizeContributorLevel("trust"), "trust-builder");
assert.equal(normalizeContributorLevel("MAINTAINER SHADOW"), "maintainer-shadow");
assert.equal(normalizeContributorLevel("bigger"), "bigger-task");
assert.throws(
  () => normalizeContributorLevel("expert"),
  /Use --level first-pr, second-pr, trust-builder, maintainer-shadow, or bigger-task/
);
console.log("Progression path tests passed.");

/*
  This file verifies the contributor progression path: valid levels return the correct step,
  the full ordered path is available without exposing its stored array, and user-friendly
  aliases (including spacing and casing differences) normalize to a supported level.
  Invalid levels must throw clear errors so the CLI can guide contributors correctly.
*/
