# Architecture

Open Source Starter Lab is a small TypeScript project with a static website, GitHub Actions automation, and public contributor proof files.

## System Map

```text
Contributor
  |
  | opens issue / discussion / pull request
  v
GitHub
  |
  | triggers workflows
  v
Automation scripts
  |
  | update comments, queue, issues, proof files
  v
Public repo proof
  |
  | README, First Merge Wall, Passports, Website
  v
Next contributor
```

## Main Areas

| Area | Path | Purpose |
| --- | --- | --- |
| CLI source | `src/` | Beginner checklists, issue discovery, and route commands |
| Scripts | `scripts/` | GitHub automation logic used by workflows |
| Tests | `tests/` | Smoke tests for core CLI behavior |
| Website | `site/` | Static visual hub for the project |
| Docs | `docs/` | Contributor guides, maintainer playbooks, policies, and launch material |
| Contributor proof | `contributors/passports/` and `docs/FIRST_MERGE_WALL.md` | Public proof after reviewed merges |
| Workflows | `.github/workflows/` | CI, Pages deploy, daily issues, queue refresh, welcome guard, passport proof, health checks |

## Automation Flow

1. `Daily Issue Bot` creates one curated starter issue when needed.
2. `Assignment Helper` replies when contributors ask for an issue.
3. `Contributor Queue` keeps maintainer follow-up visible.
4. `PR Welcome Guard` checks whether a PR is review-ready.
5. `Contributor Proof After Merge` thanks the contributor, closes managed linked issues, updates the First Merge Wall, and creates or updates a passport.
6. `Automation Health` dry-runs automation paths every day without writing to GitHub.

## Design Principles

- Keep first tasks small.
- Prefer public proof over private claims.
- Use dry-runs for automation safety.
- Avoid GitHub search APIs in scheduled or merge automation when issue-list endpoints are enough.
- Make every contributor-facing path explain the next step.

## Local Verification

```bash
npm run check
npm run automation:health
```

Use these before changing scripts, workflows, the CLI, or contributor proof logic.
