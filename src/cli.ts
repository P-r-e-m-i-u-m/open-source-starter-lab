#!/usr/bin/env node
import { buildChecklist, type StarterProfile } from "./checklist.js";
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
  console.log("Starter issue ideas\n");
  for (const idea of issueIdeas) {
    console.log(`- ${idea.title} [${idea.label}, ${idea.difficulty}]`);
    console.log(`  Goal: ${idea.goal}`);
    console.log(`  Done when: ${idea.acceptanceCriteria.join("; ")}`);
  }
}

function printIssueFit(): void {
  const skill = readFlag("--skill") ?? "docs";
  const timeBudget = readFlag("--time") ?? "30m";
  const fit = findIssueFit(skill, timeBudget);

  console.log("First Issue Fit Finder\n");
  console.log(`Best path: ${fit.title}`);
  console.log(`Skill: ${fit.skill}`);
  console.log(`Time: ${fit.timeBudget}`);
  console.log(`Why it fits: ${fit.whyItFits}`);
  console.log(`First command: ${fit.firstCommand}`);
  console.log(`Issue search: ${fit.issueSearchUrl}`);
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

function main(): void {
  const command = process.argv[2] ?? "check";

  if (command === "check") {
    const profile = (readFlag("--profile") ?? "beginner") as StarterProfile;
    if (profile !== "beginner" && profile !== "maintainer") {
      throw new Error("Use --profile beginner or --profile maintainer");
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

  if (command === "help" || command === "--help" || command === "-h") {
    console.log("Usage:");
    console.log("  oss-lab check --profile beginner");
    console.log("  oss-lab check --profile maintainer");
    console.log("  oss-lab issues");
    console.log("  oss-lab fit --skill docs --time 30m");
    console.log("  oss-lab next --level second-pr");
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

main();
