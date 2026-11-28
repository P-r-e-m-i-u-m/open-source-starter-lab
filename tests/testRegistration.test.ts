import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// This file runs from dist/tests, two levels below the repository root.
const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const packageJson = JSON.parse(readFileSync(join(root, "package.json"), "utf8")) as {
  scripts: { test: string };
};

// `npm test` only runs the files named in its script, so a test file that is
// not listed there never runs in CI.
const unregistered = readdirSync(join(root, "tests"))
  .filter((name) => name.endsWith(".test.ts"))
  .map((name) => `node dist/tests/${name.replace(/\.ts$/, ".js")}`)
  .filter((command) => !packageJson.scripts.test.includes(command));

assert.deepEqual(
  unregistered,
  [],
  `Add these commands to the "test" script in package.json:\n${unregistered.join("\n")}`
);

console.log("Test registration check passed.");
