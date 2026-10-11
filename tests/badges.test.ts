import assert from "node:assert/strict";
import { badges } from "../src/plugins/badges.js";

const messages: string[] = [];
const originalLog = console.log;

try {
  console.log = (message: string) => messages.push(message);

  badges({
    pullRequests: 1,
    docsPullRequests: 1,
  });
} finally {
  console.log = originalLog;
}

assert.deepEqual(messages, [
  "Badges earned (2/3):",
  "- First PR: Opened your first pull request.",
  "- Docs Contributor: Improved the documentation with a pull request.",
]);

console.log("Badge tests passed.");

messages.length = 0;

try {
  console.log = (message: string) => messages.push(message);
  badges({ pullRequests: 0, docsPullRequests: 0 });
} finally {
  console.log = originalLog;
}

assert.deepEqual(messages, [
  "No badges earned yet. Open a pull request to earn your first badge!",
]);

