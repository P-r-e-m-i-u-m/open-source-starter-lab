# PR Description Guide

Thank you for contributing!

A clear pull request description helps maintainers understand your change, review it more quickly, and provide useful feedback. You do not need to write a long description, but a little context goes a long way.

## What Makes a Helpful PR Description?

Try to include:

* What changed
* Why the change was made
* How you tested it
* Any related issue numbers

## Example: Not Helpful

### Summary
Fixed some documentation.

### Testing
Tested it.

## Example: Helpful

### Summary
Adds a guide explaining how contributors can write useful pull request descriptions.

### Why
New contributors often open pull requests with very little context, which makes reviews slower and more difficult.

### Testing

* Ran `npm run check`
* Verified documentation links work correctly
* Confirmed no existing files were affected

### Related Issue

Closes #123

## Testing Evidence

Whenever possible, include evidence showing that your change works.

Examples:

* Output from `npm run check`
* Screenshots of UI changes
* Test results
* Manual verification steps

Even a short note about what you tested is helpful for reviewers.

## Linking Issues

If your pull request resolves an issue, link it using:

```text
Closes #issue-number
```

For example:

```text
Closes #44
```

GitHub will automatically link the issue and close it when the pull request is merged.

## Final Tip

A good pull request description does not need to be long. A few sentences explaining the change, the reason behind it, and how it was tested are usually enough.

Thank you for helping improve the project!
