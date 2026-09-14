import assert from "node:assert/strict";
import {
  getProgressionStep,
  listProgressionSteps,
  normalizeContributorLevel,
  type ContributorLevel,
  type ProgressionStep
} from "../src/progressionPath.js";

const allLevels: ContributorLevel[] = [
  "first-pr",
  "second-pr",
  "trust-builder",
  "maintainer-shadow",
  "bigger-task"
];

const stepFields = [
  "level",
  "title",
  "goal",
  "goodTasks",
  "labels",
  "firstCommand",
  "proof",
  "nextMove"
].sort();

// Structural checks a ProgressionStep must always satisfy. `cli next-step`
// prints every field verbatim, so prose fields only need to be non-empty;
// their exact wording is deliberately not pinned so refactors can improve it.
function assertStepShape(step: ProgressionStep, context: string): void {
  assert.deepEqual(
    Object.keys(step).sort(),
    stepFields,
    `${context}: unexpected ProgressionStep shape`
  );
  assert.ok(
    allLevels.includes(step.level),
    `${context}: level should be one of the known contributor levels`
  );
  for (const field of ["title", "goal", "firstCommand", "nextMove"] as const) {
    assert.ok(step[field].trim().length > 0, `${context}: ${field} should not be blank`);
  }
  for (const listField of ["goodTasks", "labels", "proof"] as const) {
    const values = step[listField];
    assert.ok(values.length > 0, `${context}: ${listField} should not be empty`);
    assert.ok(
      values.every((value) => value.trim().length > 0),
      `${context}: ${listField} entries should not be blank`
    );
  }
}

// Table 1: the step returned for each level. Titles identify the step and
// labels are GitHub label names consumed by the CLI and issue searches, so
// unlike prose they are pinned here (compared order-insensitively).
const stepTable: { level: ContributorLevel; title: string; labels: string[] }[] = [
  {
    level: "first-pr",
    title: "First PR",
    labels: ["level: first-pr", "good first issue", "beginner friendly", "docs only"]
  },
  {
    level: "second-pr",
    title: "Second PR",
    labels: ["level: second-pr", "cli", "testing", "documentation"]
  },
  {
    level: "trust-builder",
    title: "Trust Builder",
    labels: ["level: trust-builder", "community", "help wanted"]
  },
  {
    level: "maintainer-shadow",
    title: "Maintainer Shadow",
    labels: ["level: maintainer-practice", "triage", "community"]
  },
  {
    level: "bigger-task",
    title: "Ready For Bigger Task",
    labels: ["ready for bigger task", "developer tooling", "testing"]
  }
];

assert.deepEqual(
  stepTable.map((entry) => entry.level).sort(),
  [...allLevels].sort(),
  "step table must cover every contributor level"
);

for (const expected of stepTable) {
  const step = getProgressionStep(expected.level);
  assert.equal(step.level, expected.level, `expected level for "${expected.level}"`);
  assert.equal(step.title, expected.title, `expected title for "${expected.level}"`);
  assert.deepEqual(
    [...step.labels].sort(),
    [...expected.labels].sort(),
    `expected labels for "${expected.level}"`
  );
  assertStepShape(step, `step "${expected.level}"`);
}

// Unknown levels throw an error that names the offending input.
assert.throws(
  () => getProgressionStep("bogus-level" as ContributorLevel),
  (err: unknown) => err instanceof Error && err.message.includes("bogus-level"),
  "getProgressionStep should reject unknown levels"
);

// Full list: five steps, one per level, in progression order.
const steps = listProgressionSteps();
assert.equal(steps.length, 5);
assert.deepEqual(
  steps.map((step) => step.level),
  allLevels,
  "levels should be listed in progression order"
);
for (const step of steps) {
  assertStepShape(step, `listed step "${step.level}"`);
  const listed = steps.find((candidate) => candidate.level === step.level);
  assert.ok(listed);
  assert.deepEqual(getProgressionStep(step.level), listed, "lookup should agree with listing");
}

// Table 2: normalizeContributorLevel. Source behavior (verified against the
// implementation): input is lower-cased and edge-trimmed before an exact
// lookup in an alias map. Each level accepts its canonical id, a short
// alias and a space-separated variant; inner whitespace must match exactly.
const normalizeCases: { input: string; expected: ContributorLevel; name: string }[] = [
  { input: "first-pr", expected: "first-pr", name: "canonical first-pr" },
  { input: "second-pr", expected: "second-pr", name: "canonical second-pr" },
  { input: "trust-builder", expected: "trust-builder", name: "canonical trust-builder" },
  { input: "maintainer-shadow", expected: "maintainer-shadow", name: "canonical maintainer-shadow" },
  { input: "bigger-task", expected: "bigger-task", name: "canonical bigger-task" },
  { input: "first", expected: "first-pr", name: "short alias first" },
  { input: "second", expected: "second-pr", name: "short alias second" },
  { input: "trust", expected: "trust-builder", name: "short alias trust" },
  { input: "shadow", expected: "maintainer-shadow", name: "short alias shadow" },
  { input: "bigger", expected: "bigger-task", name: "short alias bigger" },
  { input: "first pr", expected: "first-pr", name: "space variant first pr" },
  { input: "second pr", expected: "second-pr", name: "space variant second pr" },
  { input: "trust builder", expected: "trust-builder", name: "space variant trust builder" },
  {
    input: "maintainer shadow",
    expected: "maintainer-shadow",
    name: "space variant maintainer shadow"
  },
  { input: "bigger task", expected: "bigger-task", name: "space variant bigger task" },
  { input: "FIRST-PR", expected: "first-pr", name: "upper-case canonical" },
  { input: "SECOND", expected: "second-pr", name: "upper-case short alias" },
  { input: "Trust Builder", expected: "trust-builder", name: "mixed-case space variant" },
  { input: "Shadow", expected: "maintainer-shadow", name: "title-case short alias" },
  { input: "bIgGeR tAsK", expected: "bigger-task", name: "scrambled case is normalized" },
  { input: "  first-pr  ", expected: "first-pr", name: "spaces around the edges are trimmed" },
  { input: "\tsecond pr\n", expected: "second-pr", name: "tabs/newlines around edges are trimmed" },
  { input: " trust ", expected: "trust-builder", name: "trim plus short alias" }
];

for (const testCase of normalizeCases) {
  const resolved = normalizeContributorLevel(testCase.input);
  assert.equal(resolved, testCase.expected, testCase.name);
  assert.equal(
    getProgressionStep(resolved).level,
    testCase.expected,
    `${testCase.name}: resolved level should always be a valid step`
  );
}

// Table 3: rejected inputs. Only the alias map resolves, so empty/blank
// input, "maintainer" (there is no bare alias for it), inner whitespace or
// casing noise, and unknown levels all throw. The error is the fixed usage
// hint, so we check for its "--level" token instead of the whole sentence.
const rejectedInputs: { input: string; name: string }[] = [
  { input: "", name: "empty string" },
  { input: "   ", name: "whitespace-only string" },
  { input: "maintainer", name: "\"maintainer\" is not a bare alias" },
  { input: "first  pr", name: "double inner space" },
  { input: "firstpr", name: "missing separator" },
  { input: "third-pr", name: "level that does not exist" },
  { input: "level: first-pr", name: "label form is not a level id" },
  { input: "bigger-task!", name: "trailing punctuation" }
];

for (const testCase of rejectedInputs) {
  assert.throws(
    () => normalizeContributorLevel(testCase.input),
    (err: unknown) => err instanceof Error && err.message.includes("--level"),
    `${testCase.name} should be rejected with the usage hint`
  );
}

// The listed array is a defensive copy: mutating it must not corrupt the
// progression data behind later lookups.
const tainted = listProgressionSteps();
tainted.push(tainted[0]);
assert.equal(listProgressionSteps().length, 5, "mutating a listed array should not leak");
assert.deepEqual(
  listProgressionSteps().map((step) => step.level),
  allLevels,
  "listing should stay intact after a caller mutates a previous copy"
);

console.log("Progression path tests passed.");
