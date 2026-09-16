# Commit Message Guide

Good commit messages make the project history easier to understand and review.

## Our convention

Use a short prefix followed by a clear description of the change:

* `docs:` — documentation changes
* `fix:` — bug fixes or corrections
* `feat:` — new features or capabilities
* `test:` — test changes

These prefixes are a project convention, not a CI gate. They help maintainers quickly understand what a commit contains.

## Real examples from this repository

### `docs:`

```text
docs: link commit message guide (#301)
```

This clearly identifies a documentation change and describes what was added.

### `fix:`

```text
fix: improve FAQ accessibility (#168)
```

This identifies a correction and briefly explains what was fixed.

### `feat:`

```text
feat: add CLI fit help text (#138)
```

This identifies a new capability and describes the feature.

### `test:`

```text
test: add whitespace duplicate test and selection docs (#215)
```

This identifies a change related to tests and briefly describes what was added.

## Weak vs. better

A vague message:

```text
docs: update contributor proof
```

A clearer message:

```text
docs: refine first PR review guide and clean up formatting (#179)
```

The second message tells the reviewer what documentation was changed instead of only saying that something was updated.

## Quick examples for first-time contributors

If you are unsure which prefix to use, choose one based on the purpose of your change:

- `docs:` for guides, README updates, explanations, or documentation cleanup
- `fix:` for typos, broken links, logic errors, or small bug corrections
- `feat:` for new commands, pages, or user-visible features
- `test:` for adding or updating tests

Examples:

```text
docs: add quickstart steps for first-time contributors
fix: correct broken clone command in setup guide
feat: add profiles command to CLI
test: add coverage for unknown command handling

## Quick checklist

Before committing, ask:

* Does the message start with an appropriate prefix?
* Does it describe the actual change?
* Is it short enough to understand at a glance?
* Would another contributor understand the purpose without opening the commit?

For pull requests, also follow the contribution and testing guidance in `CONTRIBUTING.md`.
