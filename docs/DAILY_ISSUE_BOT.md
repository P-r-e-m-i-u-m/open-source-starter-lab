# Daily Issue Bot

Daily Issue Bot creates up to five beginner-friendly issues every day from a curated maintainer backlog.

It is designed to keep the repo active without creating spam.

## What It Does

- Runs daily through GitHub Actions.
- Picks one issue from `src/dailyIssueBacklog.ts`.
- Creates the issue with clear context, goal, suggested files, and acceptance criteria.
- Adds useful labels like `daily starter issue`, `good first issue`, and `beginner friendly`.
- Skips creating the issue if the same daily starter issue already exists.

## Duplicate Handling

The bot never posts a starter issue whose title is already open.

- It compares titles without caring about capitalization.
- A skipped candidate does not use up a slot, so the bot keeps walking the backlog until it has enough fresh issues.
- If every backlog item is already open, the run creates nothing and reports how many issues it could fill.

This decision lives in `src/dailyIssueSelection.ts` as a pure function, so `tests/smoke.test.ts` can cover it without calling the GitHub API.

## Manual Run

Maintainers can run it from GitHub:

1. Open Actions.
2. Select `Daily Issue Bot`.
3. Click `Run workflow`.

Local dry run:

```bash
npm run issue:daily
```

To preview a smaller batch:

```bash
npm run build
node dist/scripts/createDailyIssue.js --dry-run --count 2
```

Create an issue locally with GitHub credentials:

```bash
$env:GITHUB_REPOSITORY="P-r-e-m-i-u-m/open-source-starter-lab"
$env:GITHUB_TOKEN="your-token"
npm run issue:create
```

## Maintainer Rule

The bot should create useful work, not noise.

Good automated issues:

- Have a clear goal
- Are small enough for beginners
- Include acceptance criteria
- Point to suggested files
- Are transparent about automation

Bad automated issues:

- Pretend to be written manually
- Ask people for fake activity
- Repeat the same vague task
- Create work that nobody should actually do
