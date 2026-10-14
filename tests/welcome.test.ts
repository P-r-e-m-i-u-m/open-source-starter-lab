
import assert from "node:assert/strict";
import { welcome } from "../src/plugins/welcome.js";

// Capture console.log output so we can verify the exact messages.
const messages: string[] = [];
const originalLog = console.log;

try {
  // Temporarily replace console.log to collect messages instead of printing them.
  console.log = (...args: unknown[]) => {
    messages.push(args.map(String).join(" "));
  };

  // Call welcome() with sample contributor and issue details.
  welcome("Ada Lovelace", "#512");
} finally {
  // Restore console.log even if the function throws an error.
  console.log = originalLog;
}

// Verify all three messages match exactly and appear in the correct order.
assert.deepEqual(messages, [
  "Welcome, Ada Lovelace!",
  "Your first claimed issue is: #512",
  "We're glad to have you contributing to Open Source Starter Lab!",
]);

console.log("Welcome plugin tests passed.");
