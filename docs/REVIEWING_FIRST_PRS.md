# Reviewing First PRs

Reviewing a beginner's first pull request is a great way to give back to the community. A thoughtful review helps new contributors learn without feeling discouraged.

## Why this matters

A harsh or vague review can turn someone away from open source entirely. A kind, specific review helps them grow and often turns into a long-term contributor.

## Review Checklist

- Does the PR solve what the issue actually asked for?
- Are the changes small and focused (no unrelated edits)?
- Does the code/docs follow the project's existing style?
- Did the contributor include proof their change works (e.g. `npm run check` output)?
- Is the PR description clear about what changed and why?

## Writing Helpful Review Comments

Be specific, kind, and actionable. Point out *what* to fix and *why*, not just that something is wrong.

**Instead of:**
> This is wrong.

**Try:**
> This works, but the function name doesn't match our naming convention — could you rename it to `getUserData` to match the rest of the file?

**Instead of:**
> Needs more testing.

**Try:**
> Could you add the output of `npm run check` to the PR description? That helps confirm the change doesn't break anything.

## Asking for Proof of Testing

If a PR doesn't include evidence the change works, it's fine to ask for it. For example:

> Could you paste the output of `npm run check` here? Just want to confirm everything passes before merging.

This isn't about distrust — it's a normal part of keeping the project reliable, and it teaches the contributor good habits for future PRs.

## A Note on Tone

Remember every reviewer was a beginner once. Assume good intent, explain the "why" behind requests, and celebrate progress — even small first PRs deserve encouragement.