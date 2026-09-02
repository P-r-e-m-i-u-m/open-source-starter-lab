import assert from "node:assert/strict";
import { buildChecklist } from "../src/checklist.js";

const beginner = buildChecklist("beginner");

assert.equal(beginner.profile, "beginner");
assert.equal(beginner.score, 76);
assert.equal(beginner.items.length, 5);
assert.equal(
  beginner.nextAction,
  "Pick one good first issue and comment that you want to work on it."
);

console.log("Checklist tests passed.");

