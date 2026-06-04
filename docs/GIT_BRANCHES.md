# Git Branches: A Beginner's Guide

## Why Branches?

When you work on a project, you don't want to break the main code while experimenting. Branches let you work in isolation — your changes stay separate until you're ready to merge them in.

Think of it like making a copy of the project, doing your work there, and then folding your changes back in when everything looks good.

---

## Core Commands

### Create and switch to a new branch

```bash
git checkout -b my-feature-branch
```

This does two things at once: creates the branch and switches to it. Use a descriptive name like `fix-typo-readme` or `add-login-page`.

### Switch between branches

```bash
git checkout main          # go back to main
git checkout my-feature-branch   # go to your branch
```

Or with the newer syntax (Git 2.23+):

```bash
git switch main
git switch my-feature-branch
```

### See all branches

```bash
git branch
```

The branch you're currently on has a `*` next to it.

### Delete a branch (after merging)

```bash
git branch -d my-feature-branch
```

---

## A Typical Workflow

```
main branch:      A --- B --- C
                           \
your branch:                D --- E
```

1. You branch off `main` at commit C
2. You make commits D and E on your branch
3. You open a Pull Request to merge your changes back into `main`

---

## Things to Keep in Mind

- **Always branch off an up-to-date main.** Run `git pull` on `main` before creating your branch.
- **One branch per task.** Don't mix unrelated changes in one branch.
- **Branch names matter.** Names like `fix/login-bug` or `feature/dark-mode` are easy to understand at a glance.

---

## Next Step

Once your branch has commits you're happy with, open a Pull Request to get your changes reviewed and merged. See [FIRST_PULL_REQUEST.md](FIRST_PULL_REQUEST.md) for a step-by-step walkthrough.
