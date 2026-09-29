import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";

const cliPath = path.resolve("dist/src/cli.js");
const result = spawnSync(
  "node",
  [cliPath, "nonexistent-command"],
  { encoding: "utf8" }
);

assert.notEqual(result.status, 0, "Unknown command should exit unsuccessfully");
assert.match(
  `${result.stdout}${result.stderr}`,
  /Unknown command/
);

console.log("Unknown command CLI tests passed.");
