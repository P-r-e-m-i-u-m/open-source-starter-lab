# Maintainer Playbook

## Write Issues That People Can Finish

Strong issues include:

- Context
- File or folder to change
- First issue decoder
- Acceptance criteria
- Expected test command
- Difficulty label

## 🧩 Triage Rules for Idea Issues (`needs triage`)

### When to KEEP
- Clear problem statement exists
- Scope is small and actionable
- Can be assigned to a contributor immediately
- Has enough context to start work

### When to SPLIT
- Multiple unrelated features in one issue
- Too large for a single contributor
- Requires different skill areas (UI + backend + infra)
- Cannot be completed in one PR

### When to CLOSE
- Too vague or unclear (“make UI better”)
- No real problem described
- Duplicate of existing issue
- Out of scope for this repository
- Cannot be acted on even after clarification

### When to CONVERT
- Good idea but unstructured
- Needs rewriting into proper issue format
- Requires clarification questions before implementation
- Can become a valid feature with proper structure

## 🏷️ Required Labels for Triaged Issues

Always add at least one from each category:

### Skill Level
- skill: beginner
- skill: intermediate
- skill: advanced

### Time Estimate
- time: small
- time: medium
- time: large

### Contributor Level
- contributor: first-time
- contributor: returning
- contributor: maintainer-track

Optional labels:
- needs-info
- good-first-issue
- enhancement
- idea

## 💬 Maintainer Reply Templates

### Needs Clarification
Thanks for the idea! Could you clarify the problem this solves and the expected behavior?

### Converted to Issue
Thanks! We’ve converted this idea into a structured issue for implementation.

### Closing Issue
Thanks for the suggestion. This is currently too vague or out of scope, so we’re closing it for now.

### Split Issue
This issue is too large for a single task, so we’ve split it into smaller actionable issues.

## ✅ Quality Check Before Closing or Approving

- Clear problem statement exists
- Issue is actionable
- Not a duplicate
- Proper labels added
- Scope is appropriate for one contributor
- Can be understood by a new contributor

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
