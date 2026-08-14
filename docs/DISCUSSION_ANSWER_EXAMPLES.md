# Discussion Answer Examples

Good Discussion answers help a contributor take a safe next step without
assuming details that have not been shared. Use these examples as a model.

## Example 1: Git clone error

### Weak answer

Run `git clone` again.

### Strong answer

Could you share the complete error message and confirm whether the repository
is public or private?

If it is private, make sure that you are signed in to GitHub and have access
to the repository. Then, from the folder where you want the project to be
created, run:

```bash
git clone <repository-url>
```

Replace `<repository-url>` with the repository's HTTPS or SSH URL. If the
command still fails, paste the full output (removing any tokens or passwords)
so the community can help diagnose it.

Why this is better:

- Asks for the information needed to diagnose the problem.
- Uses a command with a clear placeholder instead of an incomplete command.
- Explains what to share next and protects sensitive credentials.

## Example 2: Build failure

### Weak answer

Your setup is wrong.

### Strong answer

Which operating system and Node.js version are you using? Please also share
the command output, including the first error message.

From the repository root, try:

```bash
npm run check
```

If it fails, include the complete error output and mention any setup steps you
changed. That gives others enough context to identify the environment or root
cause without guessing.

Why this is better:

- Avoids blaming the contributor or assuming the cause.
- Requests useful, reproducible details.
- Gives one safe verification command and explains why the output matters.

## Example 3: First contribution question

### Weak answer

Just pick any issue.

### Strong answer

If you are new to the project, start with an issue labeled `good first issue`
or `help wanted`. Before making changes, read the contribution guide and leave
a short comment on the issue to say that you would like to work on it.

If the issue does not say which file to edit or how to verify the change, ask
a clarifying question before starting. For example: “Which file should I
update, and which command should I run to verify the change?”

Why this is better:

- Gives actionable guidance for choosing an issue.
- Encourages communication with maintainers.
- Shows when a clarifying question is the right next step.

## Quick checklist

Before posting a Discussion answer, check that it:

- states any important assumption;
- asks a clarifying question when the report is incomplete;
- gives commands in fenced code blocks, with placeholders where needed;
- avoids requesting passwords, access tokens, or other secrets; and
- tells the reader what information to share if the suggested step fails.
