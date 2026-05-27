# Contributor Passport

The Open Source Trust Passport is a public proof record for contributors who get reviewed work merged in this repo.

It is built for two people:

- beginners who want visible proof that they shipped a real open-source contribution
- maintainers who want a quick signal that a contributor can follow scope, checks, and review

## What A Passport Shows

Each passport can show:

- GitHub username
- first merged PR
- contribution skill, such as docs, testing, CLI, website, or Git workflow
- linked issue
- proof that the work was merged through review
- suggested next issue or second PR path

Passport files live in:

```text
contributors/passports/
```

## How It Works

After a human contributor's PR is merged, the after-merge automation:

1. adds the contributor to the First Merge Wall
2. creates or updates their passport file
3. comments on the PR with thanks and next-step suggestions
4. closes linked managed issues when appropriate

## Trust Levels

| Level | Name | Meaning |
| --- | --- | --- |
| 1 | First PR Contributor | Got one focused PR merged |
| 2 | Returning Contributor | Came back for a second useful PR |
| 3 | Trust Builder | Helped another beginner, improved an issue, or answered a discussion |
| 4 | Maintainer Practice | Helped with triage, review, labels, or repo workflow |

Levels 1, 2, and 3 are updated automatically by the after-merge workflow:

- Level 1 appears after the first reviewed merge.
- Level 2 appears after a second useful merged PR.
- Level 3 appears after three merged PRs, or after a returning contribution that clearly helps the community, discussions, issue quality, passports, mentoring, or triage.

Level 4 is intentionally manual for now because maintainer practice needs human judgment.

## Contributor Share Line

After merge, contributors can say:

```text
I earned my Open Source Trust Passport by getting a real PR merged in Open Source Starter Lab.
```

## Join The First Cohort

If you want your first passport, comment here with your skill and available time:

https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/discussions/61

## Maintainer Rule

Do not use passports as fake badges. A passport should represent a real merged contribution with visible proof.
