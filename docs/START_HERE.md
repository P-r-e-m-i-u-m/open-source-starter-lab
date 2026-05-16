# Start Here

Welcome. This repo is for practicing open source in a real GitHub workflow without needing to understand a huge production codebase first.

If you searched for first pull request, first open-source contribution, good first issue, beginner GitHub project, or how to contribute to open source, start here.

## The 10 Minute Tour

1. Read this page.
2. Run the project locally.
3. Pick one small issue.
4. Comment on the issue before starting.
5. Open a focused pull request with your test result.
6. Add yourself to the First Merge Wall after your PR is merged.

## Run The Project

```bash
git clone https://github.com/P-r-e-m-i-u-m/open-source-starter-lab.git
cd open-source-starter-lab
npm install
npm run check
```

If `npm run check` passes, you are ready to make a change.

## Choose A First Task

Use this order:

1. Pick an issue labeled `good first issue`.
2. Prefer docs, examples, or one small CLI test for your first PR.
3. Avoid broad rewrites for your first contribution.
4. Comment with a short note like: `I would like to work on this.`

Good first issues are here:
https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22

If you are not sure which issue fits you, open the Introduce Yourself Discussion and write:

https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/discussions/26

```md
Hi, I am new to open source.

I know: HTML, CSS, JavaScript, Python, TypeScript, docs, or testing.

I want to make my first pull request. Which issue should I take?
```

If Git itself is confusing, that is okay. Ask anyway. This repo is meant to be a no-shame place for beginner GitHub questions.

More useful searches:

- Beginner friendly issues: https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/issues?q=is%3Aissue+is%3Aopen+label%3A%22beginner+friendly%22
- Help wanted issues: https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22
- CLI coding issues: https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/issues?q=is%3Aissue+is%3Aopen+label%3Acli
- Unassigned issues: https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/issues?q=is%3Aissue+is%3Aopen+no%3Aassignee

You can also pick by skill:

- Skill-based first issues: https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/blob/main/docs/SKILL_BASED_FIRST_ISSUES.md
- Tell me your skill: https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/discussions/35

## What A Good PR Looks Like

A strong first PR is small and easy to review.

```md
## What changed?

- Added a short guide for reading CI failures.

## Why does this help?

- New contributors can understand failed checks without guessing where to click.

## Testing

- [x] I ran `npm run check`

Closes #123
```

## If You Get Stuck

Ask in Discussions or comment on the issue with:

- what command you ran
- what happened
- what you expected
- your operating system

Short, clear questions are welcome here.

## Contributor Ladder

Start small, then level up:

1. Fix one typo or unclear sentence.
2. Add one guide or example.
3. Add one CLI test.
4. Improve one CLI behavior.
5. Help another contributor in Discussions.
6. Review a small PR kindly and clearly.

See [CONTRIBUTOR_LADDER.md](CONTRIBUTOR_LADDER.md) for more detail.

After your first PR is merged, add your entry to [FIRST_MERGE_WALL.md](FIRST_MERGE_WALL.md).
