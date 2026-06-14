# Contributing to Open Source Starter Lab

Thank you for your interest in contributing! This project is designed to be welcoming for beginners while maintaining high standards similar to those at Meta, Google, and GitHub.

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md) (or the standard GitHub one if not present). We expect respectful, inclusive, and constructive interactions.

## Development Setup

```bash
git clone https://github.com/P-r-e-m-i-u-m/open-source-starter-lab.git
cd open-source-starter-lab
npm install
npm run check
```

## Contribution Workflow (Professional Standards)

1. **Find an issue** — Look for `good first issue`, `help wanted`, or skill-matched labels.
2. **Claim it** — Comment on the issue (`I would like to work on this`) or use the `.take` command if available.
3. **Create a branch** — Use a clear name: `git checkout -b docs/improve-guide` or `feature/add-cli-test`.
4. **Make focused changes** — Keep PRs small and atomic (one logical change).
5. **Test locally** — Always run `npm run check` and verify no regressions.
6. **Open PR** — Use the PR template, fill it completely with context.
7. **Respond to feedback** — Address comments quickly and professionally.
8. **Celebrate success** — After merge, update your contributor proof in the First Merge Wall.

## Pull Request Guidelines (Top Company Level)

- **Title**: Use conventional commits style (e.g. `docs: improve Git branches guide`, `fix: CI lint error`).
- **Description**: Include What changed, Why, How tested, Screenshots/command output.
- **Scope**: Small and reviewable in <10 minutes.
- **Quality**: Clean commits, no unrelated changes.
- **CI**: All checks must pass before review.

## Review Process

- Maintainers aim for feedback within 24-48 hours.
- Reviews will be constructive, specific, and encouraging.
- See [PR Welcome Guard](docs/PR_WELCOME_GUARD.md) for automated help.

## Questions or Help

- Use [Discussions](https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/discussions) for questions.
- Weekly help threads available.

We're here to help you grow as a contributor and maintainer. Let's build something great together! 🌟


## Pull Request Descriptions

A helpful pull request description makes reviews faster and easier.

When opening a pull request, please include:

- A summary of your changes
- The reason for the change
- Testing evidence
- Related issues using `Closes #issue-number`

For examples and guidance, see the [PR Description Guide](docs/PR_DESCRIPTION_GUIDE.md).

## Reproducing Bugs

Before working on a bug fix, make sure you can reproduce the issue locally. Clear reproduction steps help reviewers understand the problem and verify the fix.

See [Bug Reproduction Guide](docs/BUG_REPRODUCTION_GUIDE.md).