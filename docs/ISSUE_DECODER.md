# First Issue Decoder

Most beginners do not get stuck because they are lazy. They get stuck because an issue says what to change, but not how to begin.

Use this decoder before starting a `good first issue`.

## Decode The Issue

Copy the issue into this shape:

| Question | Answer |
| --- | --- |
| What does the issue mean? | Rewrite the task in one plain sentence. |
| Skill needed | Docs, Git, CLI, JavaScript, TypeScript, testing, or beginner research. |
| Time estimate | 15 min, 30 min, or 1 hour. |
| First file to open | The first file or folder to inspect. |
| First command to run | Usually `npm run check`. |
| What not to change | Anything outside the issue scope. |
| PR proof | The command output or screenshot that proves the change works. |

If you cannot fill in the table, ask before coding.

## Example

Issue: Add a short Windows Git setup guide.

| Question | Answer |
| --- | --- |
| What does the issue mean? | Add one docs page that helps Windows users install Git and verify it works. |
| Skill needed | Docs, Git |
| Time estimate | 30 min |
| First file to open | `docs/` |
| First command to run | `npm run check` |
| What not to change | Do not edit CLI code or package files. |
| PR proof | `npm run check` passes and the new guide links to the first PR guide. |

## Ask For Help

Comment like this if you are stuck:

```md
I want to work on this, but I need help decoding it.

I understand:

I do not understand:

The first file I opened:

The command I ran:
```

## Maintainer Promise

Beginner issues in this repo should be small, specific, and reviewable. If an issue feels too broad, ask for a smaller version.
