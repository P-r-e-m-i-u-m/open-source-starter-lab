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

test("fit --help outputs accurate accepted skills list", () => {
  const result = spawnSync(
    "node",
    [cliPath, "fit", "--help"],
    { encoding: "utf8" }
  );

  assert.equal(result.status, 0);
  assert.match(
    result.stdout,
    /Accepted Skills:\s*\n\s*html-css, javascript, python, docs, testing, git/
  );
  assert.doesNotMatch(result.stdout, /beginner, intermediate, advanced/);
});


