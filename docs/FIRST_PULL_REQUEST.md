# First Pull Request Guide

## 1. Clone the Repo

```bash
git clone https://github.com/P-r-e-m-i-u-m/open-source-starter-lab.git
cd open-source-starter-lab
```

## 2. Create a Branch

```bash
git checkout -b docs/add-my-note
```

## 3. Make One Small Change

Good examples:

- Fix unclear wording
- Add one Git error and fix
- Add a docs example
- Add your contributor card

## 4. Test

```bash
npm install
npm run check
```

## 5. Commit

```bash
git add .
git commit -m "Add beginner Git note"
```

## 6. Push

```bash
git push origin docs/add-my-note
```


## Example Issue-to-PR Workflow

The commands below show a safe beginner workflow from claiming an issue to opening a pull request.

```bash
git checkout -b docs/my-first-change
```

Creates a new branch for your work so your changes stay separate from the main branch.

```bash
npm run check
```

Verifies that the project builds and tests successfully before you submit your work.

```bash
git add .
```

Stages your changes for commit.

```bash
git commit -m "docs: improve beginner guide"
```

Saves your changes locally with a clear description.

```bash
git push origin docs/my-first-change
```

Uploads your branch to GitHub so you can open a pull request.

If a command fails, do not guess. Copy the error message and ask for help in Discussions or comment on the issue with the command you ran, what happened, and what you expected.

```
```

## 7. Open a Pull Request

In the pull request, include:

- What you changed
- Why it helps
- The result of `npm run check`
