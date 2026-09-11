# Adding a New CLI Subcommand

This is the path for adding a command to the `oss-lab` CLI without introducing a new argument-parsing dependency.

## Start with the check

From the repository root, run:

```bash
npm run check
```

This gives you a clean baseline before you change the CLI.

## Find the dispatcher

The command entry point is [`src/cli.ts`](../../src/cli.ts). `main()` takes the command from `process.argv[2]`, then selects a handler with an `if` block:

```ts
const command = process.argv[2] ?? "check";

if (command === "fit") {
  printIssueFit();
  return;
}
```

Add the new command there and keep the command's output in a small handler, as the existing `printIssueFit()` and `printNextStep()` functions do.

## Parse flags the existing way

`src/cli.ts` already has a small helper for flags:

```ts
function readFlag(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}
```

Use it for value flags and provide a default when the command has one. The `fit` command is the concrete example:

```ts
const skill = readFlag("--skill") ?? "docs";
const timeBudget = readFlag("--time") ?? "30m";
const fit = findIssueFit(skill, timeBudget);
```

For a boolean flag, check whether it is present. `issues` uses this pattern for `--json`:

```ts
if (process.argv.includes("--json")) {
  // print JSON
}
```

If the command needs help, handle `--help` and `-h` in its handler. `fit` prints its usage, accepted skills (`html-css`, `javascript`, `typescript`, `python`, `docs`, `testing`, and `git`), and accepted time budgets (`15m`, `30m`, and `1h`) there.

Also add the normal invocation to the help branch in `main()`. For `fit`, that entry is:

```text
oss-lab fit --skill docs --time 30m
```

Keep the help text and the actual defaults in sync.

## Add the matching CLI test

CLI behavior is tested in [`tests/smoke.test.ts`](../../tests/smoke.test.ts). The test runs the built entry point with `execFileSync`, then checks the output. The existing `fit` test looks like this:

```ts
const fitOutput = execFileSync("node", [cliPath, "fit", "--skill", "docs", "--time", "30m"], {
  encoding: "utf8"
});

assert.ok(fitOutput.includes("First Issue Fit Finder"), "Expected output to include title");
assert.ok(fitOutput.includes("Best path:"), "Expected output to include best path");
assert.ok(fitOutput.includes("Skill: docs"), "Expected output to show skill");
assert.ok(fitOutput.includes("Time: 30m"), "Expected output to show time budget");
assert.ok(fitOutput.includes("Proof checklist:"), "Expected output to include proof checklist");
```

For a new command, invoke it with the flags a user would actually pass and assert the important parts of its output. If you add help text, add a second invocation with `--help`, as the `fit` test does. If the command has an error path, `tests/cli.test.ts` shows the smaller `spawnSync` pattern used for a failing process.

## Finish with the full check

Run the same check again:

```bash
npm run check
```

That builds `dist`, runs both test files, runs the demo, and checks the site links. Keep the change limited to the command handler, its help text, and the matching test unless the issue calls for more.