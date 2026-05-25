# Start Here: Get Your First Merge

Welcome. This repo is for practicing open source in a real GitHub workflow without needing to understand a huge production codebase first.

If you searched for first pull request, first open-source contribution, good first issue, beginner GitHub project, or how to contribute to open source, start here.

---

# The 10 Minute Path

- [ ] Read this page
- [ ] Pick one issue by skill
- [ ] Comment: `I would like to work on this. Please assign me.`
- [ ] Run the project locally
- [ ] Make one focused change
- [ ] Open a pull request with your test result
- [ ] After merge, appear on the First Merge Wall

---

# Pick One Issue By Skill

Choose the row that feels closest to what you already know.

| Your skill | Start here |
| --- | --- |
| Docs or writing | [Docs first issues](https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/issues?q=is%3Aissue+is%3Aopen+label%3A%22skill%3A+docs%22+no%3Aassignee) |
| JavaScript or TypeScript | [JavaScript first issues](https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/issues?q=is%3Aissue+is%3Aopen+label%3A%22skill%3A+javascript%22+no%3Aassignee) |
| Testing | [Testing first issues](https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/issues?q=is%3Aissue+is%3Aopen+label%3A%22skill%3A+testing%22+no%3Aassignee) |
| Git basics | [Git beginner issues](https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/issues?q=is%3Aissue+is%3Aopen+label%3A%22skill%3A+git%22+no%3Aassignee) |
| Not sure | [Ask in the weekly assignment thread](https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/discussions/44) |

If an issue looks close but confusing, use the [First Issue Decoder](ISSUE_DECODER.md) before coding. A good first PR should be small enough to finish.

---

# Run The Project Locally

```bash
git clone https://github.com/P-r-e-m-i-u-m/open-source-starter-lab.git
cd open-source-starter-lab
npm install
npm run check
```

> If `npm run check` passes, you are ready to make a change.

---

# Ask To Be Assigned

Comment on the issue before starting:

```md
I would like to work on this. Please assign me.

I will keep the PR focused and run `npm run check` before opening it.
```

---

## Good First Issues

- Beginner issues:
  https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22

---

# Not Sure Which Issue Fits You?

Open the weekly assignment thread and write:

https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/discussions/44

```text
Hi, I am new to open source.

I know:
I want to practice:
I have time for: 15 min / 30 min / 1 hour
I am stuck on:
```

> If Git itself is confusing, that is okay. Ask anyway. This repo is meant to be a no-shame place for beginner GitHub questions.

---

# More Useful Searches

## Beginner Friendly Issues

https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/issues?q=is%3Aissue+is%3Aopen+label%3A%22beginner+friendly%22

## Help Wanted Issues

https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22

## CLI Coding Issues

https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/issues?q=is%3Aissue+is%3Aopen+label%3Acli

## Unassigned Issues

https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/issues?q=is%3Aissue+is%3Aopen+no%3Aassignee

---

# What A Good PR Looks Like

A strong first PR is small and easy to review.

## What changed?

- Added a short guide for reading CI failures.

## Why does this help?

- New contributors can understand failed checks without guessing where to click.

## Testing

- [x] I ran `npm run check`

Closes #123

---

# How You Know The Repo Is Active

- Live maintainer queue: https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/issues/46
- Latest merged PRs: https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/pulls?q=is%3Apr+is%3Amerged+sort%3Aupdated-desc
- First Merge Wall: https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/blob/main/docs/FIRST_MERGE_WALL.md

The queue exists so contributor requests do not disappear.

---

# If You Get Stuck

Ask in Discussions or comment on the issue with:

- what command you ran
- what happened
- what you expected
- your operating system

> Short, clear questions are welcome here.

---

# Contributor Ladder

Start small, then level up:

- Fix one typo or unclear sentence
- Add one guide or example
- Add one CLI test
- Improve one CLI behavior
- Help another contributor in Discussions
- Review a small PR kindly and clearly

See `CONTRIBUTOR_LADDER.md` for more detail.

---

# After Your First PR

After your first PR is merged, add your entry to `FIRST_MERGE_WALL.md`.
