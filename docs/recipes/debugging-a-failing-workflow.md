# Recipe: Debugging a Failing GitHub Actions Run

When a GitHub Actions workflow fails, the last red line is not always the
actual cause. This guide shows how to find the real error.

## 1. Open the failed workflow run

Go to the repository on GitHub and open the **Actions** tab.

Look for a workflow run with a red ❌ icon and open it. The workflow page
shows which job failed.

## 2. Open the failed job

Click the job marked with a red ❌.

The job page contains logs for each step that ran. Expand the failed step
and read the log output.

## 3. Do not stop at the final line

A common mistake is to treat this message as the real error:

```text
Error: Process completed with exit code 1.