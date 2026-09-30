# Weekly Help Thread

The weekly help thread is a recurring GitHub Discussion for new contributors who want help choosing a first issue.

Every Monday, the workflow creates a Q&A Discussion titled:

```md
Get assigned your first issue this week - <week start date>
```

## What Contributors Comment

```md
I know:
I want to practice:
I have time for: 15 min / 30 min / 1 hour
I am stuck on:
```

### Transitioning Discussions to Issues

When a Discussion surfaces a clear problem or feature request that needs action,
a maintainer can turn it into a focused issue.

Copy the useful context from the Discussion:

- **Source link:** Link to the original Discussion.
- **Problem statement:** Summarize the problem, bug, or feature request.
- **Relevant context:** Include important background, environment details, or
  contributor constraints.
- **Desired outcome:** Describe what a successful result looks like.
- **Evidence:** Include useful logs, code snippets, screenshots, or examples.
- **Next step:** List the actions needed to resolve the issue.

#### Turn a Discussion into a ready issue

After collecting the useful Discussion context, shape it into a small,
reviewable issue:

1. **Focused goal:** State one outcome the contributor can complete.
2. **Suggested files:** Point to the file or folder the contributor should
   inspect first. If the exact file is uncertain, name the most relevant area.
3. **Acceptance criteria:** List the specific result the PR must deliver.
4. **Beginner time:** Add a realistic time estimate such as `15 min`, `30 min`,
   or `1 hour`.
5. **Contributor level:** Choose the level that matches the work, such as
   `level: first-pr`, `level: trust-builder`, or `level: second-pr`.
6. **Helpful notes:** Tell the contributor where to start, what to avoid
   changing, and what evidence to include in the PR.

A good ready issue should let a contributor understand the task, find a
reasonable starting point, and know how the maintainer will verify the result
without reading the entire Discussion.

#### Ready issue checklist

Before creating the issue, check that it:

- has a clear problem or requested outcome;
- includes enough context for another contributor to understand it;
- links back to the original Discussion;
- has the `needs triage` label when scope still needs maintainer review; and
- uses relevant skill labels, such as `documentation`, `testing`, or `python`.

Keep the issue focused so a contributor can understand the task and its
acceptance criteria without reading the entire Discussion.


## Maintainer Reply Style

Reply with one focused path:

```md
Thanks for joining. Based on your skill, start with #<issue-number>.

First command:
`npm install`

What your PR should prove:
- <one clear acceptance point>
- <one test or screenshot if useful>

When you open the PR, link it here and I will help review it.
```

Keep replies short, specific, and beginner-safe.

## Why This Exists

People usually do not search for issue numbers. They search for help based on what they know: HTML, JavaScript, Python, docs, testing, or Git.

This thread turns that into a simple weekly doorway for first-time contributors.
