import { readdirSync, readFileSync, statSync } from "fs";
import { join, relative } from "path";
import { type DailyIssue } from "../src/dailyIssueBacklog.js";

const SCAN_DIRS = ["src", "scripts"];
const TEST_DIRS = ["tests"];
const MARKDOWN_SCAN_DIRS = ["docs/recipes"];
const MD_TODO_PATTERN = /<!--\s*TODO[:\s](.+?)-->/;
const TODO_PATTERN = /\/\/\s*(TODO|FIXME)[:\s](.+)/;
const MAX_PER_CATEGORY = 2;

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

function safeWalk(dirs: string[]): string[] {
  let files: string[] = [];
  for (const dir of dirs) {
    try {
      files = files.concat(walk(dir));
    } catch {
      // dir doesn't exist, skip it
    }
  }
  return files;
}

function findTodoIssues(): DailyIssue[] {
  const found: DailyIssue[] = [];
  const files = safeWalk(SCAN_DIRS);

  for (const file of files) {
    if (found.length >= MAX_PER_CATEGORY) break;

    const lines = readFileSync(file, "utf-8").split("\n");
    for (let i = 0; i < lines.length; i++) {
      const match = lines[i].match(TODO_PATTERN);
      if (!match) continue;

      const note = match[2].trim();
      const relPath = relative(".", file);

      found.push({
        title: `Close out the TODO in ${relPath}`,
        labels: ["daily starter issue", "developer tooling", "help wanted", "time: 30 min", "level: second-pr"],
        context: `There's a leftover TODO sitting in ${relPath} (line ${i + 1}): "${note}". Nobody's circled back to it, and it's the kind of thing that quietly rots if it sits too long.`,
        goal: `Track down what that TODO is actually asking for, handle it, and pull the comment out once it's done.`,
        suggestedFiles: [relPath],
        acceptanceCriteria: [
          `Fix or implement what the TODO describes`,
          `Delete the comment once resolved`,
          `Run \`npm run check\``,
          `If the TODO turns out to be stale or unclear, say so in the PR instead of guessing at intent`
        ],
        helpfulNotes: ["If you're not sure what the original author meant, it's fine to ask in the PR before writing code."]
      });
      break;
    }
  }

  return found;
}

function findUntestedFiles(): DailyIssue[] {
  const found: DailyIssue[] = [];
  const testContent = safeWalk(TEST_DIRS)
    .map((f) => readFileSync(f, "utf-8"))
    .join("\n");

  const openers = [
    "sits without any real test coverage",
    "has no dedicated tests protecting it",
    "hasn't got a single test guarding its behavior"
  ];

  const files = safeWalk(SCAN_DIRS);
  for (const file of files) {
    if (found.length >= MAX_PER_CATEGORY) break;

    const content = readFileSync(file, "utf-8");
    if (!/export\s+(function|const)\s+\w+/.test(content)) continue;

    const relPath = relative(".", file);
    const baseName = relPath.split("/").pop()?.replace(".ts", "") ?? "";
    if (testContent.includes(baseName)) continue;

    const opener = openers[found.length % openers.length];

    found.push({
      title: `Give ${relPath} some real test coverage`,
      labels: ["daily starter issue", "testing", "developer tooling", "help wanted", "time: 1 hour", "level: second-pr"],
      context: `${relPath} exports working code but ${opener}, so nobody would notice if a future change quietly broke it.`,
      goal: `Write a focused test file for the main exported behavior in ${relPath}.`,
      suggestedFiles: [relPath, "tests/smoke.test.ts"],
      acceptanceCriteria: [
        `Cover the main exported function(s), not every edge case`,
        `Keep it independent from live network or GitHub API calls`,
        `Run \`npm run check\``
      ],
      helpfulNotes: ["Pick the most important function if there's more than one — one solid test beats five thin ones."]
    });
  }

  return found;
}

function findRecipeIssues(): DailyIssue[] {
  const found: DailyIssue[] = [];

  for (const dir of MARKDOWN_SCAN_DIRS) {
    let entries: string[];
    try {
      entries = readdirSync(dir);
    } catch {
      continue;
    }

    for (const entry of entries) {
      if (found.length >= MAX_PER_CATEGORY) break;
      if (!entry.endsWith(".md") || entry === "README.md") continue;

      const full = join(dir, entry);
      const content = readFileSync(full, "utf-8");
      const match = content.match(MD_TODO_PATTERN);
      if (!match) continue;

      const relPath = relative(".", full);
      const note = match[1].trim();
      const title = content.split("\n")[0].replace(/^#\s*Recipe:\s*/, "").trim();

      found.push({
        title: `Write the recipe: ${title}`,
        labels: ["daily starter issue", "documentation", "community", "help wanted", "time: 1 hour", "level: second-pr"],
        context: `${relPath} is a stub recipe waiting to be written. It needs: ${note}`,
        goal: `Fill in ${relPath} with a real, practical guide covering what's described.`,
        suggestedFiles: [relPath],
        acceptanceCriteria: [
          `Replace the TODO comment with actual written content`,
          `Include at least one concrete example from this repo`,
          `Keep it practical, not just theory`,
          `Link the finished recipe from docs/recipes/README.md if not already linked`
        ],
        helpfulNotes: ["Write it like you're explaining it to a teammate, not writing a spec."]
      });
    }
  }

  return found;
}

export function findRepoIssueIdeas(existingTitles: string[] = []): DailyIssue[] {
  const alreadyMentioned = (relPath: string) =>
    existingTitles.some((title) => title.includes(relPath));

  const todos = findTodoIssues().filter((idea) => !alreadyMentioned(idea.suggestedFiles[0]));
  const untested = findUntestedFiles().filter((idea) => !alreadyMentioned(idea.suggestedFiles[0]));
  const recipes = findRecipeIssues().filter((idea) => !alreadyMentioned(idea.suggestedFiles[0]));

  const combined: DailyIssue[] = [];
  const max = Math.max(todos.length, untested.length, recipes.length);
  for (let i = 0; i < max; i++) {
    if (recipes[i]) combined.push(recipes[i]);
    if (todos[i]) combined.push(todos[i]);
    if (untested[i]) combined.push(untested[i]);
  }

  return combined;
}
