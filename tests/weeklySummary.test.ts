import assert from "node:assert/strict";

import {
  formatWeeklyActivity,
  getWeeklyActivity,
  type GitHubSearchResult,
  type SearchIssues
} from "../src/plugins/weeklySummary.js";

const queries: string[] = [];

const search: SearchIssues = async (query: string): Promise<GitHubSearchResult> => {
  queries.push(query);

  if (query.includes("is:issue")) {
    return { total_count: 6, items: [] };
  }

  if (query.includes("merged:>=")) {
    return {
      total_count: 4,
      items: [
        { user: { login: "alice", type: "User" } },
        { user: { login: "bob", type: "User" } },
        { user: { login: "alice", type: "User" } },
        { user: { login: "dependabot[bot]", type: "Bot" } }
      ]
    };
  }

  if (query.includes("author:alice")) {
    return { total_count: 0, items: [] };
  }

  if (query.includes("author:bob")) {
    return { total_count: 2, items: [] };
  }

  throw new Error(`Unexpected query: ${query}`);
};

const summary = await getWeeklyActivity(
  new Date("2026-09-15T12:00:00Z"),
  search
);

assert.deepEqual(summary, {
  windowDays: 7,
  since: "2026-09-08",
  issuesOpened: 6,
  pullRequestsMerged: 4,
  newContributors: 1
});

assert.equal(
  queries.filter((query) => query.includes("author:")).length,
  2,
  "Each unique non-bot PR author should be checked once for earlier merged PRs."
);

assert.equal(
  formatWeeklyActivity(summary),
  [
    "Weekly repository summary (last 7 days)",
    "Since: 2026-09-08",
    "",
    "Issues opened: 6",
    "PRs merged: 4",
    "New contributors: 1"
  ].join("\n")
);

console.log("Weekly summary tests passed.");
