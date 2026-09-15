import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import path from "node:path";

const cliPath = path.resolve("dist/src/cli.js");

function runCliExpectFailure(args: string[]): string {
  try {
    execFileSync("node", [cliPath, ...args], { encoding: "utf8", stdio: "pipe" });
    assert.fail(`Expected "oss-lab ${args.join(" ")}" to exit with a non-zero status code.`);
    return "";
  } catch (error) {
    return String(error);
  }
}

for (const badCommand of ["not-a-real-command", "chekc", "--bogus-flag"]) {
  const output = runCliExpectFailure([badCommand]);

  assert.ok(
    output.includes("Unknown command"),
    `Expected output for "${badCommand}" to include "Unknown command"`
  );
  assert.ok(
    output.includes(badCommand),
    `Expected output for "${badCommand}" to name the command that was rejected`
  );
}

// A known command should still exit cleanly, so the failures above are
// actually about the command name and not a broken CLI.
const profilesOutput = execFileSync("node", [cliPath, "profiles"], { encoding: "utf8" });
assert.ok(profilesOutput.includes("beginner"));

console.log("Unknown command CLI tests passed.");
