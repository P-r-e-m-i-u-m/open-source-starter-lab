import assert from "node:assert/strict";
import { issueIdeas, type IssueIdea } from "../src/issueIdeas.js";

const allowedDifficulties: IssueIdea["difficulty"][] = ["easy", "medium"];

assert.ok(Array.isArray(issueIdeas));
assert.ok(issueIdeas.length > 0);
assert.equal(issueIdeas[0].title, "Add a Windows Git setup guide");
assert.equal(issueIdeas[0].difficulty, "easy");

// There should be a healthy number of starter ideas.
assert.ok(issueIdeas.length >= 5, "Expected at least 5 issue ideas");

for (const idea of issueIdeas) {
  // Every idea needs real text in each field.
  assert.ok(idea.title.trim().length > 0, "Idea title must not be empty");
  assert.ok(idea.label.trim().length > 0, `Idea "${idea.title}" needs a label`);
  assert.ok(idea.goal.trim().length > 0, `Idea "${idea.title}" needs a goal`);

  // Difficulty must be one of the supported values.
  assert.ok(
    allowedDifficulties.includes(idea.difficulty),
    `Idea "${idea.title}" has an unsupported difficulty: ${idea.difficulty}`,
  );

  // Every idea needs at least three non-empty acceptance criteria.
  assert.ok(
    idea.acceptanceCriteria.length >= 3,
    `Idea "${idea.title}" needs at least 3 acceptance criteria`,
  );
  assert.ok(
    idea.acceptanceCriteria.every((criterion) => criterion.trim().length > 0),
    `Idea "${idea.title}" has an empty acceptance criterion`,
  );
}

// Titles should be unique (ignoring case and extra spaces) so issues are not duplicated.
const normalizedTitles = issueIdeas.map((idea) =>
  idea.title.trim().toLowerCase(),
);
assert.equal(
  new Set(normalizedTitles).size,
  issueIdeas.length,
  "Issue idea titles must be unique",
);

// Beginners need something to start with.
assert.ok(
  issueIdeas.some((idea) => idea.label === "good first issue"),
  "Expected at least one good first issue idea",
);
assert.ok(
  issueIdeas.some((idea) => idea.difficulty === "easy"),
  "Expected at least one easy idea",
);

console.log("Issue ideas tests passed.");
