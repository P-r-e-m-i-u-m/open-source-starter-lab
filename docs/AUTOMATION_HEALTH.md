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
| `Automation Health` | Dry-runs automation scripts daily AND monitors for workflows stuck in the queue | Read-only permissions, `continue-on-error: true`, 20-minute queued run threshold |

---

## Daily Health Check

`Automation Health` runs this command:

```bash
npm run automation:health
