import assert from "node:assert/strict";

import {
  formatWeeklyActivity,
  getWeeklyActivity,
  type GitHubSearchResult,
  type SearchIssues
} from "../src/plugins/weeklySummary.js";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a minimal SearchIssues stub from a simple recipe map. */
function makeSearch(recipe: {
  issues?: GitHubSearchResult;
  mergedPRs?: GitHubSearchResult;
  perAuthor?: Record<string, number>;
}): SearchIssues {
  return async (query: string): Promise<GitHubSearchResult> => {
    if (query.includes("is:issue")) {
      return recipe.issues ?? { total_count: 0, items: [] };
    }

    if (query.includes("merged:>=")) {
      return recipe.mergedPRs ?? { total_count: 0, items: [] };
    }

    // Per-author historical lookup: "author:<login> merged:<sinceDate"
    for (const [login, count] of Object.entries(recipe.perAuthor ?? {})) {
      if (query.includes(`author:${login}`)) {
        return { total_count: count, items: [] };
      }
    }

    throw new Error(`Unexpected query: ${query}`);
  };
}

// ---------------------------------------------------------------------------
// 1. Happy-path: mixed new and returning contributors, bots excluded
// ---------------------------------------------------------------------------
{
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
          // duplicate alice — should be deduplicated before checking history
          { user: { login: "alice", type: "User" } },
          // bot — must NOT be counted or looked up
          { user: { login: "dependabot[bot]", type: "Bot" } }
        ]
      };
    }

    // alice has no prior merged PRs → new contributor
    if (query.includes("author:alice")) {
      return { total_count: 0, items: [] };
    }

    // bob has 2 prior merged PRs → returning contributor
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

  // Each unique non-bot author is looked up exactly once
  assert.equal(
    queries.filter((q) => q.includes("author:")).length,
    2,
    "Each unique non-bot PR author should be checked once for earlier merged PRs."
  );
}

// ---------------------------------------------------------------------------
// 2. All PRs merged by brand-new contributors
// ---------------------------------------------------------------------------
{
  const summary = await getWeeklyActivity(
    new Date("2026-09-15T12:00:00Z"),
    makeSearch({
      issues: { total_count: 3, items: [] },
      mergedPRs: {
        total_count: 2,
        items: [
          { user: { login: "carol", type: "User" } },
          { user: { login: "dave", type: "User" } }
        ]
      },
      perAuthor: { carol: 0, dave: 0 }
    })
  );

  assert.equal(summary.newContributors, 2, "Both carol and dave are first-timers");
  assert.equal(summary.issuesOpened, 3);
  assert.equal(summary.pullRequestsMerged, 2);
}

// ---------------------------------------------------------------------------
// 3. No PRs merged → zero contributors
// ---------------------------------------------------------------------------
{
  const summary = await getWeeklyActivity(
    new Date("2026-09-15T12:00:00Z"),
    makeSearch({
      issues: { total_count: 5, items: [] },
      mergedPRs: { total_count: 0, items: [] }
    })
  );

  assert.equal(summary.pullRequestsMerged, 0);
  assert.equal(summary.newContributors, 0, "No PRs → no new contributors");
  assert.equal(summary.issuesOpened, 5);
}

// ---------------------------------------------------------------------------
// 4. All PRs by bots → zero new contributors, no history lookups
// ---------------------------------------------------------------------------
{
  const queries: string[] = [];

  const botOnlySearch: SearchIssues = async (query: string): Promise<GitHubSearchResult> => {
    queries.push(query);

    if (query.includes("is:issue")) {
      return { total_count: 1, items: [] };
    }

    if (query.includes("merged:>=")) {
      return {
        total_count: 3,
        items: [
          { user: { login: "dependabot[bot]", type: "Bot" } },
          { user: { login: "renovate[bot]", type: "Bot" } },
          { user: null }
        ]
      };
    }

    throw new Error(`Unexpected query in bot-only test: ${query}`);
  };

  const summary = await getWeeklyActivity(
    new Date("2026-09-15T12:00:00Z"),
    botOnlySearch
  );

  assert.equal(summary.newContributors, 0, "Bot accounts must not count as contributors");
  // No per-author history queries should have been made
  assert.ok(
    queries.every((q) => !q.includes("author:")),
    "No author: lookups should happen when all PR authors are bots or null"
  );
}

// ---------------------------------------------------------------------------
// 5. `since` date is calculated correctly from referenceDate
// ---------------------------------------------------------------------------
{
  const summary = await getWeeklyActivity(
    new Date("2026-01-08T00:00:00Z"),
    makeSearch({
      issues: { total_count: 0, items: [] },
      mergedPRs: { total_count: 0, items: [] }
    })
  );

  // 2026-01-08 minus 7 days = 2026-01-01
  assert.equal(summary.since, "2026-01-01", "Since date should be exactly 7 days before the reference date");
  assert.equal(summary.windowDays, 7);
}

// ---------------------------------------------------------------------------
// 6. formatWeeklyActivity: formats all fields correctly, including zero counts
// ---------------------------------------------------------------------------
{
  const formatted = formatWeeklyActivity({
    windowDays: 7,
    since: "2026-09-08",
    issuesOpened: 0,
    pullRequestsMerged: 0,
    newContributors: 0
  });

  const lines = formatted.split("\n");
  assert.equal(lines[0], "Weekly repository summary (last 7 days)");
  assert.equal(lines[1], "Since: 2026-09-08");
  assert.equal(lines[2], "");
  assert.equal(lines[3], "Issues opened: 0");
  assert.equal(lines[4], "PRs merged: 0");
  assert.equal(lines[5], "New contributors: 0");
}

// ---------------------------------------------------------------------------
// 7. formatWeeklyActivity: non-zero numbers appear verbatim in the output
// ---------------------------------------------------------------------------
{
  const formatted = formatWeeklyActivity({
    windowDays: 7,
    since: "2026-09-08",
    issuesOpened: 6,
    pullRequestsMerged: 4,
    newContributors: 1
  });

  assert.ok(formatted.includes("Issues opened: 6"));
  assert.ok(formatted.includes("PRs merged: 4"));
  assert.ok(formatted.includes("New contributors: 1"));
  assert.ok(formatted.includes("Since: 2026-09-08"));
}

console.log("Weekly summary tests passed.");
