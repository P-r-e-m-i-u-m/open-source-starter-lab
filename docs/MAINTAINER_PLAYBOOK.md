# Maintainer Playbook

## Write Issues That People Can Finish

Strong issues include:

- Context
- File or folder to change
- First issue decoder
- Acceptance criteria
- Expected test command
- Difficulty label

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

## Converting a Discussion Into an Issue

Good ideas often start in Discussions. When a comment in a Discussion identifies a real, scoped problem or improvement, it can become a proper issue.

### When to convert

Convert a Discussion comment into an issue when it:

- Describes a specific, actionable change (not just a vague idea)
- Has a clear file or area to change
- Can be finished by one contributor in one PR
- Is not already covered by an open issue

### What to copy from the Discussion

When creating the issue, include:

- **Context** — paste the original Discussion comment or summarise the problem in 1–2 sentences
- **Link back** — add a `Related discussion: #<number>` line so people can trace the origin
- **Goal** — one sentence describing what the finished issue looks like
- **Suggested file** — which file to open first
- **Acceptance criteria** — 2–4 checkboxes that define "done"

### Ready issue checklist

Before publishing the issue, confirm:

- [ ] The title is specific (not "improve docs")
- [ ] A suggested file is listed
- [ ] Acceptance criteria are checkboxes, not paragraphs
- [ ] The `needs triage` label is added until a maintainer reviews scope
- [ ] A skill label is added (`documentation`, `testing`, `cli`, etc.)
- [ ] A time label is added (`time: 15 min`, `time: 30 min`, `time: 1 hour`)

### Example

A contributor comments in a Discussion:

> "I keep seeing `npm run check` fail because the lockfile is out of sync. Is there a guide for this?"

That becomes an issue:

```
Title: Add a guide for fixing npm ci lockfile sync errors
Context: Contributors see lockfile errors when running npm run check after pulling.
Suggested file: docs/NPM_CI_TROUBLESHOOTING.md
Done when:
- [ ] Explains what causes the lockfile error
- [ ] Shows the fix command
- [ ] Mentions npm run check as the verification step
Labels: documentation, needs triage, time: 30 min
```

