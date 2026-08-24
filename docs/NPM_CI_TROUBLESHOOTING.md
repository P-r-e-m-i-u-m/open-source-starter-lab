# Fixing `npm ci` Lockfile Errors

## Why CI uses `npm ci` and not `npm install`

`npm install` treats `package-lock.json` as a starting point: if the lockfile does not match `package.json`, it quietly updates the lockfile and installs whatever it decided was correct. `npm ci` treats the lockfile as the source of truth: it deletes `node_modules`, installs the exact versions recorded in the lockfile, and fails immediately if the lockfile and `package.json` disagree. That strictness is the point — CI must install the same dependency tree every run, so a build that passes today passes tomorrow. A failing `npm ci` in CI usually means the lockfile is out of date, not that your change is broken.

## The error

```text
npm error `npm ci` can only install packages when your package.json and
npm error package-lock.json are in sync.
```

## The one-line fix

Regenerate the lockfile from `package.json`:

```bash
rm -rf node_modules package-lock.json && npm install
```

On Windows PowerShell:

```powershell
Remove-Item -Recurse -Force node_modules, package-lock.json; npm install
```

Then run `npm ci` again to confirm it passes, and commit the updated `package-lock.json` with your change.

## Check your Node version first

A different Node version can produce a different lockfile, so check that before regenerating anything:

```bash
node -v
```

Compare it with:

- the `engines` field in `package.json`, if the project declares one
- the `node-version` used by CI in [.github/workflows/ci.yml](../.github/workflows/ci.yml)

If they do not match, switch Node versions (`nvm use 24`) and try `npm ci` again before committing a new lockfile.

## Before you open the pull request

- Commit `package-lock.json` if it changed. Do not commit `node_modules`.
- Only include the lockfile if your change actually needed it. An unrelated lockfile churn makes the PR harder to review.
- Run `npm run check` once more so the build, tests, and link check all pass.
