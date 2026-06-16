# Your First Pull Request

A Pull Request (PR) is how you propose changes to a project. It lets maintainers review your work before it gets merged into the main codebase.

---

## Step-by-Step

### 1. Fork the repository

On GitHub, click **Fork** (top right) to get your own copy of the project.

### 2. Clone your fork

```bash
git clone https://github.com/YOUR-USERNAME/REPO-NAME.git
cd REPO-NAME
```

### 3. Create a branch

Never work directly on `main`. Create a branch for your change:

```bash
git checkout -b fix/my-change
```

Not sure how branches work? See [GIT_BRANCHES.md](GIT_BRANCHES.md).

### 4. Make your changes

Edit files, write code, fix that typo — whatever the task calls for.

### 5. Stage and commit

```bash
git add .
git commit -m "Fix typo in README introduction"
```

Write a short, clear commit message that describes *what* you changed.

### 6. Push to your fork

```bash
git push origin fix/my-change
```

### 7. Open the Pull Request

1. Go to your fork on GitHub
2. You'll see a **"Compare & pull request"** banner — click it
3. Write a short title and description explaining what you changed and why
4. Click **Create pull request**

---

## What Happens Next

A maintainer will review your PR. They might:

- **Approve and merge it** — your change is in!
- **Request changes** — leave a comment asking you to tweak something. Update your branch and push again; the PR updates automatically.
- **Ask a question** — just reply in the PR comment thread.

---

## Tips for a Smooth First PR

- Keep it small and focused — one fix or feature per PR
- Check the project's `CONTRIBUTING.md` if it exists
- Make sure your branch is up to date with `main` before opening the PR
- Be patient — maintainers are often volunteers

---

## Quick Reference

```bash
git checkout -b fix/my-change     # create branch
git add .                          # stage changes
git commit -m "describe change"   # commit
git push origin fix/my-change     # push to GitHub
# then open PR on GitHub
```
