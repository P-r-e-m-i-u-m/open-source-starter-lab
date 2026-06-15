# Bug Reproduction Guide

Before opening a bug fix PR, make sure you can reproduce the problem yourself. Reproducing the issue helps reviewers understand the bug and makes it easier to verify that the fix works.

## Describe the problem

Include:

* What actually happened
* What you expected to happen
* Any error messages you saw

Example:

**Actual behavior**

The application crashes when clicking the Save button.

**Expected behavior**

The data should be saved and a success message should appear.

## Reproduction Template

Copy and fill out the following template:

### Environment

* Operating System:
* Node.js version:
* Project version:

### Steps to Reproduce

1. Run:

   ```bash
   npm install
   npm start
   ```

2. Open the application.

3. Navigate to ...

4. Click ...

5. Observe ...

### Actual Result

Describe what happened.

### Expected Result

Describe what should happen.

## Include Useful Command Output

When relevant, include:

```bash
npm run check
npm test
node --version
```

Paste the output directly into the issue or PR description.

## Screenshots

Screenshots are optional.

Include them only when they make the problem easier to understand, such as:

* Visual bugs
* Layout issues
* Incorrect UI states

For non-visual bugs, reproduction steps and command output are usually more helpful.

## Before Opening a Bug Fix PR

* Confirm you can reproduce the issue.
* Document the reproduction steps.
* Verify your fix resolves the issue.
* Run project checks before submitting.


