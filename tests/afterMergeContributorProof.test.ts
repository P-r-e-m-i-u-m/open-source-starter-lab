import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  ensureContributorPassport,
  type GitHubPullRequest
} from "../scripts/afterMergeContributorProof.js";

function mergedPr(number: number, title: string, mergedAt: string): GitHubPullRequest {
  return {
    number,
    title,
    body: null,
    html_url: `https://github.com/example/repo/pull/${number}`,
    merged: true,
    merged_at: mergedAt,
    user: { login: "Sample-User", type: "User" },
    base: { repo: { full_name: "example/repo" } }
  };
}

// Markdown ends a table at the first blank line, so every contribution row
// has to sit directly under the previous one to stay inside the table.
function assertOneUnbrokenTable(passport: string, expectedRows: string[]): void {
  const lines = passport.split("\n");
  const start = lines.indexOf("| --- | --- | --- | --- | --- |");

  assert.ok(start >= 0, "Passport should keep its table header");
  assert.deepEqual(lines.slice(start + 1, start + 1 + expectedRows.length), expectedRows);
  assert.equal(lines[start + 1 + expectedRows.length], "", "A blank line should follow the last row");
  assert.equal(
    lines.filter((line) => /^\| #\d+ \|/.test(line)).length,
    expectedRows.length,
    "No contribution row should be left outside the table"
  );
}

const firstRow = "| #10 | 2026-01-05 | docs | docs: add a guide | #7 |";
const secondRow = "| #20 | 2026-01-09 | testing | test: cover the guide | #15 |";
const thirdRow = "| #30 | 2026-01-12 | cli | feat: add a flag | No linked issue was found in the PR body. |";

const sandbox = mkdtempSync(join(tmpdir(), "passport-test-"));
const previousCwd = process.cwd();
process.chdir(sandbox);

try {
  const first = mergedPr(10, "docs: add a guide", "2026-01-05T10:00:00Z");
  const second = mergedPr(20, "test: cover the guide", "2026-01-09T10:00:00Z");
  const third = mergedPr(30, "feat: add a flag", "2026-01-12T10:00:00Z");

  const path = await ensureContributorPassport("Sample-User", first, "docs", [7], []);
  assert.equal(path, "contributors/passports/sample-user.md");
  assertOneUnbrokenTable(readFileSync(path, "utf8"), [firstRow]);

  // A second and third merge add rows to the same table.
  await ensureContributorPassport("Sample-User", second, "testing", [15], []);
  assertOneUnbrokenTable(readFileSync(path, "utf8"), [firstRow, secondRow]);

  await ensureContributorPassport("Sample-User", third, "cli", [], []);
  const passport = readFileSync(path, "utf8");
  assertOneUnbrokenTable(passport, [firstRow, secondRow, thirdRow]);

  // The rest of the passport is still updated.
  assert.ok(passport.includes("- Level: 3 - Trust Builder"));
  assert.ok(passport.includes("- First merged PR: #10"));
  assert.ok(passport.includes("- Latest merged PR: #30"));
  assert.ok(passport.includes("- Primary skill: cli"));
  assert.ok(passport.includes("## Suggested Next Step\n\n- Ask in the weekly assignment thread"));
  assert.ok(passport.includes("## Share Line"));

  // Running again for a PR that is already recorded changes nothing.
  await ensureContributorPassport("Sample-User", third, "cli", [], []);
  assert.equal(readFileSync(path, "utf8"), passport);

  // A passport whose rows were already split by blank lines is repaired the
  // next time a row is added.
  const brokenPath = "contributors/passports/split-user.md";
  mkdirSync("contributors/passports", { recursive: true });
  writeFileSync(brokenPath, passport.replace(`${firstRow}\n`, `${firstRow}\n\n`).replace(`${secondRow}\n`, `${secondRow}\n\n`));

  const fourth = mergedPr(40, "docs: fix a link", "2026-01-15T10:00:00Z");
  await ensureContributorPassport("Split-User", fourth, "docs", [33], []);
  assertOneUnbrokenTable(readFileSync(brokenPath, "utf8"), [
    firstRow,
    secondRow,
    thirdRow,
    "| #40 | 2026-01-15 | docs | docs: fix a link | #33 |"
  ]);
} finally {
  process.chdir(previousCwd);
  rmSync(sandbox, { recursive: true, force: true });
}

console.log("After-merge contributor proof tests passed.");
