import assert from "node:assert/strict";
import { buildChecklist } from "../src/checklist.js";

const beginner = buildChecklist("beginner");

assert.equal(beginner.profile, "beginner");
assert.equal(beginner.score, 76);
assert.equal(beginner.items.length, 5);
assert.ok(beginner.items.some((item) => item.command?.includes("git clone")));
assert.equal(
  beginner.nextAction,
  "Pick one good first issue and comment that you want to work on it."
);

const maintainer = buildChecklist("maintainer");

assert.equal(maintainer.profile, "maintainer");
assert.equal(maintainer.score, 82);
assert.equal(maintainer.items.length, 5);
assert.ok(maintainer.items.some((item) => item.id === "answers"));
assert.equal(
  maintainer.nextAction,
  "Create 3 small issues with clear acceptance criteria."
);

console.log("Checklist tests passed.");
