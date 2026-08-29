# Commit Message Guide

Good commit messages make the project history easier to understand and review.

## Our convention

Use a short prefix followed by a clear description of the change:

* `docs:` — documentation changes
* `fix:` — bug fixes or corrections
* `feat:` — new features or capabilities

These prefixes are a project convention, not a CI gate. They help maintainers quickly understand what a commit contains.

## Real examples from this repository

### `docs:`

```text
docs: add guide explaining squash merge and commit history (#194)
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

## Quick checklist

Before committing, ask:

* Does the message start with an appropriate prefix?
* Does it describe the actual change?
* Is it short enough to understand at a glance?
* Would another contributor understand the purpose without opening the commit?

For pull requests, also follow the contribution and testing guidance in `CONTRIBUTING.md`.
