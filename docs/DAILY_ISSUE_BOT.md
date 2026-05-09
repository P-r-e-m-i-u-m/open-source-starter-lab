# Daily Issue Bot

Daily Issue Bot creates one beginner-friendly issue every day from a curated maintainer backlog.

It is designed to keep the repo active without creating spam.

## What It Does

- Runs daily through GitHub Actions.
- Picks one issue from `src/dailyIssueBacklog.ts`.
- Creates the issue with clear context, goal, suggested files, and acceptance criteria.
- Adds useful labels like `daily starter issue`, `good first issue`, and `beginner friendly`.
- Skips creating the issue if the same daily starter issue already exists.

## Manual Run

Maintainers can run it from GitHub:

1. Open Actions.
2. Select `Daily Issue Bot`.
3. Click `Run workflow`.

Local dry run:

```bash
npm run issue:daily
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
