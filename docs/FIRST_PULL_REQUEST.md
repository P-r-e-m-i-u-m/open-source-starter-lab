# Your First Pull Request

A Pull Request (PR) is how you propose changes to a project. It lets maintainers review your work before it gets merged into the main codebase.

---

## Step-by-Step

### 1. Fork the repository

On GitHub, click **Fork** (top right) to get your own copy of the project.

### 2. Clone your fork

Copy the URL of your fork from GitHub, then run:
```
git clone https://github.com/YOUR-USERNAME/REPO-NAME.git
cd REPO-NAME
```

Replace YOUR-USERNAME with your GitHub username and REPO-NAME with the name of your fork.

For example, if your GitHub username is o231152-cloud:

```
git clone https://github.com/o231152-cloud/open-source-starter-lab.git
cd open-source-starter-lab
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
git add PATH/TO/CHANGED_FILE.md
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
3. Confirm the PR is **from your fork branch to the upstream `main` branch**
4. Write a short title and description explaining what you changed and why
5. Click **Create pull request**

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
## Safe Issue-to-PR Workflow Example

Use this flow for small beginner-friendly issues, especially documentation changes.

```bash
git clone https://github.com/YOUR-USERNAME/REPO-NAME.git
cd REPO-NAME
git checkout -b docs/short-description
git status
```
What each command does:

- `git clone` downloads your fork to your computer.
- `cd` moves you into the project folder.
- `git checkout -b` creates a new branch for your work.
- `git status` shows which files changed.

After editing files:

```bash
git status
git add PATH/TO/CHANGED_FILE.md
git commit -m "docs: describe your change"
git push origin docs/short-description
```
What each command does:

- `git status` helps you review your changes before committing.
- `git add` stages the file you want to include in your next commit.
- `git commit` saves your staged change locally with a short message.
- `git push` sends your branch to GitHub so you can open a pull request.

If a command fails, do not guess or run destructive commands. Copy the full error message and ask for help in the issue or pull request. Include:

- the command you ran
- what you expected to happen
- what happened instead

---
## Quick Reference

```bash
git checkout -b fix/my-change     # create branch
git add PATH/TO/CHANGED_FILE.md   # stage the file you changed
git commit -m "describe change"   # commit
git push origin fix/my-change     # push to GitHub
# then open PR on GitHub
```
