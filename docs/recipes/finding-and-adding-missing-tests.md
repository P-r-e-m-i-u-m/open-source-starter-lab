# Recipe: Finding and Adding Missing Test Assertions

When contributing code to an open-source project, adding a new feature can feel intimidating. A great way to build confidence and make a high-value contribution is to find an **existing, working piece of logic that lacks adequate test coverage** and write a focused test for it.

This recipe walks you step-by-step through how to find untested branches, write a clean test assertion using this repository's built-in conventions, and prove that your test works.

---

## Why Add Tests to Existing Code?

1. **Safety Net**: Tests protect against accidental regressions. If another contributor changes shared code in the future, your test ensures they do not unintentionally break existing user-facing behavior.
2. **Low Risk**: You do not modify production code in `src/`—you only add assertions in `tests/`, making your Pull Request very easy and safe for maintainers to review.
3. **Deep Learning**: Reading the source and test suites side-by-side is the fastest way to understand how a project actually works.

---

## Step 1: Pair a Source File with its Test File

In this repository:
* Source code lives in `src/` (e.g. `src/plugins/streak.ts`, `src/checklist.ts`, `src/issueFitFinder.ts`).
* Corresponding test files live in `tests/` and end with `.test.ts` (e.g. `tests/streak.test.ts`, `tests/checklist.test.ts`, `tests/issueFitFinder.test.ts`).

To run a specific test file locally during development:
```bash
npm run build && node dist/tests/streak.test.js
```
*(Note: TypeScript files compile to JavaScript in the `dist/` directory before running).*

---

## Step 2: Inspect the Source Code for Branching Logic

Open a source file and look for conditional statements, ternary operators, or edge-case handling. These are prime places where an author might have tested the "happy path" but missed an alternative branch.

### Case Study Example: `src/plugins/streak.ts`

In `src/plugins/streak.ts`, look at the `formatPrStreak` function:

```ts
export function formatPrStreak(
  contributor: string,
  result: PrStreak
): string {
  const dayLabel = result.days === 1 ? "day" : "days";

  return [
    `@${contributor} merged PR streak`,
    "",
    `Current streak: ${result.days} ${dayLabel}`,
    `Most recent merge: ${result.latestMergeDate ?? "none"}`
  ].join("\n");
}
```

Notice the ternary branch on line 139:
* When `result.days === 1`, it uses `"day"`.
* When `result.days !== 1`, it uses `"days"`.

---

## Step 3: Audit Existing Tests to Spot Missing Scenarios

Next, open the matching test file (`tests/streak.test.ts`) and search for how `formatPrStreak` is tested.

In `tests/streak.test.ts`, you will find:

```ts
// 1. Tests singular 1-day streak
assert.equal(
  formatPrStreak("octocat", {
    days: 1,
    latestMergeDate: "2026-09-16"
  }),
  [
    "@octocat merged PR streak",
    "",
    "Current streak: 1 day",
    "Most recent merge: 2026-09-16"
  ].join("\n")
);

// 2. Tests 0-day streak
assert.equal(
  formatPrStreak("octocat", {
    days: 0,
    latestMergeDate: null
  }),
  [
    "@octocat merged PR streak",
    "",
    "Current streak: 0 days",
    "Most recent merge: none"
  ].join("\n")
);
```

### The Gap:
Notice what is missing! The existing tests only checked `days: 1` and `days: 0`. There was **zero test coverage** for the most common active streak scenario: a contributor with **2 or more days** (such as `days: 3` formatting as `"Current streak: 3 days"`).

---

## Step 4: Write the Focused Test Assertion

Follow the existing test file's formatting and conventions exactly. This repository uses Node.js's built-in `node:assert/strict` library.

Add your new test case directly to `tests/streak.test.ts`:

```ts
// Streaks greater than one day format with the plural "days" label.
assert.equal(
  formatPrStreak("octocat", {
    days: 3,
    latestMergeDate: "2026-09-16"
  }),
  [
    "@octocat merged PR streak",
    "",
    "Current streak: 3 days",
    "Most recent merge: 2026-09-16"
  ].join("\n")
);
```

### Test Conventions Checklist:
* [x] Uses `assert.equal()` for strings or `assert.deepEqual()` for objects/arrays.
* [x] Uses the existing file's spacing, naming, and inline comment style.
* [x] Does not import third-party libraries or modify production source code.

Run your new test to make sure it passes:
```bash
npm run build && node dist/tests/streak.test.js
```

---

## Step 5: Prove Your Test with a Deliberate Bug

A test that cannot fail cannot protect against bugs. Before submitting your contribution, prove that your test would catch a real regression.

1. **Temporarily break the source code** in `src/plugins/streak.ts`:
   ```ts
   // Change:
   const dayLabel = result.days === 1 ? "day" : "days";
   // To an intentional bug:
   const dayLabel = result.days >= 1 ? "day" : "days";
   ```
2. **Run the test**:
   ```bash
   npm run build && node dist/tests/streak.test.js
   ```
3. **Verify the failure**: The test should fail with an `AssertionError` showing that it expected `"3 days"` but received `"3 day"`.
4. **Restore the source code**:
   ```bash
   git checkout src/plugins/streak.ts
   ```
5. **Confirm it passes again**:
   ```bash
   npm test
   ```

---

## Step 6: Verify and Submit

Before committing, run the project's complete check command:
```bash
npm run check
```

Check your diff to ensure only your test file was touched:
```bash
git diff
```

Now commit and open your Pull Request!
```bash
git add tests/streak.test.ts
git commit -m "test: cover plural days in formatPrStreak"
git push -u fork <your-branch-name>
```
