# Recipe: Writing a One-Off Migration Script

A migration script is a script you run once to fix, rename, or restructure existing data. In this repo, that usually means updating files, labels, or issue backlog entries in bulk.

The golden rule: **always add a dry-run mode before touching anything real.**

## 1. Start With a Dry-Run Flag

Before your script changes anything, check for a `--dry-run` flag. If it's present, only print what *would* happen — don't actually do it.

```typescript
const dryRun = process.argv.includes("--dry-run");

if (dryRun) {
  console.log(`[dry-run] Would rename label "${oldName}" to "${newName}"`);
} else {
  await renameLabel(oldName, newName);
}
```

This repo already uses this pattern in `scripts/createDailyIssue.ts` — search for `hasFlag("--dry-run")` to see a real example.

## 2. Always Have a Rollback Plan

Before running a migration on real data, ask yourself: *"Can I undo this?"*

Good rollback strategies:
- **Backup first** — write a script that exports the current state to a JSON file before changing anything.
- **Soft deletes** — rename instead of delete, so you can rename back.
- **Idempotency** — write the script so running it twice produces the same result as running it once.

## 3. Concrete Example: Renaming a Label

Suppose you want to rename the label `"beginner friendly"` to `"good first issue"` across all open issues.

A safe approach:
1. Run with `--dry-run` first and check the output.
2. Confirm the list looks correct.
3. Run without `--dry-run` to apply the change.

```typescript
const dryRun = process.argv.includes("--dry-run");
const oldLabel = "beginner friendly";
const newLabel = "good first issue";

console.log(`${dryRun ? "[dry-run] " : ""}Renaming "${oldLabel}" → "${newLabel}"`);

if (!dryRun) {
  await githubRequest(`/repos/${owner}/${repo}/labels/${encodeURIComponent(oldLabel)}`, token, {
    method: "PATCH",
    body: JSON.stringify({ name: newLabel }),
  });
}
```

## 4. Run the Project Check After

Once your migration script is written, make sure the project still builds and tests pass:

```bash
npm run check
```

If the check passes, the script is safe to include in the repo.
