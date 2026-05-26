import assert from "node:assert/strict";
import { buildChecklist } from "../src/checklist.js";
import { findIssueFit } from "../src/issueFitFinder.js";
import { issueIdeas } from "../src/issueIdeas.js";
import { getProgressionStep, listProgressionSteps, normalizeContributorLevel } from "../src/progressionPath.js";

const beginner = buildChecklist("beginner");
assert.equal(beginner.profile, "beginner");
assert.ok(beginner.items.length >= 5);
assert.ok(beginner.items.some((item) => item.command?.includes("git clone")));

const maintainer = buildChecklist("maintainer");
assert.equal(maintainer.profile, "maintainer");
assert.ok(maintainer.items.some((item) => item.id === "answers"));

assert.ok(issueIdeas.length >= 5);
assert.ok(issueIdeas.every((idea) => idea.acceptanceCriteria.length >= 3));

const docsFit = findIssueFit("docs", "30m");
assert.equal(docsFit.skill, "docs");
assert.equal(docsFit.timeBudget, "30m");
assert.ok(docsFit.issueSearchUrl.includes("no%3Aassignee"));
assert.ok(docsFit.commentTemplate.includes("Please assign this to me"));

// Test that the issue search URL is actionable
assert.ok(docsFit.issueSearchUrl.startsWith("https://github.com"));
assert.ok(docsFit.issueSearchUrl.includes("is%3Aopen")); // URL-encoded

const jsFit = findIssueFit("ts", "1h");
assert.equal(jsFit.skill, "javascript");
assert.ok(jsFit.proofChecklist.some((item) => item.includes("full project check")));

const progressionSteps = listProgressionSteps();
assert.equal(progressionSteps.length, 5);
assert.equal(normalizeContributorLevel("second pr"), "second-pr");

const maintainerShadow = getProgressionStep("maintainer-shadow");
assert.ok(maintainerShadow.labels.includes("maintainer shadow"));
assert.ok(maintainerShadow.proof.some((item) => item.includes("before/after")));

console.log("Smoke tests passed.");
