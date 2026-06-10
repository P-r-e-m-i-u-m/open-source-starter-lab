import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { buildChecklist } from "../src/checklist.js";
import { findIssueFit } from "../src/issueFitFinder.js";
import { issueIdeas } from "../src/issueIdeas.js";
import { dailyIssueBacklog } from "../src/dailyIssueBacklog.js";
import { scoreDailyIssue } from "../src/issueQuality.js";
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
assert.ok(dailyIssueBacklog.every((issue) => scoreDailyIssue(issue).score >= 80));

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
assert.ok(maintainerShadow.labels.includes("level: maintainer-practice"));
assert.ok(maintainerShadow.proof.some((item) => item.includes("before/after")));

const cliPath = path.resolve("dist/src/cli.js");
const jsonOutput = execFileSync("node", [cliPath, "issues", "--json"], { encoding: "utf8" });
const parsedIssues = JSON.parse(jsonOutput);
assert.ok(Array.isArray(parsedIssues));
assert.equal(parsedIssues.length, issueIdeas.length);
for (const idea of parsedIssues) {
  assert.equal(typeof idea.title, "string");
  assert.equal(typeof idea.label, "string");
  assert.equal(typeof idea.difficulty, "string");
  assert.equal(typeof idea.goal, "string");
  assert.ok(Array.isArray(idea.acceptanceCriteria));
  assert.ok(idea.acceptanceCriteria.length >= 3);
}

const profilesOutput = execFileSync("node", [cliPath, "profiles"], {
  encoding: "utf8"
});

assert.ok(profilesOutput.includes("beginner"));
assert.ok(profilesOutput.includes("maintainer"));
assert.ok(profilesOutput.includes("first or early open-source contribution"));
assert.ok(profilesOutput.includes("reviewing, organizing, or supporting contributor work"));

let unknownCommandOutput = "";

try {
  execFileSync("node", [cliPath, "not-a-real-command"], {
    encoding: "utf8",
    stdio: "pipe"
  });

  assert.fail("Unknown command should fail");
} catch (error) {
  unknownCommandOutput = String(error);
}

assert.ok(
  unknownCommandOutput.includes("Unknown command"),
  "Expected output to include 'Unknown command'"
);

console.log("Smoke tests passed.");
