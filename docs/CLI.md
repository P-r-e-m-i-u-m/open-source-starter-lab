# CLI Guide

The CLI gives beginners and maintainers a quick checklist.

## Beginner Checklist

```bash
node dist/src/cli.js check --profile beginner
```

Use this before opening a first pull request.

## Maintainer Checklist

```bash
node dist/src/cli.js check --profile maintainer
```

Use this before inviting contributors.

## Starter Issue Ideas

```bash
node dist/src/cli.js issues
```

This prints issue ideas with labels, difficulty, goals, and acceptance criteria.

Pass `--json` to print the same ideas as pretty JSON for automation (each entry has `title`, `label`, `difficulty`, `goal`, and `acceptanceCriteria`):

```bash
node dist/src/cli.js issues --json
```

## First Issue Fit Finder

```bash
node dist/src/cli.js fit --skill docs --time 30m
node dist/src/cli.js fit --skill javascript --time 1h
```

Use this when you are not sure which issue to pick. It suggests a skill-based path, an unassigned issue search, the first command to run, a proof checklist, and a comment you can paste before starting.

## Contributor Progression

```bash
node dist/src/cli.js next --level first-pr
node dist/src/cli.js next --level second-pr
node dist/src/cli.js next --level maintainer-shadow
```

Use this after a merge or when you want to move beyond beginner-only tasks. It prints the goal, good task types, labels to look for, proof to show, and the next move.

## Example Output: Beginner Checklist

Command:

```bash
node dist/src/cli.js check --profile beginner
```

Example output:

```text
Open Source Starter Lab - beginner checklist
Readiness score: 76/100

1. Fork or clone the repository
   Why: You need your own workspace before changing files.
   Command: git clone <repo-url>

2. Create a focused branch
   Why: Small branches make pull requests easier to review.
   Command: git checkout -b docs/add-my-first-note

3. Make one small improvement
   Why: The best first PR is clear, useful, and easy to verify.

4. Run the project check
   Why: Passing checks prove the change did not break the project.
   Command: npm run check

5. Open a pull request with evidence
   Why: Maintainers can review faster when you show what changed and how you tested.

Next action: Pick one good first issue and comment that you want to work on it.
```

## Example Output: Maintainer Checklist

Command:

```bash
node dist/src/cli.js check --profile maintainer
```

Example output:

```text
Open Source Starter Lab - maintainer checklist
Readiness score: 82/100

1. Label beginner-friendly work
   Why: Clear labels help new contributors find the right first task.

2. Use issue and PR templates
   Why: Templates turn vague reports into actionable tasks.

3. Keep CI fast and visible
   Why: A short green check builds trust with contributors.

4. Answer Discussions with complete steps
   Why: Good answers teach the public, not only the person asking.

5. Recognize contributors
   Why: People return when their work is noticed respectfully.

Next action: Create 3 small issues with clear acceptance criteria.
```

## Example Output: Starter Issue Ideas

Command:

```bash
node dist/src/cli.js issues
```

Example output:

```text
Starter issue ideas

- Add a Windows Git setup guide [good first issue, easy]
- Add common first PR mistakes [documentation, easy]
- Add CLI output examples [help wanted, easy]
- Add CLI tests for error paths [good first issue, medium]
- Add JSON output for issue ideas [help wanted, medium]
- Add a contribution glossary [good first issue, easy]
- Add a maintainer response playbook [documentation, medium]
```
