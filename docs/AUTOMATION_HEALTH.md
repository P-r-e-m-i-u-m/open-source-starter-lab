# Automation Health

This repo uses GitHub Actions to keep contributor support moving without manual busywork.

The goal is not to make the repo noisy. The goal is to catch broken automation early and keep every workflow easy to recover.

---

## Active Automations

| Workflow | Purpose | Safety guard |
| --- | --- | --- |
| `CI` | Builds and tests the project on pushes and PRs | 10 minute timeout |
| `Daily Issue Bot` | Creates up to five beginner starter issues from a curated backlog | Duplicate protection in the script, two daily schedule windows, concurrency guard |
| `Weekly Help Thread` | Opens the weekly issue-assignment discussion | Existing-thread check, concurrency guard |
| `Assignment Helper` | Assigns contributors who comment `.take` or ask to work on an issue | Dry-run request recognition and marked reply body |
| `Contributor Queue` | Keeps maintainer follow-up visible | Concurrency guard, secondary rate-limit skip |
| `PR Welcome Guard` | Replies to PRs with review-readiness guidance | Updates one marked comment instead of posting duplicates |
| `Contributor Proof After Merge` | Thanks contributors, closes linked issues, updates the First Merge Wall, and creates contributor passports | Per-PR concurrency guard, direct issue listing instead of search API |
| `Automation Health` | Dry-runs automation scripts daily and warns about workflow runs stuck in the queue | Read-only permissions, separate non-blocking queued-run job, 20-minute default threshold |

---

## Daily Health Check

`Automation Health` runs this command:

```bash
npm run automation:health
```

It runs every day at 03:10 UTC and can also be triggered manually from the Actions tab.

---

## Queued Run Monitor

Scheduled workflows can sit in `queued` for hours (GitHub Actions incidents, runner shortages) and nobody notices until a bot fails to show up. The `Check for Stuck Queued Workflows` job in `automation-health.yml` closes that gap.

### What it does

- Asks the GitHub API for runs that are currently `queued`.
- Flags every run that has been waiting longer than the threshold (default: **20 minutes**).
- Adds one `warning` annotation per stuck run.
- Writes a table to the workflow summary with the workflow name, trigger, minutes queued, and a link to the run.

Runs younger than the threshold are ignored.

### It never fails the health check

- The check is its own job, so `Dry Run Automation Scripts` is not affected by it.
- The script always exits `0`, even when it finds stuck runs.
- If the API call fails, the job logs a "check skipped" warning instead of reporting a false "all healthy".

### Changing the threshold

- **Permanently:** set a repository variable named `QUEUED_THRESHOLD_MINUTES` (Settings → Secrets and variables → Actions → Variables).
- **For one manual run:** start `Automation Health` from the Actions tab and fill in `queued_threshold_minutes`.

Order of precedence: manual input, then the repo variable, then the built-in 20 minutes. A value that is not a whole number falls back to 20 with a warning.

### When a run is flagged

1. Open the run from the workflow summary.
2. Check [githubstatus.com](https://www.githubstatus.com) for Actions incidents.
3. If it is still queued, cancel it and re-run.

### Testing it

1. Run `Automation Health` from the Actions tab.
2. Open the `Check for Stuck Queued Workflows` job and read the summary.
3. To force a flag while another run is queued, start the workflow with `queued_threshold_minutes` set to `1`.