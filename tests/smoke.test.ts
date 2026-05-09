import assert from "node:assert/strict";
import { buildChecklist } from "../src/checklist.js";
import { issueIdeas } from "../src/issueIdeas.js";

const beginner = buildChecklist("beginner");
assert.equal(beginner.profile, "beginner");
assert.ok(beginner.items.length >= 5);
assert.ok(beginner.items.some((item) => item.command?.includes("git clone")));

const maintainer = buildChecklist("maintainer");
assert.equal(maintainer.profile, "maintainer");
assert.ok(maintainer.items.some((item) => item.id === "answers"));

assert.ok(issueIdeas.length >= 5);
assert.ok(issueIdeas.every((idea) => idea.acceptanceCriteria.length >= 3));

console.log("Smoke tests passed.");
