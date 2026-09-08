# Recipe: Writing a Good Test Fixture

A test fixture is small, predictable data created specifically for a test. Good fixtures let you test your application logic without depending on a live service, network connection, database, or changing external data.

The goal is to give the code under test exactly the input it needs and keep the test fast and repeatable.

## Why avoid live network calls?

Tests that call a real API can fail for reasons unrelated to your code:

- The network may be unavailable.
- The external service may be temporarily down.
- API responses can change.
- Rate limits or authentication can affect the test.
- Tests become slower and harder to run locally.

Instead, create a small in-memory fixture that represents the data your code expects.

## A practical example from this repository

The smoke tests for daily issue selection need existing GitHub issues. The test does not call GitHub to retrieve them. Instead, `tests/smoke.test.ts` creates an `asOpenIssues()` helper:

```ts
function asOpenIssues(titles: string[]): ExistingIssue[] {
  return titles.map((title, index) => ({
    title,
    html_url: `https://github.com/example/repo/issues/${index + 1}`
  }));
}
