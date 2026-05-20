# Contributor Progress Path

Most beginner-friendly repos stop at the first pull request.

This repo is designed to help contributors keep going:

```text
First PR -> Second PR -> Trust Builder -> Maintainer Shadow -> Bigger Task
```

The goal is not to make people look busy. The goal is to help beginners become reliable contributors.

## Use The CLI

```bash
npm run build
node dist/src/cli.js next --level first-pr
node dist/src/cli.js next --level second-pr
node dist/src/cli.js next --level maintainer-shadow
```

Supported levels:

- `first-pr`
- `second-pr`
- `trust-builder`
- `maintainer-shadow`
- `bigger-task`

## Level 1: First PR

Goal: make one safe contribution and learn the full GitHub workflow.

Good tasks:

- Fix unclear wording.
- Add one missing link.
- Improve one command example.
- Add a contributor card.

Proof to show:

- What changed.
- Why it helps a beginner.
- `npm run check` output.

## Level 2: Second PR

Goal: move from tiny docs edits into a slightly more useful repo improvement.

Good tasks:

- Improve one CLI output message.
- Add one small docs example.
- Add one smoke test assertion.
- Clarify one issue acceptance checklist.

Proof to show:

- The exact file changed.
- Before/after behavior or wording.
- Full project check output.

## Level 3: Trust Builder

Goal: show that you can help the project without only changing code.

Good tasks:

- Answer one beginner Discussion with clear steps.
- Improve one issue so the next contributor can finish it.
- Add a missing proof checklist to a task.
- Suggest a smaller scope on an unclear idea.

Proof to show:

- Link the issue, PR, or Discussion helped.
- Explain what confusion was removed.
- Keep the reply kind and specific.

## Level 4: Maintainer Shadow

Goal: practice maintainer work with a small, reviewable action.

Good tasks:

- Triage one issue with the right labels.
- Rewrite one vague issue into clear acceptance criteria.
- Check one PR description for proof.
- Draft a review comment that is specific and kind.

Proof to show:

- The maintainer problem.
- The before/after issue or comment.
- Why the next contributor has a clearer path.

## Level 5: Ready For Bigger Task

Goal: take a larger task without getting stuck or waiting silently.

Good tasks:

- Split one bigger idea into two or three small PRs.
- Add a focused CLI feature with tests.
- Improve contributor automation safely.
- Write a design note before changing shared behavior.

Proof to show:

- A short plan before coding.
- A focused PR.
- Tests, command output, and tradeoffs.

## Maintainer Reply

Use this when someone finishes a first PR:

```md
Nice work on the first merge.

If you want a next step, try the contributor path:

`node dist/src/cli.js next --level second-pr`

That will show a slightly stronger task type, what proof to include, and how to keep the PR easy to review.
```
