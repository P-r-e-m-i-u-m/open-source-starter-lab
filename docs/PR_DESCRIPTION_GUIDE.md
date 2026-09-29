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

## Example: Website Change

Website changes need visual proof because reviewers cannot always load the page themselves.

### Summary
Updated the hero section on the homepage to include a link to the getting started guide.

### Testing

* Loaded the page locally with `npm run site:dev` and confirmed the new link appears
* Ran `npm run site:check-links` to confirm no links are broken
* Attached a screenshot of the updated hero section

### Related Issue

Closes #123

A short screenshot or a note about what you loaded locally is usually enough. If you cannot add a screenshot, describe what you checked and mention `npm run site:check-links` if you ran it.

## Linking Issues

## Final Tip

A good pull request description does not need to be long. A few sentences explaining the change, the reason behind it, and how it was tested are usually enough.

Thank you for helping improve the project!
