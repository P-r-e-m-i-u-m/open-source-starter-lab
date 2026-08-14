# Fixing "Updates Were Rejected" Git Push Errors

## What does a rejected push mean?

A rejected push means GitHub did not accept the commits you tried to send. Git protects the remote branch when accepting your push would overwrite commits that are already there.

A common version of this error is:

```
! [rejected]        main -> main (fetch first)
error: failed to push some refs
```

This usually happens because the remote branch contains commits that are not in your local branch. For example, someone may have pushed a change to `main` after you last downloaded the repository. Your local branch is now behind the remote branch, so Git asks you to bring your branch up to date first.

## Safely inspect the situation

Do not start by forcing the push. Run these commands one at a time:

```bash
git status
git remote -v
git fetch origin
git log --oneline --decorate --graph --all
```

These commands show your current branch and working tree, confirm which repository is called `origin`, download the latest remote history without changing your files, and show how your local and remote branches relate to each other.

Make sure you know which branch you are on before continuing. In most contributions, you should work on a feature branch rather than pushing directly to `main`.

## The safe solution for `main`

If you intentionally work on your local `main` branch and it has local commits to keep, rebase those commits on top of the latest remote `main`:

```bash
git pull --rebase origin main
```

Then push again:

```bash
git push origin main
```

Rebase replays your local commits after the remote commits. It keeps the history linear without creating an unnecessary merge commit.

## The safe solution for a feature branch

For a feature branch, update it with the latest `main` before pushing your branch:

```bash
git fetch origin
git rebase origin/main
```

When the rebase finishes, push your feature branch:

```bash
git push origin my-feature-branch
```

Replace `my-feature-branch` with the name of your branch. If the branch already has a pull request, rebasing may change its commit history. That is expected, but check the changes carefully before pushing.

## If the rebase stops for a conflict

Git pauses when it cannot combine your changes with a remote change automatically. Run `git status` to see which files need attention. Open each file, choose the correct content, and remove the conflict-marker lines that begin with `<<<<<<<`, `=======`, and `>>>>>>>`.

After resolving a file, stage it and continue the rebase:

```bash
git add <file>
git rebase --continue
```

Repeat these steps if Git reports another conflict. If Git opens an editor for a commit message, keep the message or update it, then save and close the editor so the rebase can continue.

If you are unsure how to resolve a conflict, or the result does not look right, abort the rebase safely:

```bash
git rebase --abort
```

This returns your branch to the state it had before the rebase started. You can then inspect the situation again or ask for help.

## Why not use `git push --force`?

Do not casually run:

```bash
git push --force
```

Force pushing replaces the remote branch history with your local history. It can delete commits that other contributors have pushed and disrupt an existing pull request. Beginners should not use it to bypass a rejected push.

## When is `--force-with-lease` appropriate?

Sometimes you intentionally rewrite your own feature branch, such as after rebasing a pull request branch. After checking the branch and confirming that nobody else's new commits will be overwritten, the safer force-push option is:

```bash
git push --force-with-lease origin my-feature-branch
```

`--force-with-lease` refuses to push if the remote branch changed since your last fetch. It is still a history-rewriting operation, so coordinate with anyone sharing the branch and ask for help if you are unsure. It should not be used as the first response to a `fetch first` error.

## Before you push

- Confirm you are on the intended feature branch with `git status`.
- Check that your working tree contains only the changes you expect.
- Fetch recent remote changes when the branch may be out of date.
- Review the commit graph if Git reports a rejected push.
- Rebase and resolve conflicts before pushing again.
- Do not use a force push unless you understand the history change and have checked with collaborators.
