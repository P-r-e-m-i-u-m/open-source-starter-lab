# Recipe: Writing a GitHub Action From Scratch

A GitHub Action is an automated workflow that runs on GitHub's servers when something happens in your repository — like a push, a pull request, or a schedule.

## 1. Create the Workflow File

GitHub Actions live in `.github/workflows/`. Create a new `.yml` file there:

```
.github/workflows/my-action.yml
```

## 2. Define the Trigger

The `on:` key controls when your workflow runs. Common triggers used in this repo:

```yaml
on:
  push:
    branches: [main]        # runs when code is pushed to main
  pull_request:             # runs on every pull request
  schedule:
    - cron: "0 9 * * 1"    # runs every Monday at 9am UTC
  workflow_dispatch:        # allows manual trigger from GitHub UI
```

## 3. Set Permissions

Always declare the minimum permissions your workflow needs. This repo follows the principle of least privilege:

```yaml
permissions:
  contents: read            # read repo files
  issues: write             # only if your workflow creates issues
  pull-requests: write      # only if your workflow comments on PRs
```

## 4. Write the Job

A job defines what machine to use and what steps to run:

```yaml
jobs:
  my-job:
    runs-on: ubuntu-latest
    steps:
      - name: Check out code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install dependencies
        run: npm ci

      - name: Run check
        run: npm run check
```

## 5. Concrete Example From This Repo

The file `.github/workflows/daily-issue.yml` in this repo uses a scheduled trigger to run `scripts/createDailyIssue.ts` every day. It:
- Triggers on a cron schedule
- Uses `issues: write` permission to create GitHub issues
- Runs `npm ci` to install dependencies cleanly before executing

Use that file as a reference when building your own workflow.

## 6. Tips

- Use `npm ci` instead of `npm install` in CI — it is faster and uses exact versions from `package-lock.json`.
- Test your workflow manually first using `workflow_dispatch` before relying on a schedule.
- Keep each workflow focused on one job. Separate concerns into separate workflow files.
