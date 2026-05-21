# Common First PR Mistakes

Your first pull request does not need to be perfect. It should be small,
clear, and easy for a maintainer to review.

## 1. Changing too many things at once

Mistake: You fix the issue, update unrelated wording, and reformat files in the
same PR.

Fix: Keep one PR focused on one issue. If you notice another improvement, write
it down and open a separate issue or PR later.

## 2. Not reading the issue carefully

Mistake: You start coding before checking the goal, suggested files, and done
criteria.

Fix: Before editing, copy the "done when" list into your notes and check each
item before opening the PR.

## 3. Working on an issue that someone else already claimed

Mistake: You make a PR without checking comments, assignments, or existing pull
requests.

Fix: Read the issue comments and open PRs first. If it is unclear, leave a short
comment asking whether the issue is still available.

## 4. Forgetting to test the change

Mistake: You open the PR with no proof that the project still works.

Fix: Run the project checks from the README or CONTRIBUTING guide. Add the exact
command and result to your PR description.

## 5. Using an unclear PR title or description

Mistake: The PR says only "fix" or "update docs", so the maintainer has to guess
what changed.

Fix: Use a title that names the change, such as "Add first PR mistakes guide".
In the description, include what changed, why it helps, and how you tested it.

## 6. Taking review feedback personally

Mistake: Review comments feel like criticism, so you stop responding or explain
too much.

Fix: Treat review as part of the workflow. Reply briefly, make the requested
change, and ask a question if the feedback is unclear.

## Quick checklist

- Does the PR solve one clear issue?
- Did you check comments and existing PRs first?
- Did you only change the files needed for the issue?
- Did you run the expected checks?
- Does the PR description explain the change and the test result?
