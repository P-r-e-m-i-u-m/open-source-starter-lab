# Maintainer Playbook

## Write Issues That People Can Finish

Strong issues include:

- Context
- File or folder to change
- Acceptance criteria
- Expected test command
- Difficulty label

## Good Review Style

Helpful review:

```md
Nice start. Can you also add the command output for `npm run check`?
That will make the PR easier to verify.
```

Correction without discouraging:

```md
This is close. The wording is a little hard for beginners.
Can you rewrite it with one command per step?
```

## Discussion Answer Style

Weak answer:

```md
Use git init.
```

Better answer:

```md
If this is a new local folder, run:

git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <repo-url>
git push -u origin main

If you already cloned the repo, skip `git init`.
```

Short can be good. Complete is better.
