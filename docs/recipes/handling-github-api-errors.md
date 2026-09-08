# Recipe: Handling GitHub API Errors Gracefully

Any script in this repo that talks to GitHub (`scripts/createDailyIssue.ts` is the main one) can hit a failed API call — a bad token, a missing repo, a rate limit, whatever. This recipe covers the error responses you're most likely to run into here, and how the repo currently handles (and doesn't handle) them.

## How this repo currently handles errors

The core piece is the `githubRequest` helper in `scripts/createDailyIssue.ts`. Every API call in the script goes through it:

```ts
async function githubRequest<T>(
  path: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${apiBase}${path}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...options.headers
    }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub API failed ${response.status}: ${text}`);
  }

  return (await response.json()) as T;
}
```

This is a "fail fast" strategy: if GitHub returns anything other than a 2xx status, it throws immediately with the status code and the raw response body. At the top level, `main()` catches that and exits with a non-zero code:

```ts
main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
```

That's deliberate for a script like this one — it runs in CI, and a half-finished run (like some labels created but not others) is worse than a clean failure with a clear error message in the logs.

There's one place where the script does distinguish between error types instead of failing on everything: `ensureLabels` specifically checks for a 404 before deciding what to do:

```ts
const response = await fetch(`${apiBase}/repos/${owner}/${repo}/labels/${encodeURIComponent(label)}`, {
  headers: {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28"
  }
});

if (response.status === 404) {
  // label doesn't exist yet — create it
  await githubRequest(`/repos/${owner}/${repo}/labels`, token, { ... });
} else if (!response.ok) {
  // anything else (401, 403, 500, etc.) is a real problem — throw
  const text = await response.text();
  throw new Error(`Could not inspect label ${label}: ${text}`);
}
```

Here, a 404 isn't an error at all — it's expected and meaningful ("this label doesn't exist yet"). Every other non-2xx status is still treated as a hard failure. That's the pattern to follow if you're adding new API calls: only special-case a status code when it changes what the script should *do*, not just to swallow the error.

## Common error responses you'll actually see

- **401 Unauthorized** — the token is missing, expired, or malformed. In this repo that usually means `GITHUB_TOKEN` wasn't set correctly in the environment.
- **403 Forbidden** — two very different causes look the same at this status code:
  - The token doesn't have permission for the action (e.g. missing `issues: write` scope).
  - You've hit a **rate limit**. Check the response headers `X-RateLimit-Remaining` and `X-RateLimit-Reset` to tell them apart — a permissions problem won't have `X-RateLimit-Remaining: 0`.
- **404 Not Found** — either the resource genuinely doesn't exist (like a label, handled above) or, confusingly, GitHub also returns 404 for some resources the token doesn't have access to at all, instead of a 403. Don't assume 404 always means "safe to create."
- **422 Unprocessable Entity** — the request was authenticated and reached the right endpoint, but the payload was invalid (e.g. creating a label with a name that's too long, or duplicate content). The response body usually explains exactly which field failed — `githubRequest`'s `text` capture is what surfaces that to you in the console.
- **5xx errors** — GitHub's own outage or hiccup. These are usually worth retrying after a short delay rather than failing immediately, though the current script doesn't implement retries.

## If you need to add retry-safe handling

The current script doesn't retry anything — a transient 500 kills the whole run. If you're extending `githubRequest` or writing a new script that needs to survive a flaky GitHub API, a practical approach is to only retry on 5xx and 403-with-rate-limit-headers, and never retry on 401/403 permission errors or 422 validation errors, since retrying those just wastes time on something that won't fix itself:

```ts
if (response.status >= 500 || (response.status === 403 && response.headers.get("x-ratelimit-remaining") === "0")) {
  // safe to retry after a delay
} else if (!response.ok) {
  // permission or validation problem — don't retry, fail with the real reason
  throw new Error(`GitHub API failed ${response.status}: ${await response.text()}`);
}
```

## Common mistakes

- **Swallowing errors silently.** Catching an error and just logging it without re-throwing or exiting hides real failures from CI — the daily issue bot could silently create zero issues and no one would notice.
- **Treating every non-2xx status the same way.** As shown in `ensureLabels`, a 404 can mean "does not exist yet" rather than "something is broken" — check the context before deciding an error is fatal.
- **Not capturing the response body.** The status code alone (like `403`) often isn't enough to debug the problem. `githubRequest`'s `await response.text()` on failure is what makes the actual GitHub error message visible in the logs.
- **Assuming rate limits only happen under heavy use.** GitHub's API rate limits are lower than people expect, especially for unauthenticated or narrowly-scoped tokens — it's worth checking rate limit headers even on a script that "shouldn't" be making many calls.
