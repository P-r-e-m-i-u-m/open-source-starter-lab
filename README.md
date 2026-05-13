# Open Source Starter Lab

> A friendly practice repo for learning Git, GitHub, issues, pull requests, reviews, CI, and maintainer communication.

[![CI](https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/actions/workflows/ci.yml/badge.svg)](https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/actions/workflows/ci.yml)
[![Good First Issues](https://img.shields.io/github/issues/P-r-e-m-i-u-m/open-source-starter-lab/good%20first%20issue?label=good%20first%20issues)](https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)
[![License: MIT](https://img.shields.io/badge/license-MIT-0f172a.svg)](LICENSE)

Most beginner repos say "make your first PR" and stop there. This lab gives contributors small tasks, clear acceptance criteria, copy-paste commands, and a safe place to ask questions.

## What You Can Do Here

- Open your first issue.
- Make your first pull request.
- Improve docs, examples, and beginner guides.
- Practice Git commands in a real workflow.
- Ask questions in Discussions.
- Help another beginner with a clear answer.
- Learn how maintainers label, review, and verify work.

## Quick Start

```bash
git clone https://github.com/P-r-e-m-i-u-m/open-source-starter-lab.git
cd open-source-starter-lab
npm install
npm run check
```

Try the CLI:

```bash
npm run build
node dist/src/cli.js check --profile beginner
node dist/src/cli.js issues
```

## Best First Contributions

Start with one of these:

- Add a short docs page in `docs/`.
- Improve one command example.
- Add a common Git/GitHub error and its fix.
- Add your contributor card in `contributors/`.
- Answer a beginner question in Discussions.
- Learn how to fix a rejected push: [GIT_PUSH_REJECTED.md](docs/GIT_PUSH_REJECTED.md)

Good first issues are listed here:
[good first issue](https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)

## Project Structure

```text
.
├── src/                  TypeScript CLI source
├── tests/                Smoke tests
├── docs/                 Beginner guides and maintainer playbooks
├── examples/             Copy-paste examples
├── contributors/         Contributor cards
└── .github/              CI, templates, and community files
```

## For Contributors

Read [CONTRIBUTING.md](CONTRIBUTING.md), pick one small issue, and comment before starting if you want it assigned.

A good pull request includes:

- What changed
- Why it helps
- How you tested it
- Screenshots or command output when useful

## For Maintainers

This repo is also a maintainer practice lab. Use it to learn:

- How to write useful issues
- How to review without discouraging beginners
- How to answer Discussions clearly
- How to keep project checks simple and visible

See [docs/MAINTAINER_PLAYBOOK.md](docs/MAINTAINER_PLAYBOOK.md).

## Launch Kit

Want to invite contributors? Use the copy-ready messages in
[docs/COMMUNITY_LAUNCH_KIT.md](docs/COMMUNITY_LAUNCH_KIT.md).

## Daily Issue Bot

This repo includes a transparent automation that creates one beginner-friendly starter issue per day from a curated backlog.

Read the bot docs: [docs/DAILY_ISSUE_BOT.md](docs/DAILY_ISSUE_BOT.md).

## Community Standard

Be clear, kind, and useful. Short answers are fine when they solve the problem, but the best answers teach the next person too.

## License

MIT
