# Reading CI Failures

When a CI check fails on a pull request (PR), GitHub shows the failed check with a red ❌. You can open the check details to see what went wrong.

## Where to click in a PR

1. Open the pull request on GitHub.
2. Find the **Checks** section near the bottom of the PR.
3. Find the check with the red ❌ next to its name.
4. Click **Details** next to the failed check.
5. GitHub will open the CI run, where you can read the logs and find the error.

## What the log output means

The **log** is the text that the CI system prints while it runs your project's commands. It shows what the system was doing and where it stopped.

You will usually see many lines, but you do not need to understand every line.

Look for:

- **The command being run** — for example, `npm run build` or `npm test`.
- **The error message** — this usually explains what went wrong.
- **The file and line number** — this tells you where the problem was found.
- **The final failure message** — this tells you that the check could not finish successfully.

Sometimes the log contains a long **stack trace**. A stack trace is a list showing the path the program took before the error happened. You usually do not need to read the whole thing. Start with the clearest error message that points to your own code.

## Example: TypeScript build failure

Imagine the CI log contains:

```text
> npm run build

> my-app@1.0.0 build
> tsc

src/utils/getUser.ts(12,9): error TS2322: Type 'string' is not assignable to type 'number'.

12   const userId: number = user.id;
           ~~~~~~

Found 1 error.
```

In plain language, TypeScript is saying:

- The problem is in `src/utils/getUser.ts`.
- It is on line **12**.
- `userId` was declared as a **number**.
- `user.id` is currently a **string**.
- TypeScript will not allow a string to be assigned to a variable that should contain a number.

So this line:

```ts
const userId: number = user.id;
```

has a type mismatch.

You need to check whether `user.id` should actually be a number, or whether `userId` should be a string, and then make the types consistent.

The important part of the log is:

```text
error TS2322: Type 'string' is not assignable to type 'number'.
```

That sentence tells you **what is wrong**. The file name and line number tell you **where to look**.

## If you're stuck

When asking for help, include enough information for someone else to understand the problem:

- **Which check failed** — include the exact check name.
- **The exact error line** — copy the relevant error message from the CI log instead of paraphrasing it.
- **Where it happened** — include the file and line number if the log gives them.
- **What you already tried** — briefly describe what you changed or checked.
- **Relevant code** — include the small section of code around the error if needed.

Avoid saying only "CI is broken." The check name and exact error usually make it much easier to figure out what needs fixing.