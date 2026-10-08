(…existing content…)

How to add yourself as a contributor
- Use the contributor card template in contributors/README.md for your public contributor entry.
- Keep cards short and professional and do not include private contact details (phone number, home address, personal email).

## Adding a new test to the test suite

When you add a new test file, creating it under `tests/` is only part of the
process. This repository runs tests through an explicitly listed command in
`package.json`, so a new test file is **not** picked up by `npm test`
automatically — you must register it. Follow this workflow:

1. Add your TypeScript test file under `tests/` (for example
   `tests/myFeature.test.ts`).
2. Run `npm run build` to compile the project (tests compile to `dist/tests/`).
3. Run the compiled test directly to verify it passes on its own:
   ```bash
   node dist/tests/myFeature.test.js
   ```
4. Register the test by adding its compiled command to the `test` script in
   `package.json`, e.g. append `&& node dist/tests/myFeature.test.js` to the
   existing chain. **Why this step is necessary:** the `test` script lists every
   test file explicitly, so `npm test` only executes the tests named there.
   Adding a file under `tests/` alone does not include it in the suite.
5. Run `npm test` to confirm your new test is included in the normal suite.
6. Run `npm run check` before opening the PR to make sure everything (build,
   tests, demo, site link checks) passes.

## Troubleshooting
- If your build fails on `npm ci`, read the [npm ci lockfile guide](docs/NPM_CI_TROUBLESHOOTING.md).
(…existing content…)