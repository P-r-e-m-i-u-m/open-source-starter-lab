# Recipe: Adding a New Label to the Automation

When the automation creates daily issues, it also ensures that the correct labels exist on GitHub with the right colors and descriptions.

To add a brand new label to the automation, you need to update two objects inside `scripts/createDailyIssue.ts`.

## 1. Add the Label Color

Find the `labelColors` object inside the `ensureLabels` function. Add your new label name and its 6-character hex color (without the `#`).

```typescript
const labelColors: Record<string, string> = {
  // ... existing labels ...
  "my new label": "ff0000",
};
```

## 2. Add the Label Description

Right below that, find the `labelDescriptions` object. Add the exact same label name with a short, clear description explaining when to use it.

```typescript
const labelDescriptions: Record<string, string> = {
  // ... existing descriptions ...
  "my new label": "A short description of what this label means",
};
```

## Concrete Example

For example, the `time: 1 hour` label is already defined in the automation like this:

```typescript
// In labelColors:
"time: 1 hour": "fef2c0",

// In labelDescriptions:
"time: 1 hour": "Focused issue expected to fit in about one hour",
```

If you wanted to add a new label called `design` for UI-related tasks, you would add:

```typescript
// In labelColors:
"design": "ff69b4",

// In labelDescriptions:
"design": "UI and styling tasks",
```

## How It Works

The `ensureLabels` function runs automatically before each issue is created. It checks if the label already exists on GitHub using the API. If the label is missing (HTTP 404), it creates it with the color and description you provided. If the label already exists, it leaves it alone.

This means you only need to edit `scripts/createDailyIssue.ts` — the next time the automation runs, your new label will be created on GitHub automatically.