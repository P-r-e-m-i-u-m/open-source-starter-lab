# Recipe: Adding a New Label to the Automation

The daily issue bot (`scripts/createDailyIssue.ts`) doesn't just create issues — it also makes sure every label it needs actually exists on the repo before it applies them. That logic lives in a function called `ensureLabels`. If you want the bot to use a label that doesn't exist yet, this is where you add it.

## How the bot manages labels

Inside `scripts/createDailyIssue.ts`, `ensureLabels` keeps two lookup tables: one mapping each label name to a color, and one mapping it to a description.

```ts
const labelColors: Record<string, string> = {
  "daily starter issue": "5319e7",
  documentation: "0075ca",
  "good first issue": "7057ff",
  // ...more labels
};

const labelDescriptions: Record<string, string> = {
  "daily starter issue": "Generated from the curated daily issue backlog",
  documentation: "Docs, examples, or wording",
  "good first issue": "Small task for new contributors",
  // ...more labels
};
```

For every label a daily issue needs, the bot checks whether it already exists on the repo (a `GET` to `/repos/{owner}/{repo}/labels/{label}`). If GitHub returns a 404, it creates the label with a `POST` request using the color and description from those two tables:

```ts
if (response.status === 404) {
  await githubRequest(`/repos/${owner}/${repo}/labels`, token, {
    method: "POST",
    body: JSON.stringify({
      name: label,
      color,
      description: labelDescriptions[label]
    })
  });
}
```

If a label with that name already exists, the bot leaves it alone — it does **not** overwrite the color or description of an existing label.

## Adding a new label, step by step

Say you want to add a new label called `skill: writing` in bright yellow, for issues about writing prose or documentation copy.

1. **Open `scripts/createDailyIssue.ts`** and find the `labelColors` object inside `ensureLabels`.

1. **Add your label's name and color** (6-digit hex, no `#`):

```ts
   const labelColors: Record<string, string> = {
     // ...existing labels
     "skill: writing": "fbca04"
   };
```

1. **Add a matching entry to `labelDescriptions`**, right below it in the same function:

```ts
   const labelDescriptions: Record<string, string> = {
     // ...existing descriptions
     "skill: writing": "Tasks focused on writing clear prose, copy, or explanations"
   };
```

1. **Reference the label** wherever a `DailyIssue` needs it — typically in `src/dailyIssueBacklog.ts`, in that issue's `labels` array. The bot only creates labels that show up in an issue's `labels` list, so adding the color/description alone won't make the label appear on GitHub.

1. **Run the check:**

```bash
   npm run check
```

   This confirms the build, tests, and CLI demo all still pass.

1. **Verify it end-to-end (optional but useful):** run the bot in dry-run mode to see the issue body it would generate without hitting the GitHub API:

```bash
   npm run build
   node dist/scripts/createDailyIssue.js --dry-run
```

## Common mistakes

- **Adding the color/description but forgetting to add the label to an issue's `labels` array.** The bot only calls `ensureLabels` with the labels a given `DailyIssue` actually lists — an entry sitting unused in `labelColors` never gets created on GitHub.
- **Including the `#` in the color value.** GitHub's API expects a bare 6-digit hex string like `fbca04`, not `#fbca04`.
- **Reusing an existing label name with a different color.** Since the bot skips labels that already exist (it only acts on a 404), changing the color here won't update it on GitHub — you'd need to edit the label manually in the repo settings.
- **Typos between the two tables.** `labelColors` and `labelDescriptions` are matched by the exact label name string. A mismatched key means the label gets created with no description.
