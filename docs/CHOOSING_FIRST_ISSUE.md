# How to Choose a Good First Issue

A good first issue should be small enough to finish, easy to verify, and clear about what file or behavior needs to change. This guide will help you identify the right issue for your first contribution.

---

## What Makes an Issue Beginner-Friendly?

Look for issues that include:

- ✅ A **narrow goal** – one docs page, one example, or one test
- ✅ **Clear files or folders** to edit
- ✅ **Acceptance criteria** you can check off
- ✅ A **test command**, such as `npm run check`
- ✅ **No need** for production credentials, private data, or maintainer-only access
- ✅ Useful **labels** like `good first issue`, `beginner friendly`, `first-timers-only`
- ✅ A **time estimate** (e.g., `time: 30 min` or `time: 1 hour`)

---

## Before Starting Work

**Always comment on the issue first** with a short note like:

```md
I would like to work on this. My plan is to update the docs and run `npm run check`.
```


---

## Good First Issue Examples

Good first issues are small, specific, and easy to verify. Examples from this repository include:

- Updating one documentation page to clarify an existing instruction.
- Adding one small example to an existing guide.
- Adding a focused test for an existing behavior.
- Fixing a small documentation typo or broken link.
- Improving a focused section in `docs/GIT_BRANCHES.md` or `docs/FIRST_PULL_REQUEST.md`.
- Adding a beginner-focused case to `tests/smoke.test.ts` without changing existing behavior.

## Risky First Issues

Some issues may be harder for a first contribution because they have a large or unclear scope. Examples include:

- Reworking several parts of the application at once.
- Changing core architecture or major project structure.
- Fixing a bug that requires access to production systems or private data.
- Tasks without clear acceptance criteria or a way to verify the result.
- Changing command behavior across `src/cli.ts` and its related tests in one issue.
- Modifying GitHub automation such as `scripts/createDailyIssue.ts`, especially when it requires repository access or credentials.

When in doubt, comment on the issue before starting work. Briefly explain what you plan to change and ask whether the scope is appropriate for a first contribution.
