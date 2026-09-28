import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";
import path from "node:path";

const cliPath = path.resolve("dist/src/cli.js");

test("unknown CLI command exits unsuccessfully with a useful message", () => {
  const result = spawnSync(
    "node",
    [cliPath, "nonexistent-command"],
    { encoding: "utf8" }
  );

  assert.notEqual(result.status, 0);
  assert.match(`${result.stdout}${result.stderr}`, /Unknown command/);
});

