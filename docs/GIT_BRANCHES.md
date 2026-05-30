# Git Branches: A Beginner's Guide

## What is a Branch?

In Git, a branch is a lightweight movable pointer to a commit. The default branch name is `main` (or `master` in older repositories).

Branches allow you to work on different versions of your repository at the same time.

## Why Use Branches?

- **Isolation**: Work on new features or bug fixes without affecting the stable code.
- **Collaboration**: Multiple developers can work on different branches simultaneously.
- **Experimentation**: Try out ideas safely; if they don't work, you can delete the branch.

## Basic Branch Commands

### List Branches
```bash
git branch
```
This lists all local branches. The current branch is highlighted with an asterisk (`*`).

### Create a Branch
```bash
git branch new-feature
```
This creates a new branch named `new-feature` but does not switch to it.

### Switch Branches
```bash
git checkout new-feature
```
Switches to the `new-feature` branch.

### Create and Switch in One Command
```bash
git checkout -b new-feature
```
Creates the branch and switches to it immediately.

### Push a Branch to Remote
```bash
git push -u origin new-feature
```
This pushes the branch to the remote repository (named `origin`) and sets up tracking.

### Delete a Branch
#### Delete Locally
```bash
git branch -d new-feature
```
Deletes the branch if it has been merged.

#### Force Delete Locally
```bash
git branch -D new-feature
```
Deletes the branch regardless of merge status (use with caution).

#### Delete Remote Branch
```bash
git push origin --delete new-feature
```
or (newer Git)
```bash
git push origin -d new-feature
```

## Typical Workflow for a Feature

1. **Update your main branch**
   ```bash
   git checkout main
   git pull
   ```

2. **Create a new branch for your work**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make changes and commit**
   ```bash
   git add .
   git commit -m "Add amazing feature"
   ```

4. **Push the branch and open a pull request**
   ```bash
   git push -u origin feature/amazing-feature
   ```

5. **After your pull request is approved and merged, you can delete the branch**
   ```bash
   git branch -d feature/amazing-feature   # locally
   git push origin --delete feature/amazing-feature   # remotely
   ```

## Best Practices

- **Name your branches descriptively**: Use prefixes like `feature/`, `bugfix/`, `docs/` etc.
- **Keep branches short-lived**: Merge them back to main as soon as the work is complete.
- **Pull from main regularly**: To avoid big merge conflicts, occasionally do `git pull origin main` while working on your branch.
- **Delete old branches**: Both locally and remotely to keep the repository clean.

## Further Reading

- [Git Branching - Basic Branching and Merging](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging)
- [GitHub Flow](https://guides.github.com/introduction/flow/)

---
*This guide is intended for first-time contributors. Feel free to improve it!*
