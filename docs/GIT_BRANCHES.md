# Git Branches: A Beginner's Guide

## Why Branches?

When you work on a project, you don't want to break the main code while experimenting. Branches let you work in isolation — your changes stay separate until you're ready to merge them in.

Branches let you work on a separate line of development. Your changes stay separate from `main` until you're ready to share them through a Pull Request.

Branches let multiple contributors work in parallel without interfering with stable `main`.
---

## Core Commands

### Start from updated main
```bash
git checkout main
git pull origin main
git checkout -b my-feature-branch
```

Starting from an updated `main` helps ensure your branch includes the latest project changes before you begin working.

### Create and switch to a new branch

```bash
git checkout -b my-feature-branch
```

This does two things at once: creates the branch and switches to it. Use a descriptive name like `fix-typo-readme` or `add-login-page`.

### Switch between branches

**Works everywhere:**

```bash
git checkout main          # go back to main
git checkout my-feature-branch   # go to your branch
```

Newer Git Syntax (2.23+):

```bash
git switch main
git switch my-feature-branch
```

### See all branches

```bash
git branch
```

For example:

```text
* my-feature-branch
  main
```

The `*` marks the branch you're currently working on. Before making changes, check that the `*` is next to your feature branch rather than `main`.

If you're on the wrong branch, switch to the correct one:

```bash
git checkout my-feature-branch
```

### Delete a branch (after merging)

```bash
git branch -d my-feature-branch
```
You can usually delete your local feature branch after your Pull Request has been merged.
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
