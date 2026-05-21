# Finding Beginner-Friendly Issues

GitHub issue filters help contributors quickly find tasks that are open, beginner-friendly, and available to work on.

## Useful Filters

### Good First Issues

```text
is:open label:"good first issue"
```

Shows beginner-friendly issues that are currently open.

---

### Help Wanted Issues

```text
is:open label:"help wanted"
```

Shows issues where maintainers are actively looking for contributors.

---

### CLI Issues

```text
is:open label:"cli"
```

Shows command-line related issues.

---

### Unassigned Issues

```text
is:open no:assignee
```

Shows open issues that are not assigned to anyone yet.

---

## Combining Filters

You can combine filters to find more specific issues.

### Beginner-friendly and unassigned

```text
is:open label:"good first issue" no:assignee
```

### Help wanted and unassigned

```text
is:open label:"help wanted" no:assignee
```

### CLI and unassigned

```text
is:open label:"cli" no:assignee
```

---

## Tips

- Always read the issue carefully before commenting.
- Check whether someone is already assigned.
- Ask questions politely if the task is unclear.
- Start with small documentation or beginner-friendly issues first.
