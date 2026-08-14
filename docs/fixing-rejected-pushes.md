# How to fix rejected git push errors (non-fast-forward)

If your `git push` gets rejected with a `fetch first` or `non-fast-forward` error, it usually just means the remote branch has new commits that you don't have locally yet. Git blocks the push so you don't accidentally overwrite those remote changes.

Here is the standard way to fix it so you can get your code pushed.

## 1. Pull the latest code
First, grab the missing commits from the remote repository to sync your local branch:

\`\`\`bash
git pull origin <your-branch-name>
\`\`\`

## 2. Handle any merge conflicts
Git will try to merge the new remote commits with your local work automatically.
* **If it auto-merges:** You might be prompted to save a default merge commit message in your terminal. Just save and exit.
* **If there are conflicts:** Git will tell you which files are conflicting. Open them up, resolve the overlapping lines, and then run:

  \`\`\`bash
  git add .
  git commit -m "chore: resolve merge conflicts"
  \`\`\`

## 3. Push again
Now that your local branch is fully up to date, your push will go through:

\`\`\`bash
git push origin <your-branch-name>
\`\`\`

---

### A quick note on force pushing
Avoid using `git push --force` or `-f` to bypass this error. Force pushing rewrites the remote history and deletes other people's commits, which causes headaches for maintainers. Always pull and resolve instead.