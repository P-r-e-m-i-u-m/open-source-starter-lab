
import assert from "node:assert/strict";
import { badges } from "../src/plugins/badges.js";

const messages: string[] = [];
const originalLog = console.log;

function runBadgeTest(input: {
  pullRequests: number;
  docsPullRequests: number;
}) {
  messages.length = 0;

  try {
    console.log = (message: string) => messages.push(message);
    badges(input);
  } finally {
    console.log = originalLog;
  }

  return [...messages];
}

// Test 1: Both badges earned
assert.deepEqual(
  runBadgeTest({ pullRequests: 1, docsPullRequests: 1 }),
  [
    "Badges earned (2/3):",
    "- First PR: Opened your first pull request.",
    "- Docs Contributor: Improved the documentation with a pull request.",
  ]
);

// Test 2: No badges earned
assert.deepEqual(
  runBadgeTest({ pullRequests: 0, docsPullRequests: 0 }),
  [
    "No badges earned yet. Open a pull request to earn your first badge!",
  ]
);

// Test 3: Only First PR badge earned
assert.deepEqual(
  runBadgeTest({ pullRequests: 1, docsPullRequests: 0 }),
  [
    "Badges earned (1/3):",
    "- First PR: Opened your first pull request.",
  ]
);

// Test 4: Only Docs Contributor badge earned
assert.deepEqual(
  runBadgeTest({ pullRequests: 0, docsPullRequests: 1 }),
  [
    "Badges earned (1/3):",
    "- Docs Contributor: Improved the documentation with a pull request.",
  ]
);

// Test 5: Multiple pull requests
assert.deepEqual(
  runBadgeTest({ pullRequests: 5, docsPullRequests: 0 }),
  [
    "Badges earned (1/3):",
    "- First PR: Opened your first pull request.",
  ]
);

// Test 6: Multiple documentation pull requests
assert.deepEqual(
  runBadgeTest({ pullRequests: 0, docsPullRequests: 3 }),
  [
    "Badges earned (1/3):",
    "- Docs Contributor: Improved the documentation with a pull request.",
  ]
);

// Test 7: Large number of pull requests
assert.deepEqual(
  runBadgeTest({ pullRequests: 100, docsPullRequests: 100 }),
  [
    "Badges earned (2/3):",
    "- First PR: Opened your first pull request.",
    "- Docs Contributor: Improved the documentation with a pull request.",
  ]
);

console.log("All badge tests passed.");
