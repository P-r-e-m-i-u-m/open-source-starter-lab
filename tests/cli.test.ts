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

test("badges command outputs empty state when no flags are passed", () => {
  const result = spawnSync(
    "node",
    [cliPath, "badges"],
    { encoding: "utf8" }
  );

  assert.equal(result.status, 0);
  assert.match(
    result.stdout,
    /No badges earned yet\. Open a pull request to earn your first badge!/
  );
});

test("badges command displays earned badges with PR flags", () => {
  const singlePrResult = spawnSync(
    "node",
    [cliPath, "badges", "--prs", "1"],
    { encoding: "utf8" }
  );

  assert.equal(singlePrResult.status, 0);
  assert.match(singlePrResult.stdout, /Badges earned \(1\/3\):/);
  assert.match(singlePrResult.stdout, /- First PR: Opened your first pull request\./);

  const allBadgesResult = spawnSync(
    "node",
    [cliPath, "badges", "--prs", "5", "--docs-prs", "1"],
    { encoding: "utf8" }
  );

  assert.equal(allBadgesResult.status, 0);
  assert.match(allBadgesResult.stdout, /Badges earned \(3\/3\):/);
  assert.match(allBadgesResult.stdout, /- First PR: Opened your first pull request\./);
  assert.match(allBadgesResult.stdout, /- Five PRs: Opened five pull requests\./);
  assert.match(allBadgesResult.stdout, /- Docs Contributor: Improved the documentation with a pull request\./);
});

test("badges --help displays options and usage", () => {
  const result = spawnSync(
    "node",
    [cliPath, "badges", "--help"],
    { encoding: "utf8" }
  );

  assert.equal(result.status, 0);
  assert.match(result.stdout, /Contributor Badges - Help/);
  assert.match(result.stdout, /oss-lab badges \[--prs <count>\] \[--docs-prs <count>\]/);
});

test("badges command rejects negative or invalid arguments", () => {
  const invalidPrResult = spawnSync(
    "node",
    [cliPath, "badges", "--prs", "not-a-number"],
    { encoding: "utf8" }
  );

  assert.notEqual(invalidPrResult.status, 0);
  assert.match(`${invalidPrResult.stdout}${invalidPrResult.stderr}`, /Usage: oss-lab badges/);

  const negativeResult = spawnSync(
    "node",
    [cliPath, "badges", "--prs", "-2"],
    { encoding: "utf8" }
  );

  assert.notEqual(negativeResult.status, 0);
  assert.match(`${negativeResult.stdout}${negativeResult.stderr}`, /Usage: oss-lab badges/);
});

test("help command lists badges command", () => {
  const result = spawnSync(
    "node",
    [cliPath, "help"],
    { encoding: "utf8" }
  );

  assert.equal(result.status, 0);
  assert.match(result.stdout, /oss-lab badges \[--prs <count>\] \[--docs-prs <count>\]/);
});



