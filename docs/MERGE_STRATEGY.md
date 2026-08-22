# Understanding Squash Merge: Why Your Messy Commits Don't Matter

If you are new to open source, you might worry that making lots of small commits (like "fix typo", "oops", or "try again") will clutter the project's history. **Don't worry—they don't matter at all!**

## What is a Squash Merge?

When a maintainer merges your Pull Request, they have a few options. This repository uses a **Squash and Merge** strategy. 

Instead of adding all 10 or 20 of your individual commit messages into the main project history, GitHub automatically "squashes" them into **one single, clean commit** when merging into the `main` branch.

## Why Messy Commits are Totally Fine During Development

* **Trial and Error is Normal:** Experienced developers make plenty of typos and syntax errors while building features. Making frequent commits locally helps you save your progress and roll back if something breaks.
* **No Pressure:** You do not need to worry about writing a perfect commit message for every single change you make on your local branch.

## Why a Clean `main` Branch History Matters

By squashing all contributions down to one commit per Pull Request:
* The project's `git log` remains clean, readable, and linear.
* If a bug is ever introduced, it is much easier to track down the exact Pull Request responsible for it.
* Release notes and changelogs are easy to read and understand.

Write freely, commit often locally, and let the squash merge handle the cleanup!