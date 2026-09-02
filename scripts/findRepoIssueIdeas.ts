import { readdirSync, readFileSync, statSync } from "fs";
import { join, relative } from "path";
import { type DailyIssue } from "../src/dailyIssueBacklog.js";

const SCAN_DIRS = ["src", "scripts"];
const TEST_DIRS = ["tests"];
const TODO_PATTERN = /\/\/\s*(TODO|FIXME)[:\s](.+)/;

function walk(dir: string): string[] {
  let files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      files = files.concat(walk(full));
    } else if (entry.endsWith(".ts") && !entry.endsWith(".test.ts")) {
      files.push(full);
    }
  }
  return files;
}

function findTodoIssues(): DailyIssue[] {
  const found: DailyIssue[] = [];

  for (const dir of SCAN_DIRS) {
    let files: string[];
    try {
      files = walk(dir);
    } catch {
      continue;
    }

    for (const file of files) {
      const lines = readFileSync(file, "utf-8").split("\n");
      lines.forEach((line, i) => {
        const match = line.match(TODO_PATTERN);
        if (!match) return;

        const note = match[2].trim();
        const relPath = relative(".", file);

        found.push({
          title: `Resolve TODO in ${relPath}: ${note.slice(0, 60)}`,
          labels: ["daily starter issue", "developer tooling", "help wanted", "time: 30 min", "level: second-pr"],
          context: `A TODO comment was left in ${relPath} at line ${i + 1}: "${note}". Leaving these unresolved makes the codebase harder to trust.`,
          goal: `Resolve the TODO in ${relPath} and remove the comment once done.`,
          suggestedFiles: [relPath],
          acceptanceCriteria: [
            `Address what the TODO comment describes`,
            `Remove the TODO comment once resolved`,
            `Run \`npm run check\``,
            `Explain your approach in the PR if the fix wasn't obvious`
          ],
          helpfulNotes: ["If the TODO turns out to be unclear or outdated, say so in the PR instead of guessing."]
        });
      });
    }
  }

  return found;
}

function findUntestedFiles(): DailyIssue[] {
  const found: DailyIssue[] = [];
  let testFiles: string[] = [];

  for (const dir of TEST_DIRS) {
    try {
      testFiles = testFiles.concat(walk(dir));
    } catch {
      continue;
    }
  }

  const testContent = testFiles.map((f) => readFileSync(f, "utf-8")).join("\n");

  for (const dir of SCAN_DIRS) {
    let files: string[];
    try {
      files = walk(dir);
    } catch {
      continue;
    }

    for (const file of files) {
      const content = readFileSync(file, "utf-8");
      const exportMatch = content.match(/export\s+(function|const)\s+(\w+)/g);
      if (!exportMatch) continue;

      const relPath = relative(".", file);
      const baseName = relPath.split("/").pop()?.replace(".ts", "") ?? "";

      if (testContent.includes(baseName)) continue;

      found.push({
        title: `Add test coverage for ${relPath}`,
        labels: ["daily starter issue", "testing", "developer tooling", "help wanted", "time: 1 hour", "level: second-pr"],
        context: `${relPath} exports functions but has no matching test file, so regressions here go unnoticed.`,
        goal: `Add a focused test file covering the exported behavior in ${relPath}.`,
        suggestedFiles: [relPath, "tests/smoke.test.ts"],
        acceptanceCriteria: [
          `Add at least one test covering the main exported function(s)`,
          `Keep the test independent from live network/API calls`,
          `Run \`npm run check\``
        ],
        helpfulNotes: ["Pick the most important function first if there are several — don't try to cover everything in one PR."]
      });
    }
  }

  return found;
}

export function findRepoIssueIdeas(): DailyIssue[] {
  return [...findTodoIssues(), ...findUntestedFiles()];
}
