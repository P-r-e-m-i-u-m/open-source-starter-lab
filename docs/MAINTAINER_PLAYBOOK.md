# Maintainer Playbook

## Write Issues That People Can Finish

Strong issues include:

- Context
- File or folder to change
- First issue decoder
- Acceptance criteria
- Expected test command
- Difficulty label
### Ready-Issue Checklist

Before marking an issue as ready for contributors, ensure it includes the following:

- [ ] **Context:** Explains why this issue matters and provides necessary background.
- [ ] **Focused Goal:** Defines a single, achievable outcome.
- [ ] **Suggested Files:** Points contributors toward the files they will likely need to modify.
- [ ] **Acceptance Criteria:** Clearly describes the required end result.
- [ ] **Verification:** Explains how contributors can prove their work is complete.
- [ ] **Labels Applied:**
  - [ ] `needs triage` (to flag for maintainer review)
  - [ ] A relevant `skill: ...` label (e.g., `skill: docs` for documentation tasks)

### Worked Example: From Discussion to Ready Issue

**Before: Discussion comment**

> The Windows setup guide skips the PowerShell command for checking Node.js. Adding it would save new contributors time.

**After: Ready issue**

**Context**
- Source: Discussion #44.
- Windows contributors need a clear way to confirm that Node.js is available.

**Goal**
- Add the missing verification step to the Windows setup guide.

**Acceptance criteria**
- Document the Node.js verification command in the Windows section.
- Keep the change focused on the setup guide.
- Confirm the repository check passes.

**Labels**
- `needs triage`
- `skill: docs`

## Decode Good First Issues

Before publishing a beginner issue, make sure a new contributor can answer:

- What does this issue mean in plain English?
- What skill is needed?
- Which file should they open first?
- What command should they run first?
- What should they avoid changing?
- What proof should the PR include?

Use [ISSUE_DECODER.md](ISSUE_DECODER.md) as the standard. If the issue cannot be decoded quickly, split it into a smaller issue.

## Good Review Style

Helpful review:

```md
Nice start. Can you also add the command output for `npm run check`?
That will make the PR easier to verify.
```

Correction without discouraging:

```md
This is close. The wording is a little hard for beginners.
Can you rewrite it with one command per step?
```

## Discussion Answer Style

Weak answer:

```md
Use git init.
```

Better answer:

```md
If this is a new local folder, run:

git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <repo-url>
git push -u origin main

If you already cloned the repo, skip `git init`.
```

Short can be good. Complete is better.

## Discussion Answer Examples

See [DISCUSSION_ANSWER_EXAMPLES.md](./DISCUSSION_ANSWER_EXAMPLES.md) for examples of weak and strong discussion answers, safe command usage, and situations where maintainers should ask clarifying questions before providing guidance.
