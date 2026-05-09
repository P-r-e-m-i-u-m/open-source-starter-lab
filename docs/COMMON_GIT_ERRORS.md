# Common Git Errors

## `fatal: not a git repository`

You are not inside a Git project.

Fix:

```bash
git init
```

or move into the project folder:

```bash
cd your-project
```

## `nothing to commit, working tree clean`

Git does not see any new changes.

Fix:

```bash
git status
```

Confirm you edited the correct folder.

## `Updates were rejected`

The remote branch has work you do not have locally.

Fix:

```bash
git pull --rebase origin main
git push
```

## Authentication Failed

GitHub usually needs browser login or a token through Git Credential Manager.

Fix:

```bash
git credential-manager github login
```
