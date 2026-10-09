import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { repoHealth } from "../src/plugins/repoHealth.js";

// Capture console.log output so the health report can be asserted
// without polluting the test runner's stdout.
function captureLogs(fn: () => void): string[] {
  const lines: string[] = [];
  const originalLog = console.log;
  console.log = (...args: unknown[]) => {
    lines.push(args.map(String).join(" "));
  };
  try {
    fn();
  } finally {
    console.log = originalLog;
  }
  return lines;
}

// Run repoHealth() from an empty directory with no git repository, so the
// internal git probes fail fast instead of touching any live network.
// Keep it independent from GitHub API calls, per the issue's done-when list.
const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), "repohealth-test-"));
const previousCwd = process.cwd();
process.chdir(sandbox);
let lines: string[];
try {
  lines = captureLogs(() => repoHealth());
} finally {
  process.chdir(previousCwd);
}

// 1. Prints a labelled health report with all four components.
assert.ok(lines.includes("Repository Health Report"));
assert.ok(lines.includes("------------------------"));
assert.ok(lines.some((line) => line.startsWith("Open Issues: ")));
assert.ok(lines.some((line) => line.startsWith("Stale PRs: ")));
assert.ok(lines.some((line) => line.startsWith("Bot Uptime (24h): ")));
assert.ok(lines.some((line) => line.startsWith("Composite Health Score: ")));

// 2. The composite score line reports a number clamped between 0 and 100.
const scoreLine = lines.find((line) =>
  line.startsWith("Composite Health Score: ")
);
assert.ok(scoreLine);
const score = Number(scoreLine.replace("Composite Health Score: ", ""));
assert.ok(Number.isFinite(score));
assert.ok(score >= 0 && score <= 100);

// 3. Returns nothing (void) — it only logs.
let voidResult: string[];
process.chdir(sandbox);
try {
  voidResult = captureLogs(() => {
    const returned: unknown = repoHealth();
    assert.equal(returned, undefined);
  });
} finally {
  process.chdir(previousCwd);
}
assert.ok(voidResult.includes("Repository Health Report"));

console.log("Repository health plugin tests passed.");
