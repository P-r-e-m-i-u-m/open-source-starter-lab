# Recipe: Writing Clearer Error Messages

Good error messages save time — yours and your teammates'. This recipe shows
you the difference between vague and clear errors, using real examples from
this codebase, and explains what makes an error message actually useful.

## What makes an error message actionable?

A good error message answers three questions:

1. **What went wrong?** — Be specific, not generic.
2. **Where did it go wrong?** — File, line, or command, if relevant.
3. **How do I fix it?** — Give a next step, even a small one.

---

## ❌ Vague vs ✅ Clear — Side-by-Side Examples

### Example 1: Dependency install failure

This repo uses `npm ci` in CI (see [CONTRIBUTING.md](../../CONTRIBUTING.md)).
If `package-lock.json` is out of sync with `package.json`, you'll hit an error.

| Style | Message |
|-------|---------|
| ❌ Vague | `npm error` |
| ✅ Clear | `npm ci can only install packages when your package.json and package-lock.json are in sync. Run \`npm install\` to update your lockfile, then commit it.` |

The clear version tells you **exactly** what's out of sync and **what command** to run to fix it.

### Example 2: Missing required field in a PR or issue

| Style | Message |
|-------|---------|
| ❌ Vague | `Validation failed.` |
| ✅ Clear | `PR template incomplete: the "What does this PR do?" section is empty. Please describe your change in 1–2 sentences.` |

The clear version names the **specific field** and shows what a valid value looks like.

### Example 3: A failing CI check

| Style | Message |
|-------|---------|
| ❌ Vague | `Check failed.` |
| ✅ Clear | `ESLint: 3 errors in src/cli/run.js. Run \`npm run lint -- --fix\` to auto-fix, then review remaining errors manually.` |

---

## The formula

When writing an error message, use this mental template:

> **[What failed]**: [specific reason]. [Next step or command to fix it.]

**Example:**
> `Could not load config file (.easeuirc). File not found at project root.`  
> `Run \`npx easeui init\` to generate a default config.`

---

## Quick checklist before you ship an error message

- [ ] Does it say *what* went wrong (not just "error")?
- [ ] Does it avoid internal jargon the user won't know?
- [ ] Does it suggest a next step or command?
- [ ] Is it one or two sentences — not a wall of text?

---

## See also

- [Handling GitHub API Errors Gracefully](./handling-github-api-errors.md)
- [npm ci Troubleshooting Guide](../NPM_CI_TROUBLESHOOTING.md)
