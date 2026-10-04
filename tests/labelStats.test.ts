import assert from "node:assert/strict";
import test from "node:test";
import { calculateLabelStats, labelStats } from "../src/plugins/labelStats.js";
import type { DailyIssue } from "../src/dailyIssueBacklog.js";

test("calculateLabelStats aggregates and sorts label frequencies correctly", () => {
  const sampleBacklog: DailyIssue[] = [
    {
      title: "Issue 1",
      labels: ["docs", "good first issue"],
      context: "",
      goal: "",
      suggestedFiles: [],
      acceptanceCriteria: [],
      helpfulNotes: []
    },
    {
      title: "Issue 2",
      labels: ["docs", "typescript"],
      context: "",
      goal: "",
      suggestedFiles: [],
      acceptanceCriteria: [],
      helpfulNotes: []
    },
    {
      title: "Issue 3",
      labels: ["docs"],
      context: "",
      goal: "",
      suggestedFiles: [],
      acceptanceCriteria: [],
      helpfulNotes: []
    }
  ];

  const stats = calculateLabelStats(sampleBacklog);

  assert.equal(stats.length, 3);
  assert.deepEqual(stats[0], { label: "docs", count: 3 });
  assert.deepEqual(stats[1], { label: "good first issue", count: 1 });
  assert.deepEqual(stats[2], { label: "typescript", count: 1 });
});

test("calculateLabelStats handles empty backlog gracefully", () => {
  const stats = calculateLabelStats([]);
  assert.equal(stats.length, 0);
});

test("calculateLabelStats trims labels and ignores empty label strings", () => {
  const sampleBacklog: DailyIssue[] = [
    {
      title: "Issue",
      labels: ["  beginner friendly  ", ""],
      context: "",
      goal: "",
      suggestedFiles: [],
      acceptanceCriteria: [],
      helpfulNotes: []
    }
  ];

  const stats = calculateLabelStats(sampleBacklog);
  assert.equal(stats.length, 1);
  assert.deepEqual(stats[0], { label: "beginner friendly", count: 1 });
});

test("labelStats prints empty message when backlog is empty", () => {
  let output = "";
  const originalLog = console.log;
  console.log = (...args: unknown[]) => {
    output += args.join(" ") + "\n";
  };

  try {
    labelStats([]);
    assert.match(output, /No issue labels found/);
  } finally {
    console.log = originalLog;
  }
});
