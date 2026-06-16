# Reading GitHub Actions Failures

A red check on your first pull request can look worse than it is. Most failures become easier once you know where to click and what part of the log matters.

## Where To Click In A Pull Request

1. Open your pull request on GitHub.
2. Find the checks section near the bottom of the PR conversation or next to the latest commit.
3. Click the failing check name.
4. Open the job that failed.
5. Expand the step with the red `X`.

The useful error is usually close to the bottom of that failed step, not at the top of the page.

## How To Read The Log

You do not need to read every line.

Start with this order:

1. Find the step that failed.
2. Scroll near the end of that step.
3. Look for words like `error`, `failed`, `cannot find`, or `Expected`.
4. Ignore earlier setup lines unless the error says setup failed.

Helpful rule:

- green steps passed
- the red step is the one to inspect first
- the first clear error message is usually more useful than the full stack trace

## Example: TypeScript Build Failure

You might see a log line like this:

```text
src/cli.ts:14:7 - error TS2322: Type 'string' is not assignable to type 'number'.
```

This usually means:

- the file is `src/cli.ts`
- the problem is on line `14`
- TypeScript expected a `number`
- the code gave it a `string` instead

Good next steps:

1. Open the file named in the error.
2. Go to the line number from the log.
3. Compare the value you passed with the type that code expects.
4. Run `npm run check` again after your fix.

## Asking For Help Usefully

If you are stuck, ask for help with the details that let someone reproduce the problem quickly.

Include:

- the link to the failing pull request or workflow run
- the name of the failed job or step
- the exact error message
- the command you ran locally
- what you expected to happen

Good example:

```text
My PR failed in the CI job during the build step.
The error says: Type 'string' is not assignable to type 'number' in src/cli.ts line 14.
I ran npm run check locally on macOS and got the same error.
I expected the build to pass after changing the CLI output.
```

That gives maintainers enough context to help without guessing.
