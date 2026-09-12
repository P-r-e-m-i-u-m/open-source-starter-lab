import { findIssueFit } from "../issueFitFinder.js";

function readFlag(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

/**
 * Recommends one starter-issue path based on a skill the user provides,
 * by reusing the existing issue-fit logic in issueFitFinder.ts. This repo
 * has no live GitHub API integration, so "one open issue" means the best
 * matching route plus a ready-to-use search link to find an actual open,
 * unassigned issue for that skill right now.
 */
export function suggest(): void {
  const skillInput = readFlag("--skill");

  if (!skillInput) {
    console.log("Tell me a skill to get a suggested issue, for example:");
    console.log("  oss-lab suggest --skill docs");
    console.log("  oss-lab suggest --skill javascript --time 30m");
    console.log("\nAvailable skills: html-css, javascript, python, docs, testing, git");
    return;
  }

  const timeInput = readFlag("--time") ?? "30m";

  let fit;
  try {
    fit = findIssueFit(skillInput, timeInput);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(`Could not suggest an issue: ${message}`);
    return;
  }

  console.log("Suggested next issue\n");
  console.log(`Skill: ${fit.skill}`);
  console.log(`Best path: ${fit.title}`);
  console.log(`Why it fits: ${fit.whyItFits}`);
  console.log(`First command: ${fit.firstCommand}`);
  console.log(`Time budget: ${fit.timeBudget}`);
  console.log("\nFind an open issue to work on:");
  console.log(`→ ${fit.issueSearchUrl}`);
  console.log("\nProof checklist:");
  for (const item of fit.proofChecklist) {
    console.log(`- ${item}`);
  }
  console.log("\nComment to paste once you pick one:");
  console.log(fit.commentTemplate);
}