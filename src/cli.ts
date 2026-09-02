#!/usr/bin/env node
import { buildChecklist, PROFILE_DESCRIPTIONS, type StarterProfile } from "./checklist.js";
import { findIssueFit } from "./issueFitFinder.js";
import { issueIdeas } from "./issueIdeas.js";
import { getProgressionStep, normalizeContributorLevel } from "./progressionPath.js";

function readFlag(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function printChecklist(profile: StarterProfile): void {
  const result = buildChecklist(profile);
  console.log(`Open Source Starter Lab - ${result.profile} checklist`);
  console.log(`Readiness score: ${result.score}/100\n`);

  for (const [index, item] of result.items.entries()) {
    console.log(`${index + 1}. ${item.title}`);
    console.log(`   Why: ${item.why}`);
    if (item.command) {
      console.log(`   Command: ${item.command}`);
    }
  }

  console.log(`\nNext action: ${result.nextAction}`);
}

function printIssueIdeas(): void {
  if (process.argv.includes("--json")) {
    const payload = issueIdeas.map((idea) => ({
      title: idea.title,
      label: idea.label,
      difficulty: idea.difficulty,
      goal: idea.goal,
      acceptanceCriteria: idea.acceptanceCriteria
    }));
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  console.log("Starter issue ideas\n");
  for (const idea of issueIdeas) {
    console.log(`- ${idea.title} [${idea.label}, ${idea.difficulty}]`);
    console.log(`  Goal: ${idea.goal}`);
    console.log(`  Done when: ${idea.acceptanceCriteria.join("; ")}`);
  }
}

function printIssueFit(): void {
  const isHelp = process.argv.includes("--help") || process.argv.includes("-h");
  if (isHelp) {
    console.log("First Issue Fit Finder - Help\n");
    console.log("Usage:\n  oss-lab fit [--skill <skill>] [--time <time>]\n");
    console.log("Accepted Skills:");
    console.log("  beginner, intermediate, advanced");
    console.log("  (examples: html-css, javascript, typescript, python, docs, testing, git)\n");
    console.log("Accepted Time Budgets:");
    console.log("  15m (quick task)");
    console.log("  30m (small improvement)");
    console.log("  1h (slightly bigger task)\n");
    console.log("Examples:");
    console.log("  oss-lab fit --skill python --time 15m");
    console.log("  oss-lab fit --skill docs --time 30m");
    console.log("  oss-lab fit --skill testing --time 1h");
    return;
  }

  const skill = readFlag("--skill") ?? "docs";
  const timeBudget = readFlag("--time") ?? "30m";
  const fit = findIssueFit(skill, timeBudget);

  console.log("First Issue Fit Finder\n");
  console.log(`Best path: ${fit.title}`);
  console.log(`Skill: ${fit.skill}`);
  console.log(`Time: ${fit.timeBudget}`);
  console.log(`Why it fits: ${fit.whyItFits}`);
  console.log(`First command: ${fit.firstCommand}`);
  console.log("\nFind an issue to work on:");
  console.log(`→ Copy this URL into your browser: ${fit.issueSearchUrl}`);
  console.log("\nProof checklist:");
  for (const item of fit.proofChecklist) {
    console.log(`- ${item}`);
  }
  console.log("\nComment to paste:");
  console.log(fit.commentTemplate);
}

function printNextStep(): void {
  const level = normalizeContributorLevel(readFlag("--level") ?? "first-pr");
  const step = getProgressionStep(level);

  console.log("Contributor Progression Path\n");
  console.log(`${step.title}`);
  console.log(`Goal: ${step.goal}`);
  console.log(`First command: ${step.firstCommand}`);
  console.log(`Labels to look for: ${step.labels.join(", ")}`);
  console.log("\nGood tasks:");
  for (const task of step.goodTasks) {
    console.log(`- ${task}`);
  }
  console.log("\nProof to show:");
  for (const proof of step.proof) {
    console.log(`- ${proof}`);
  }
  console.log(`\nNext move: ${step.nextMove}`);
}

function printProfiles(): void {
  console.log("Available checklist profiles:");
  for (const profile of PROFILE_DESCRIPTIONS) {
    console.log(`- ${profile.id}: ${profile.description}`);
  }
}

function main(): void {
  const command = process.argv[2] ?? "check";

  if (command === "check") {
    const profile = (readFlag("--profile") ?? "beginner") as StarterProfile;
    if (!PROFILE_DESCRIPTIONS.some((p) => p.id === profile)) {
      const validProfiles = PROFILE_DESCRIPTIONS.map((p) => `--profile ${p.id}`).join(" or ");
      throw new Error(`Use ${validProfiles}`);
    }
    printChecklist(profile);
    return;
  }

  if (command === "issues") {
    printIssueIdeas();
    return;
  }

  if (command === "fit") {
    printIssueFit();
    return;
  }

  if (command === "next") {
    printNextStep();
    return;
  }

  if (command === "profiles") {
    printProfiles();
    return;
  }  

  if (command === "help" || command === "--help" || command === "-h") {
    console.log("Usage:");
    console.log("  oss-lab check --profile beginner");
    console.log("  oss-lab check --profile maintainer");
    console.log("  oss-lab issues");
    console.log("  oss-lab issues --json");
    console.log("  oss-lab profiles");
    console.log("  oss-lab fit --skill docs --time 30m");
    console.log("    Skills: html-css, javascript, python, docs, testing, git");
    console.log("    Time: 15m, 30m, 1h");
    console.log("  oss-lab next --level second-pr");
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Error: ${message}`);
  process.exit(1);
}
