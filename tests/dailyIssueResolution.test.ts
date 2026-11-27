import assert from "node:assert/strict";
import { dailyIssueBacklog } from "../src/dailyIssueBacklog.js";
import { isDailyIssueResolved } from "../src/dailyIssueResolution.js";

const missingFile = (): string => {
  throw new Error("ENOENT");
};
const fileWith = (content: string) => (): string => content;

// A curated title can name a file by its bare name. Failing to open that
// path says nothing about whether the task is done.
assert.equal(
  isDailyIssueResolved("Let createDailyIssue.ts run without touching GitHub", missingFile),
  false
);

for (const issue of dailyIssueBacklog) {
  assert.equal(
    isDailyIssueResolved(issue.title, missingFile),
    false,
    `Curated issue should never be auto-closed: ${issue.title}`
  );
}

// Test coverage issues are closed by a pull request, not by this check.
assert.equal(
  isDailyIssueResolved("Give src/plugins/timeline.ts some real test coverage", missingFile),
  false
);
assert.equal(
  isDailyIssueResolved("Give src/plugins/timeline.ts some real test coverage", fileWith("export {};\n")),
  false
);

// TODO issues stay open while the TODO is still in the file.
const todoTitle = "Close out the TODO in src/plugins/firstIssueRecap.ts";
assert.equal(isDailyIssueResolved(todoTitle, fileWith("// TODO: implement this\nexport {};\n")), false);
assert.equal(isDailyIssueResolved(todoTitle, fileWith("// FIXME: wrong output\n")), false);
assert.equal(isDailyIssueResolved(todoTitle, fileWith("export {};\n")), true);
assert.equal(isDailyIssueResolved(todoTitle, missingFile), true);

// Recipe issues follow the same rule with a Markdown TODO comment.
const recipeTitle = "Write the recipe: Sample Recipe (docs/recipes/sample-recipe.md)";
assert.equal(
  isDailyIssueResolved(recipeTitle, fileWith("# Recipe: Sample Recipe\n\n<!-- TODO: explain it -->\n")),
  false
);
assert.equal(isDailyIssueResolved(recipeTitle, fileWith("# Recipe: Sample Recipe\n\nDone.\n")), true);
assert.equal(isDailyIssueResolved(recipeTitle, missingFile), true);

// The check reads the path named in the title.
const readPaths: string[] = [];
isDailyIssueResolved(todoTitle, (path) => {
  readPaths.push(path);
  return "";
});
assert.deepEqual(readPaths, ["src/plugins/firstIssueRecap.ts"]);

// Titles without a file path are left alone.
assert.equal(isDailyIssueResolved("Add a beginner guide for Git branches", missingFile), false);

console.log("Daily issue resolution tests passed.");
