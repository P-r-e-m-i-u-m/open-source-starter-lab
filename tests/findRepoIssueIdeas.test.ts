import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { findRepoIssueIdeas } from "../scripts/findRepoIssueIdeas.js";
import type { DailyIssue } from "../src/dailyIssueBacklog.js";

type Category = "todo" | "untested" | "recipe" | "unknown";

function categoryOf(title: string): Category {
  if (/^Close out the TODO in /.test(title)) return "todo";
  if (/^Give .+ some real test coverage$/.test(title)) return "untested";
  if (/^Write the recipe: /.test(title)) return "recipe";
  return "unknown";
}

function titlesOf(issues: DailyIssue[]): string[] {
  return issues.map((issue) => issue.title);
}

function titlesIn(issues: DailyIssue[], category: Category): string[] {
  return titlesOf(issues).filter((title) => categoryOf(title) === category);
}

function writeFile(path: string, content: string): void {
  writeFileSync(path, content, "utf-8");
}

// The scanner only touches the filesystem under the current working directory
// (src/, scripts/, tests/, docs/recipes/), so a throwaway sandbox gives fully
// deterministic fixture sets: 5 candidates per category (more than the cap of
// 3) for TODOs, untested files and recipe stubs.
function buildSandbox(root: string): void {
  mkdirSync(join(root, "src"), { recursive: true });
  mkdirSync(join(root, "scripts"), { recursive: true });
  mkdirSync(join(root, "tests"), { recursive: true });
  mkdirSync(join(root, "docs", "recipes"), { recursive: true });

  // TODO/FIXME candidates: no `export function`/`export const`, so they stay
  // out of the untested category and the two categories stay independent.
  writeFile(join(root, "src/todoOne.ts"), `// TODO: handle empty input in one\nfunction one(): number {\n  return 1;\n}\n`);
  writeFile(join(root, "src/todoTwo.ts"), `// TODO: split this up in two\nfunction two(): number {\n  return 2;\n}\n`);
  writeFile(join(root, "src/todoThree.ts"), `// TODO: double-check the edge case in three\nfunction three(): number {\n  return 3;\n}\n`);
  writeFile(join(root, "scripts/toolFour.ts"), `// TODO: revisit the flag parsing in four\nfunction four(): number {\n  return 4;\n}\n`);
  writeFile(join(root, "scripts/toolFive.ts"), `// FIXME: this counter is off by one in five\nfunction five(): number {\n  return 5;\n}\n`);

  // Untested candidates: exported code, no TODO/FIXME lines.
  for (const name of ["untestedOne", "untestedTwo", "untestedThree", "untestedFour", "untestedFive"]) {
    writeFile(join(root, "src", `${name}.ts`), `export function ${name}(): number {\n  return 0;\n}\n`);
  }

  // File whose base name appears in the tests helper content, so it must NOT
  // be reported as untested even though it lives in src/. (The scanner reads
  // non-*.test.ts files under tests/, since walk() skips *.test.ts itself.)
  writeFile(join(root, "src/covered.ts"), `export function covered(): number {\n  return 7;\n}\n`);
  writeFile(join(root, "tests/fixtures.ts"), `// shared fixtures referencing the covered module\n`);
  writeFile(join(root, "tests/covered.test.ts"), `// test that covers the covered module\n`);

  // Recipe candidates: five stubs plus a README that must always be skipped.
  for (const name of ["alpha", "bravo", "charlie", "delta", "echo"]) {
    writeFile(
      join(root, "docs/recipes", `${name}.md`),
      `# Recipe: ${name.charAt(0).toUpperCase()}${name.slice(1)}\n\n<!-- TODO: write the ${name} walkthrough -->\n`
    );
  }
  writeFile(join(root, "docs/recipes/README.md"), `# Recipes\n\n<!-- TODO: link every recipe here -->\n`);
}

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const originalCwd = process.cwd();
const sandbox = mkdtempSync(join(tmpdir(), "find-repo-issue-ideas-"));

try {
  buildSandbox(sandbox);
  process.chdir(sandbox);

  const todoCandidates = [
    "src/todoOne.ts",
    "src/todoTwo.ts",
    "src/todoThree.ts",
    "scripts/toolFour.ts",
    "scripts/toolFive.ts"
  ];
  const untestedCandidates = [
    "src/untestedOne.ts",
    "src/untestedTwo.ts",
    "src/untestedThree.ts",
    "src/untestedFour.ts",
    "src/untestedFive.ts"
  ];

  // Baseline: every returned idea belongs to one of the three known
  // categories and carries the full DailyIssue shape.
  const baseline = findRepoIssueIdeas();
  assert.ok(baseline.length > 0, "sandbox should surface at least one idea");
  for (const issue of baseline) {
    const category = categoryOf(issue.title);
    assert.notEqual(category, "unknown", `unexpected title shape: ${issue.title}`);
    assert.ok(issue.context.trim().length > 0, `empty context on ${issue.title}`);
    assert.ok(issue.goal.trim().length > 0, `empty goal on ${issue.title}`);
    assert.ok(issue.labels.includes("daily starter issue"), `missing seed label on ${issue.title}`);
    assert.ok(issue.suggestedFiles.length > 0, `no suggested files on ${issue.title}`);
    assert.ok(issue.acceptanceCriteria.length >= 3, `thin acceptance criteria on ${issue.title}`);
    assert.ok(issue.helpfulNotes.length > 0, `no helpful notes on ${issue.title}`);
    if (category === "todo") {
      assert.ok(issue.labels.includes("developer tooling"), `todo idea mislabeled: ${issue.title}`);
    }
    if (category === "untested") {
      assert.ok(issue.labels.includes("testing"), `untested idea mislabeled: ${issue.title}`);
    }
    if (category === "recipe") {
      assert.ok(issue.labels.includes("documentation"), `recipe idea mislabeled: ${issue.title}`);
    }
  }

  // MAX_PER_CATEGORY = 3: each category has 5 candidates in the sandbox but
  // yields at most 3 issues, and the merge interleaves recipe/todo/untested.
  assert.equal(titlesIn(baseline, "todo").length, 3, "TODO category should be capped at 3");
  assert.equal(titlesIn(baseline, "untested").length, 3, "untested category should be capped at 3");
  assert.equal(titlesIn(baseline, "recipe").length, 3, "recipe category should be capped at 3");
  assert.equal(baseline.length, 9, "combined result should hold all three capped groups");
  assert.deepEqual(
    baseline.map((issue) => categoryOf(issue.title)),
    ["recipe", "todo", "untested", "recipe", "todo", "untested", "recipe", "todo", "untested"],
    "categories should interleave recipe/todo/untested"
  );

  // Every idea must come from the matching candidate set.
  for (const title of titlesIn(baseline, "todo")) {
    const relPath = title.replace(/^Close out the TODO in /, "");
    assert.ok(todoCandidates.includes(relPath), `unexpected TODO source: ${relPath}`);
  }
  for (const title of titlesIn(baseline, "untested")) {
    const relPath = title.replace(/^Give /, "").replace(/ some real test coverage$/, "");
    assert.ok(untestedCandidates.includes(relPath), `unexpected untested source: ${relPath}`);
  }
  assert.ok(
    titlesIn(baseline, "untested").every((title) => !title.includes("covered.ts")),
    "files already referenced from tests should not be reported as untested"
  );
  for (const title of titlesIn(baseline, "recipe")) {
    assert.match(title, /\(docs\/recipes\/[a-z]+\.md\)$/, `recipe title should embed its path: ${title}`);
  }
  assert.ok(
    titlesOf(baseline).every((title) => !title.includes("README.md")),
    "docs/recipes/README.md should never be treated as a stub recipe"
  );

  // Default argument behaves like an explicit empty list.
  assert.deepEqual(
    titlesOf(findRepoIssueIdeas()).sort(),
    titlesOf(findRepoIssueIdeas([])).sort(),
    "existingTitles should default to []"
  );

  // existingTitles filtering: reporting every baseline idea as known makes all
  // of them disappear; the remaining 2 candidates per category take their
  // place (2 < cap, so exactly two of each are left).
  const afterKnown = findRepoIssueIdeas(titlesOf(baseline));
  assert.deepEqual(
    titlesOf(afterKnown).filter((title) => titlesOf(baseline).includes(title)),
    [],
    "known ideas must not resurface"
  );
  assert.equal(titlesIn(afterKnown, "todo").length, 2, "leftover TODO candidates should fill in");
  assert.equal(titlesIn(afterKnown, "untested").length, 2, "leftover untested candidates should fill in");
  assert.equal(titlesIn(afterKnown, "recipe").length, 2, "leftover recipe candidates should fill in");

  // Filtering one known idea per category removes exactly that idea and the
  // category stays topped up to the cap from the other candidates.
  for (const category of ["todo", "untested", "recipe"] as const) {
    const [first, second] = titlesIn(baseline, category);
    const filtered = findRepoIssueIdeas([first]);
    assert.ok(!titlesOf(filtered).includes(first), `${category}: suppressed idea should not reappear`);
    assert.ok(titlesOf(filtered).includes(second), `${category}: unrelated ideas should be untouched`);
    assert.equal(titlesIn(filtered, category).length, 3, `${category}: cap should still be reached from leftovers`);
  }

  // scripts/ is scanned too: once every src/ TODO file is known, exactly the
  // two scripts/ files (including the FIXME one) are reported.
  const srcTodoTitles = todoCandidates
    .filter((path) => path.startsWith("src/"))
    .map((path) => `Close out the TODO in ${path}`);
  const scriptsTodos = titlesIn(findRepoIssueIdeas(srcTodoTitles), "todo");
  assert.deepEqual(
    scriptsTodos.sort(),
    ["Close out the TODO in scripts/toolFive.ts", "Close out the TODO in scripts/toolFour.ts"].sort(),
    "scripts/ TODO/FIXME files should be picked up once src/ ones are known"
  );

  // No network / GitHub API: calls must work even with fetch booby-trapped.
  const realFetch = globalThis.fetch;
  let fetchCalls = 0;
  globalThis.fetch = ((..._args: unknown[]) => {
    fetchCalls += 1;
    throw new Error("findRepoIssueIdeas must not touch the network");
  }) as unknown as typeof fetch;
  try {
    const offline = findRepoIssueIdeas();
    assert.equal(fetchCalls, 0, "no fetch calls allowed");
    assert.equal(offline.length, baseline.length, "results should be pure filesystem output");
  } finally {
    globalThis.fetch = realFetch;
  }
} finally {
  process.chdir(originalCwd);
  rmSync(sandbox, { recursive: true, force: true });
}

// Intent guard: the scanner must stay free of any network capability. This is
// a policy check (no HTTP client, no GitHub API), not a snapshot of the module
// imports, so legitimate refactors of the source keep the test green; the
// booby-trapped fetch above already proves offline behaviour dynamically.
const source = readFileSync(join(repoRoot, "scripts", "findRepoIssueIdeas.ts"), "utf-8");
assert.ok(!/\bfetch\s*\(/.test(source), "findRepoIssueIdeas must not call fetch");
assert.ok(!/@octokit|octokit/i.test(source), "findRepoIssueIdeas must not use the GitHub API");

console.log("findRepoIssueIdeas tests passed.");
