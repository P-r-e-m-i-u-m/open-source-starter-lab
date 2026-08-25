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

## Website and Accessibility Labels

Use the `website` label for issues involving the repository website, pages, site content, navigation, or other website-facing changes.
Use the `accessibility` label for issues focused on making the website or project interfaces more accessible, including keyboard navigation, visible focus states, semantic markup, labels, and related accessibility improvements.

When an issue clearly involves both areas, maintainers may apply both labels.

## Daily Health Check

`Automation Health` runs this command:

```bash
npm run automation:health
```

---

### Queued Run Monitor

The health check also looks for workflow runs that are still in the `queued` state.

A queued run is considered stuck when it has been waiting for more than **20 minutes**.

When a stuck run is found, the workflow:

- Logs a warning with the workflow name, run number, age, and URL.
- Adds a warning to the GitHub Actions workflow summary.
- Lists the affected runs so they can be investigated.
- Keeps the health check job successful instead of failing because of a single stuck run.

A queued run that is younger than 20 minutes is reported as healthy and does not trigger a warning.

If a stuck run is reported, check GitHub Actions runner availability and consider cancelling or restarting the affected run.