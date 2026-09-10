# Recipe: Adding a New CLI Subcommand

This repo has a CLI tool (`src/cli.ts`) that supports multiple subcommands like `check`, `issues`, `fit`, and `next`. This recipe walks you through adding a brand new subcommand, including argument parsing and a matching test.

## How the CLI works

The `main()` function in `src/cli.ts` reads the command from `process.argv[2]` and routes to the right print function:

```typescript
function main(): void {
  const command = process.argv[2] ?? "check";

  if (command === "check") { ... }
  if (command === "issues") { ... }
  // etc.
}
```

Each command calls a dedicated `printXxx()` function that does the actual work.

## Step 1: Write the print function

Add a new function above `main()`. For example, to add a `greet` subcommand:

```typescript
function printGreet(): void {
  const name = readFlag("--name") ?? "contributor";
  console.log(`Hello, ${name}! Welcome to Open Source Starter Lab.`);
}
```

Use the existing `readFlag()` helper to read named arguments like `--name value`.

## Step 2: Register the command in main()

Inside `main()`, add your new `if` block before the `help` block:

```typescript
if (command === "greet") {
  printGreet();
  return;
}
```

## Step 3: Add it to the help output

Find the `help` block in `main()` and add a usage line for your new command:

```typescript
console.log("  oss-lab greet --name yourname");
```

## Step 4: Write a matching test

Open `src/tests/cli.test.ts` (or the appropriate test file). Add a test that runs your command and checks the output.

Look at how existing commands are tested in the repo as a reference. Keep the test simple — one clear assertion is better than many thin ones.

## Step 5: Run the project check

```bash
npm run check
```

This builds the project, runs all tests, and checks for broken links. All steps must pass before opening a PR.

## Concrete Example From This Repo

The `fit` command (`printIssueFit()`) is a good model to follow. It:
- Reads two optional flags: `--skill` and `--time`
- Falls back to sensible defaults if flags are missing
- Prints structured output line by line
- Has a `--help` / `-h` flag of its own

You can use it as a template when adding your own subcommand.
