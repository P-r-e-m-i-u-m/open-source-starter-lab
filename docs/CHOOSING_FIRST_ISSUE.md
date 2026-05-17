# Choosing Your First Issue

A good first issue should be small enough to finish, easy to verify, and clear
about what file or behavior needs to change.

## What Makes An Issue Beginner-Friendly

Look for issues that include:

- a narrow goal, such as one docs page, one example, or one test
- clear files or folders to edit
- acceptance criteria you can check off
- a test command, such as `npm run check`
- no need for production credentials, private data, or maintainer-only access

Before starting, comment on the issue with a short note like:

```md
I would like to work on this. My plan is to update the docs and run `npm run check`.
```

That helps avoid duplicate work and gives maintainers a chance to correct the
scope before you spend time on it.

## Good First Issue Examples

Good first tasks in this repo usually look like:

- add one beginner guide under `docs/`
- improve one copy-paste command in `README.md`
- add one common Git error and fix to `docs/COMMON_GIT_ERRORS.md`
- add one CLI smoke test in `tests/`
- add one contributor-facing checklist item

These tasks are good because the diff stays small, the reviewer can understand
the goal quickly, and the test command is obvious.

## Risky First Issue Examples

Be careful with issues that ask you to:

- rewrite several guides at once
- redesign the whole CLI
- change build, release, or CI behavior without a clear test plan
- add a new dependency before explaining why it is needed
- work on an issue that already has an active assignee or open PR

These can still be useful tasks, but they are harder as a first contribution.
Ask for scope guidance before starting.

## Quick Decision Checklist

Use this before picking an issue:

- [ ] I understand the requested change in one sentence.
- [ ] I can name the file or folder I expect to edit.
- [ ] I know how to test the change.
- [ ] The issue has no active assignee or duplicate PR.
- [ ] I can finish it without private access or secrets.
- [ ] I left a short comment before starting work.

If you cannot check most of these boxes, choose a smaller issue or ask in
Discussions for a recommendation.
