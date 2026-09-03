import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { buildChecklist } from "../src/checklist.js";
import { findIssueFit } from "../src/issueFitFinder.js";
import { issueIdeas } from "../src/issueIdeas.js";
import { dailyIssueBacklog } from "../src/dailyIssueBacklog.js";
import { chooseIssueCandidates, selectFreshDailyIssues, type ExistingIssue } from "../src/dailyIssueSelection.js";
import { scoreDailyIssue } from "../src/issueQuality.js";
import { getProgressionStep, listProgressionSteps, normalizeContributorLevel } from "../src/progressionPath.js";

const beginner = buildChecklist("beginner");
assert.equal(beginner.profile, "beginner");
assert.ok(beginner.items.length >= 5);
assert.ok(beginner.items.some((item) => item.command?.includes("git clone")));

const maintainer = buildChecklist("maintainer");
assert.equal(maintainer.profile, "maintainer");
assert.ok(maintainer.items.some((item) => item.id === "answers"));
assert.equal(beginner.score, 76);
assert.equal(
  beginner.nextAction,
  "Pick one good first issue and comment that you want to work on it."
);

assert.equal(maintainer.score, 82);
assert.equal(
  maintainer.nextAction,
  "Create 3 small issues with clear acceptance criteria."
);

assert.ok(issueIdeas.length >= 5);
assert.ok(issueIdeas.every((idea) => idea.acceptanceCriteria.length >= 3));
assert.ok(dailyIssueBacklog.length > 0);
assert.ok(dailyIssueBacklog.every((issue) => issue.title.trim().length > 0));
assert.ok(dailyIssueBacklog.every((issue) => issue.labels.length > 0));
assert.ok(dailyIssueBacklog.every((issue) => issue.labels.includes("daily starter issue")));
assert.ok(dailyIssueBacklog.every((issue) => issue.context.trim().length > 0 && issue.goal.trim().length > 0));
assert.ok(dailyIssueBacklog.every((issue) => issue.suggestedFiles.length > 0));
assert.ok(dailyIssueBacklog.every((issue) => issue.acceptanceCriteria.length >= 3));
assert.ok(dailyIssueBacklog.every((issue) => issue.helpfulNotes.length > 0));
assert.ok(
  dailyIssueBacklog.every((issue) =>
    [issue.labels, issue.suggestedFiles, issue.acceptanceCriteria, issue.helpfulNotes].every(
      (values) => values.every((value) => value.trim().length > 0)
    )
  )
);
assert.equal(new Set(dailyIssueBacklog.map((issue) => issue.title)).size, dailyIssueBacklog.length);
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

const helpOutput = execFileSync("node", [cliPath, "help"], {
  encoding: "utf8"
});

assert.ok(helpOutput.includes("oss-lab fit --skill docs --time 30m"));
assert.ok(helpOutput.includes("Skills: html-css, javascript, python, docs, testing, git"));
assert.ok(helpOutput.includes("Time: 15m, 30m, 1h"));

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

let invalidProfileOutput = "";

try {
  execFileSync("node", [cliPath, "check", "--profile", "expert"], {
    encoding: "utf8",
    stdio: "pipe"
  });

  assert.fail("Invalid profile should fail");
} catch (error) {
  invalidProfileOutput = String(error);
}

assert.ok(
  invalidProfileOutput.includes("Use --profile beginner or --profile maintainer"),
  "Expected output to explain valid profile options"
);

const fitOutput = execFileSync("node", [cliPath, "fit", "--skill", "docs", "--time", "30m"], {
  encoding: "utf8"
});

assert.ok(fitOutput.includes("First Issue Fit Finder"), "Expected output to include title");
assert.ok(fitOutput.includes("Best path:"), "Expected output to include best path");
assert.ok(fitOutput.includes("Skill: docs"), "Expected output to show skill");
assert.ok(fitOutput.includes("Time: 30m"), "Expected output to show time budget");
assert.ok(fitOutput.includes("Proof checklist:"), "Expected output to include proof checklist");

const fitHelpOutput = execFileSync("node", [cliPath, "fit", "--help"], {
  encoding: "utf8"
});
assert.ok(fitHelpOutput.includes("First Issue Fit Finder - Help"));
assert.ok(fitHelpOutput.includes("Accepted Skills:"));
assert.ok(fitHelpOutput.includes("Accepted Time Budgets:"));

const nextOutput = execFileSync("node", [cliPath, "next", "--level", "first-pr"], {
  encoding: "utf8"
});

assert.ok(nextOutput.includes("Contributor Progression Path"), "Expected output to include title");
assert.ok(nextOutput.includes("Goal:"), "Expected output to include goal");
assert.ok(nextOutput.includes("First command:"), "Expected output to include first command");
assert.ok(nextOutput.includes("Labels to look for:"), "Expected output to include labels");

const dailyIssueDryRun = execFileSync("node", [path.resolve("dist/scripts/createDailyIssue.js"), "--dry-run", "--count", "5"], {
  encoding: "utf8"
});

assert.ok(dailyIssueDryRun.includes("Daily issue dry-run: 5 curated issue(s)"));
assert.equal((dailyIssueDryRun.match(/^## \d+\./gm) ?? []).length, 5);

// Daily issue duplicate handling tests protect backlog selection from creating duplicate issues
// without making live GitHub API calls.
const candidates = chooseIssueCandidates(new Date("2026-03-01T00:00:00Z"));
assert.equal(candidates.length, dailyIssueBacklog.length);

function asOpenIssues(titles: string[]): ExistingIssue[] {
  return titles.map((title, index) => ({
    title,
    html_url: `https://github.com/example/repo/issues/${index + 1}`
  }));
}

const nothingOpen = selectFreshDailyIssues(candidates, [], 3);
assert.equal(nothingOpen.fresh.length, 3);
assert.equal(nothingOpen.duplicates.length, 0);

// The first two candidates are already open, so the bot should skip them and
// keep walking the backlog until it still has three fresh issues.
const alreadyOpen = asOpenIssues(candidates.slice(0, 2).map((issue) => issue.title));
const withDuplicates = selectFreshDailyIssues(candidates, alreadyOpen, 3);

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

// Duplicate titles are matched without caring about capitalization.
const differentCasing = selectFreshDailyIssues(
  candidates,
  asOpenIssues([candidates[0].title.toUpperCase()]),
  1
);

assert.equal(differentCasing.duplicates.length, 1);
assert.equal(differentCasing.fresh.length, 1);
assert.notEqual(differentCasing.fresh[0].title, candidates[0].title);

// Duplicate titles differing only by leading/trailing whitespace are also matched.
const whitespaceDuplicate = selectFreshDailyIssues(
  candidates,
  asOpenIssues([`   ${candidates[0].title}   `]),
  1
);

assert.equal(whitespaceDuplicate.duplicates.length, 1);
assert.equal(whitespaceDuplicate.fresh.length, 1);
assert.notEqual(whitespaceDuplicate.fresh[0].title, candidates[0].title);

// When the whole backlog is already open the bot creates nothing instead of
// posting duplicates.
const everythingOpen = selectFreshDailyIssues(
  candidates,
  asOpenIssues(candidates.map((issue) => issue.title)),
  5
);

assert.equal(everythingOpen.fresh.length, 0);
assert.equal(everythingOpen.duplicates.length, dailyIssueBacklog.length);

console.log("Smoke tests passed.");