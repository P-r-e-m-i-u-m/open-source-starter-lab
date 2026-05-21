# Contributor Queue

The Contributor Queue is the maintainer dashboard for this repo.

It answers four questions:

- Who needs a maintainer reply?
- Who has been assigned and is waiting to open a PR?
- Which PRs need review?
- Which good first issues are still ready to claim?

## Live Queue

The live queue is maintained in one GitHub issue:

https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/issues?q=is%3Aissue+is%3Aopen+label%3A%22contributor+queue%22

## How It Updates

The queue refreshes automatically when:

- an issue is opened or edited
- someone comments on an issue
- an issue is assigned or unassigned
- a pull request opens, changes, closes, or becomes ready for review
- the scheduled workflow runs every six hours

## Maintainer Reply Style

When someone asks to work on an issue, reply like this:

```md
Done @username.

Start with:
`npm run check`

Keep the PR small. Change one thing, then add the command output in your PR.

After this, introduce yourself in the weekly thread so I can suggest your next task:
https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/discussions/44
```

Short is fine. Specific is better.
