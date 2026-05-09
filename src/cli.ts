#!/usr/bin/env node
import { buildChecklist, type StarterProfile } from "./checklist.js";
import { issueIdeas } from "./issueIdeas.js";

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

  if (command === "help" || command === "--help" || command === "-h") {
    console.log("Usage:");
    console.log("  oss-lab check --profile beginner");
    console.log("  oss-lab check --profile maintainer");
    console.log("  oss-lab issues");
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

main();
