# Asking Better GitHub Questions

Good questions help contributors and maintainers solve problems faster.

You do not need to know everything before asking. The goal is simply to provide enough information for others to help effectively.

---

## Include These Details

When asking a question, try to include:

- **The command you ran**: The exact terminal command or action performed.
- **What happened**: The actual result, error message, or log output.
- **What you expected to happen**: The intended outcome.
- **Environment details**: Operating system (Windows, macOS, Linux), Node version, or browser.

---

## Example

Instead of:

> *"Git is broken."*

Try:

> **I ran:**
> ```bash
> git push origin main
> ```
> **What happened:**
> ```text
> Updates were rejected because the remote contains work that you do not have locally.
> ```
> **What I expected:**
> My changes would be pushed to GitHub.
>
> **Operating system:**
> Windows 11

---

## When To Include Screenshots

Screenshots are helpful when:

- Showing visual or UI layout bugs.
- Explaining specific GitHub web interface settings.

> **Tip:** If the error is in your terminal or log file, copy and paste the raw text inside a code block instead of taking a screenshot. Text is searchable and easier to read.

---

## Copy-Paste Question Template

```markdown
### What I am trying to do
<!-- Briefly describe your goal -->

### Command I ran
```bash
[Paste command here]
```

### What happened
```text
[Paste the error message or output here]
```

### What I expected
<!-- Describe the expected result -->

### Environment
- OS: <!-- Windows / macOS / Linux -->
- Additional info:
```

---

## Final Checklist

Before posting your question, make sure you checked:

- [ ] Included the exact command that was run.
- [ ] Explained what happened and included error logs.
- [ ] Stated what was expected.
- [ ] Kept screenshots only for visual issues.

Remember: asking questions is part of learning. Clear questions help everyone work together smoothly!