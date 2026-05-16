# Fixing "Updates Were Rejected" Git Push Errors

## Why does this happen?

When you see this error:

```
error: failed to push some refs to 'origin'
hint: Updates were rejected because the remote contains work that you do not have locally.
```

It means the remote branch (on GitHub) has commits that your local branch does not have yet. Git refuses to push so you do not accidentally overwrite someone else's work.

## The safe fix — rebase

Run these commands one at a time:

```
git pull --rebase origin main
```

Then push again:

```
git push origin your-branch-name
```

## What does `--rebase` do?

Instead of creating a messy merge commit, rebase replays your local commits on top of the latest remote commits. Your history stays clean and linear.

## ⚠️ Warning — commands to avoid

Do not run this unless you fully understand what it does:

```
git push --force
```

Force pushing rewrites remote history and can permanently delete other people's commits. When in doubt, use `--rebase` instead.

## Still stuck?

- Run `git status` to see the current state of your branch.
- Run `git log --oneline -5` to see your last 5 commits.
- Ask for help in Discussions before using any destructive command.
