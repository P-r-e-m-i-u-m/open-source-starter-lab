# Recipe: Adding a New CLI Subcommand

This recipe walks through adding a new subcommand to `src/cli.ts` — the same way `profiles`, `fit`, and `next` were added. By the end you will have a working command and a basic test for it.

## How the CLI works

The entry point is `src/cli.ts`. It reads the command name from `process.argv[2]` and routes it to a `printXxx()` function:

```typescript
function main(): void {
  const command = process.argv[2] ?? "check";

  if (command === "check") {
    printChecklist(...);
    return;
  }

  if (command === "profiles") {
    printProfiles();
    return;
  }

  // ...more commands...

  throw new Error(`Unknown command: ${command}`);
}
```

Every command follows the same three-step pattern:
1. Write a `printXxx()` function that does the work
2. Add an `if` block in `main()` to route the command
3. Add a usage line to the `help` command

## Step 1 — Write the print function

Say you want to add a `greet` command that prints a welcome message. Add a new function above `main()`:

```typescript
function printGreet(): void {
  const name = readFlag("--name") ?? "contributor";
  console.log(`Hello, ${name}! Welcome to Open Source Starter Lab.`);
}
```

`readFlag()` is already defined at the top of `cli.ts` — it reads a named argument from `process.argv`:

```typescript
function readFlag(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}
```

So `node dist/src/cli.js greet --name Prem` would print:
```
Hello, Prem! Welcome to Open Source Starter Lab.
```

## Step 2 — Route the command in `main()`

Add an `if` block inside `main()`, before the final `throw`:

```typescript
if (command === "greet") {
  printGreet();
  return;
}
```

Make sure it goes **before** the `throw new Error(\`Unknown command: ${command}\`)` line, or the command will always fail.

## Step 3 — Add it to the `help` output

Inside the `help` block, add a usage line so contributors can discover the command:

```typescript
if (command === "help" || command === "--help" || command === "-h") {
  console.log("Usage:");
  console.log("  oss-lab check --profile beginner");
  console.log("  oss-lab greet --name <your-name>"); // add this
  // ...rest of help output
}
```

## Step 4 — Build and test manually

```bash
npm run build
node dist/src/cli.js greet --name Prem
```

You should see:
```
Hello, Prem! Welcome to Open Source Starter Lab.
```

Also confirm the existing commands still work:
```bash
node dist/src/cli.js help
node dist/src/cli.js profiles
```

## Step 5 — Add a test

Open `tests/smoke.test.ts` and add assertions for your new command. Use the same pattern as the existing tests — `execFileSync` runs the CLI as a child process:

```typescript
const greetOutput = execFileSync("node", [cliPath, "greet", "--name", "Prem"], {
  encoding: "utf8"
});

assert.ok(greetOutput.includes("Hello, Prem!"), "Expected greeting output");
assert.ok(greetOutput.includes("Open Source Starter Lab"), "Expected repo name in output");
```

## Step 6 — Run the full check

```bash
npm run check
```

All tests must pass before you open a PR.

## Real example from this repo

The `profiles` command in `src/cli.ts` is one of the smallest real commands and follows this exact pattern:

```typescript
function printProfiles(): void {
  console.log("Available checklist profiles:");
  for (const profile of PROFILE_DESCRIPTIONS) {
    console.log(`- ${profile.id}: ${profile.description}`);
  }
}
```

Routed in `main()` as:

```typescript
if (command === "profiles") {
  printProfiles();
  return;
}
```

That is all it takes. Keep new commands small and focused — one command should do one thing.

## Checklist before opening your PR

- [ ] New `printXxx()` function added above `main()`
- [ ] `if` block added in `main()` before the final `throw`
- [ ] Usage line added to the `help` command
- [ ] `npm run build` succeeds
- [ ] Manual test with `node dist/src/cli.js <command>` works
- [ ] Assertion added to `tests/smoke.test.ts`
- [ ] `npm run check` passes
