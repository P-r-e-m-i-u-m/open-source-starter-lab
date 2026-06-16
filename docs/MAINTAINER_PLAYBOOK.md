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
