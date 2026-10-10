import assert from "node:assert/strict";
import { welcome } from "../src/plugins/welcome.js";

// Capture console.log output so the welcome() messages can be asserted
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

// 1. Greets the contributor by name and names their claimed issue.
const lines = captureLogs(() => welcome("new-contributor", "#424"));

assert.ok(
  lines.some((line) => line.includes("new-contributor")),
  "should greet the contributor by name"
);
assert.ok(
  lines.some((line) => line.includes("#424")),
  "should mention the contributor's first claimed issue"
);
assert.ok(
  lines.some((line) => line.includes("Open Source Starter Lab")),
  "should welcome them to Open Source Starter Lab"
);

// 2. Prints one greeting line per console.log call — three messages in order.
const ordered = captureLogs(() => welcome("ada", "#7"));
assert.equal(ordered.length, 3);
assert.equal(ordered[0], "Welcome, ada!");
assert.equal(ordered[1], "Your first claimed issue is: #7");
assert.ok(ordered[2].length > 0);

// 3. Returns nothing (void) — it only logs.
const result = captureLogs(() => {
  const returned: unknown = welcome("grace", "#101");
  assert.equal(returned, undefined);
});
assert.equal(result.length, 3);

console.log("Welcome plugin tests passed.");
