# AI Contribution Policy

AI tools are allowed in this repo, but contributors are responsible for the work they submit.

This policy exists because beginner-friendly projects should welcome learning while still protecting maintainers from low-quality, unverified changes.

## Allowed

- Using AI to understand an issue.
- Using AI to draft docs or examples.
- Using AI to explain errors.
- Using AI to suggest small code changes.
- Asking AI to help write a PR description.

## Required

Every contributor must:

- understand the change before opening a PR
- keep the PR small and focused
- run the requested checks, usually `npm run check`
- explain what changed and why
- include testing or verification notes
- respond to review feedback in their own words

## Not Allowed

- Submitting code or docs you do not understand.
- Opening many AI-generated PRs without reading the project.
- Changing unrelated files to look active.
- Adding fake contributors, fake proof, or fake claims.
- Ignoring CI failures.

## PR Disclosure

If AI helped you, a simple note is enough:

```md
AI helped me draft the wording, but I reviewed the change and ran `npm run check`.
```

## Maintainer Review Rule

Maintainers should review the result, not the tool. A good AI-assisted PR is still small, tested, understandable, and useful.
