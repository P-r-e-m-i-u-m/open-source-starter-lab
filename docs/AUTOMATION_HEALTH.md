# Automation Health

This repo uses GitHub Actions to keep contributor support moving without manual busywork.

The goal is not to make the repo noisy. The goal is to catch broken automation early and keep every workflow easy to recover.

## Active Automations

| Workflow | Purpose | Safety guard |
| --- | --- | --- |
| `CI` | Builds and tests the project on pushes and PRs | 10 minute timeout |
| `Daily Issue Bot` | Creates one beginner starter issue from a curated backlog | Duplicate protection in the script, two daily schedule windows, concurrency guard |
| `Weekly Help Thread` | Opens the weekly issue-assignment discussion | Existing-thread check, concurrency guard |
| `Contributor Queue` | Keeps maintainer follow-up visible | Concurrency guard, secondary rate-limit skip |
| `PR Welcome Guard` | Replies to PRs with review-readiness guidance | Updates one marked comment instead of posting duplicates |
| `Contributor Proof After Merge` | Thanks contributors, closes linked issues, updates the First Merge Wall, and creates contributor passports | Per-PR concurrency guard, direct issue listing instead of search API |
| `Automation Health` | Dry-runs automation scripts daily without writing to GitHub | No token needed, read-only permissions |

## Daily Health Check

`Automation Health` runs this command:

```bash
npm run automation:health
```

It builds the project and dry-runs:

- daily issue creation
- weekly help discussion text
- PR welcome comment text
- after-merge contributor proof planning

If this workflow fails, it usually means a script no longer compiles or a dry-run path broke.

## Recovery Steps

1. Open the failed workflow log.
2. Check whether the failure is a code error, missing token, or GitHub rate limit.
3. Run locally:

```bash
npm run check
npm run automation:health
```

4. If the failure mentions `MAINTAINER_TOKEN`, update the repo secret.
5. If the failure mentions a secondary rate limit, wait a few minutes and rerun failed jobs.
6. If a workflow created a duplicate comment or issue, check whether the script has a marker or duplicate guard before changing it.

## Token Notes

Only `MAINTAINER_TOKEN` is expected as a repo secret.

It is used when an automation must act as the maintainer account instead of `github-actions[bot]`.

When rotating the token, update:

```text
Settings -> Secrets and variables -> Actions -> MAINTAINER_TOKEN
```

Minimum expected token ability:

- repository issue/comment access
- workflow support if you use it for workflow-triggered maintainer actions

Do not add extra scopes unless a workflow actually needs them.

## Long-Term Rule

Every new automation should have:

- a dry-run mode when possible
- duplicate protection
- a timeout
- clear logs
- narrow permissions
- a recovery note in this file
