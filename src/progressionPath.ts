export type ContributorLevel =
  | "first-pr"
  | "second-pr"
  | "trust-builder"
  | "maintainer-shadow"
  | "bigger-task";

export interface ProgressionStep {
  level: ContributorLevel;
  title: string;
  goal: string;
  goodTasks: string[];
  labels: string[];
  firstCommand: string;
  proof: string[];
  nextMove: string;
}

const progressionSteps: ProgressionStep[] = [
  {
    level: "first-pr",
    title: "First PR",
    goal: "Make one safe contribution and learn the full GitHub workflow.",
    goodTasks: [
      "Fix unclear wording in one guide",
      "Add one missing link",
      "Improve one command example",
      "Add a contributor card"
    ],
    labels: ["level: first-pr", "good first issue", "beginner friendly", "docs only"],
    firstCommand: "npm run check",
    proof: [
      "Show what changed",
      "Explain why it helps a beginner",
      "Paste the check command result"
    ],
    nextMove: "After merge, ask for a second PR task that touches a small test, CLI output, or guide structure."
  },
  {
    level: "second-pr",
    title: "Second PR",
    goal: "Move from tiny docs edits into a slightly more useful repo improvement.",
    goodTasks: [
      "Improve one CLI output message",
      "Add one small docs example",
      "Add one smoke test assertion",
      "Clarify one issue acceptance checklist"
    ],
    labels: ["level: second-pr", "cli", "testing", "documentation"],
    firstCommand: "node dist/src/cli.js fit --skill docs --time 30m",
    proof: [
      "Name the exact file changed",
      "Include the before/after behavior or wording",
      "Run the full project check"
    ],
    nextMove: "Pick a trust builder task so maintainers can see you understand the project workflow."
  },
  {
    level: "trust-builder",
    title: "Trust Builder",
    goal: "Show that you can help the project without only changing code.",
    goodTasks: [
      "Answer one beginner Discussion with clear steps",
      "Improve one issue so the next contributor can finish it",
      "Add a missing proof checklist to a task",
      "Suggest a smaller scope on an unclear idea"
    ],
    labels: ["level: trust-builder", "community", "help wanted"],
    firstCommand: "gh issue list --label \"good first issue\" --limit 10",
    proof: [
      "Link the issue, PR, or Discussion helped",
      "Explain what confusion was removed",
      "Keep the reply kind and specific"
    ],
    nextMove: "Ask for a maintainer shadow task when you have helped at least one contributor or issue."
  },
  {
    level: "maintainer-shadow",
    title: "Maintainer Shadow",
    goal: "Practice maintainer work with a small, reviewable action.",
    goodTasks: [
      "Triage one issue with the right labels",
      "Rewrite one vague issue into clear acceptance criteria",
      "Check one PR description for proof",
      "Draft a review comment that is specific and kind"
    ],
    labels: ["level: maintainer-practice", "triage", "community"],
    firstCommand: "node dist/src/cli.js check --profile maintainer",
    proof: [
      "Describe the maintainer problem",
      "Show the before/after issue or comment",
      "Explain why the next contributor has a clearer path"
    ],
    nextMove: "Move to a bigger task only after the project has seen you communicate clearly."
  },
  {
    level: "bigger-task",
    title: "Ready For Bigger Task",
    goal: "Take a larger task without getting stuck or waiting silently.",
    goodTasks: [
      "Split one bigger idea into two or three small PRs",
      "Add a focused CLI feature with tests",
      "Improve contributor automation safely",
      "Write a design note before changing shared behavior"
    ],
    labels: ["ready for bigger task", "developer tooling", "testing"],
    firstCommand: "git checkout -b feature/focused-task",
    proof: [
      "Post a short plan before coding",
      "Keep the PR focused",
      "Include tests, command output, and any tradeoffs"
    ],
    nextMove: "Become a returning contributor by helping review or guide another beginner after your larger PR."
  }
];

export function getProgressionStep(level: ContributorLevel): ProgressionStep {
  const step = progressionSteps.find((candidate) => candidate.level === level);
  if (!step) {
    throw new Error(`Unknown contributor level: ${level}`);
  }

  return step;
}

export function listProgressionSteps(): ProgressionStep[] {
  return [...progressionSteps];
}

export function normalizeContributorLevel(level: string): ContributorLevel {
  const normalized = level.toLowerCase().trim();
  const aliases: Record<string, ContributorLevel> = {
    "first": "first-pr",
    "first-pr": "first-pr",
    "first pr": "first-pr",
    "second": "second-pr",
    "second-pr": "second-pr",
    "second pr": "second-pr",
    "trust": "trust-builder",
    "trust-builder": "trust-builder",
    "trust builder": "trust-builder",
    "shadow": "maintainer-shadow",
    "maintainer-shadow": "maintainer-shadow",
    "maintainer shadow": "maintainer-shadow",
    "bigger": "bigger-task",
    "bigger-task": "bigger-task",
    "bigger task": "bigger-task"
  };

  const match = aliases[normalized];
  if (!match) {
    throw new Error(
      "Use --level first-pr, second-pr, trust-builder, maintainer-shadow, or bigger-task"
    );
  }

  return match;
}
