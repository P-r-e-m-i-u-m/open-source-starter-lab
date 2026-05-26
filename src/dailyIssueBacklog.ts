export interface DailyIssue {
  title: string;
  labels: string[];
  context: string;
  goal: string;
  suggestedFiles: string[];
  acceptanceCriteria: string[];
  helpfulNotes: string[];
}

export const dailyIssueBacklog: DailyIssue[] = [
  {
    title: "Add a guide for fixing rejected git push errors",
    labels: ["daily starter issue", "documentation", "good first issue", "beginner friendly", "time: 30 min", "level: first-pr"],
    context: "A lot of beginners see `Updates were rejected` and do not know whether to pull, rebase, or start over.",
    goal: "Write a small guide that explains the error and gives a safe recovery path.",
    suggestedFiles: ["docs/GIT_PUSH_REJECTED.md", "README.md"],
    acceptanceCriteria: [
      "Explain why the error happens in beginner-friendly language",
      "Include `git pull --rebase origin main` as one possible fix",
      "Add a short warning about not using destructive reset commands blindly",
      "Link the guide from README"
    ],
    helpfulNotes: [
      "Keep the guide practical, not theoretical.",
      "One command per line is easier for first-time contributors to follow."
    ]
  },
  {
    title: "Add a guide for writing better pull request descriptions",
    labels: ["daily starter issue", "documentation", "good first issue", "community", "time: 30 min", "level: first-pr"],
    context: "New contributors often open PRs with very little context, which makes review harder.",
    goal: "Create a short guide that shows what a helpful PR description looks like.",
    suggestedFiles: ["docs/PR_DESCRIPTION_GUIDE.md", "CONTRIBUTING.md"],
    acceptanceCriteria: [
      "Include a bad example and a better example",
      "Mention testing evidence",
      "Mention linking issues with `Closes #issue-number`",
      "Link the guide from CONTRIBUTING.md"
    ],
    helpfulNotes: ["This should feel like advice from a kind maintainer, not a rulebook."]
  },
  {
    title: "Add examples for choosing a good first issue",
    labels: ["daily starter issue", "documentation", "beginner friendly", "time: 30 min", "level: first-pr"],
    context: "Beginners sometimes pick tasks that are too broad and get stuck.",
    goal: "Add a guide that helps contributors choose a small, finishable first issue.",
    suggestedFiles: ["docs/CHOOSING_FIRST_ISSUE.md", "README.md"],
    acceptanceCriteria: [
      "Explain what makes an issue beginner-friendly",
      "Add examples of good and risky first issues",
      "Mention commenting before starting work",
      "Link the guide from README"
    ],
    helpfulNotes: ["Use concrete examples from this repo where possible."]
  },
  {
    title: "Add a checklist for reviewing documentation PRs",
    labels: ["daily starter issue", "documentation", "help wanted", "time: 30 min", "level: second-pr"],
    context: "Documentation PRs still need review, but the checklist should be simple.",
    goal: "Create a small reviewer checklist for docs changes.",
    suggestedFiles: ["docs/DOCS_REVIEW_CHECKLIST.md"],
    acceptanceCriteria: [
      "Include checks for clarity, links, commands, and formatting",
      "Keep the checklist under 15 items",
      "Include one example review comment",
      "Mention `npm run check` when docs touch repo links or scripts"
    ],
    helpfulNotes: ["The best checklist helps reviewers move faster without sounding cold."]
  },
  {
    title: "Add a beginner guide for Git branches",
    labels: ["daily starter issue", "documentation", "good first issue", "beginner friendly", "time: 30 min", "level: first-pr"],
    context: "Branches are one of the first confusing Git concepts for new contributors.",
    goal: "Explain branches with practical commands and a first-PR workflow.",
    suggestedFiles: ["docs/GIT_BRANCHES.md", "docs/FIRST_PULL_REQUEST.md"],
    acceptanceCriteria: [
      "Explain why branches are useful",
      "Show `git checkout -b branch-name`",
      "Show how to switch branches",
      "Link from the first pull request guide"
    ],
    helpfulNotes: ["Avoid deep Git internals. Keep it workflow-focused."]
  },
  {
    title: "Add a guide for reading GitHub Actions failures",
    labels: ["daily starter issue", "documentation", "help wanted", "beginner friendly", "time: 30 min", "level: first-pr"],
    context: "A red CI check can feel scary when someone opens their first PR.",
    goal: "Write a guide that explains how to open a failed check and find the useful error.",
    suggestedFiles: ["docs/READING_CI_FAILURES.md"],
    acceptanceCriteria: [
      "Explain where to click in a PR",
      "Explain logs in simple language",
      "Add an example TypeScript build failure",
      "Add a short section on asking for help with useful details"
    ],
    helpfulNotes: ["This can be docs-only. No screenshots required."]
  },
  {
    title: "Add a first-time contributor FAQ",
    labels: ["daily starter issue", "documentation", "community", "good first issue", "time: 30 min", "level: first-pr"],
    context: "A FAQ can reduce repeated questions and help contributors feel less lost.",
    goal: "Create a FAQ with practical answers for first-time contributors.",
    suggestedFiles: ["docs/FIRST_TIME_CONTRIBUTOR_FAQ.md", "README.md"],
    acceptanceCriteria: [
      "Add at least 8 questions and answers",
      "Include questions about assignment, tests, reviews, and mistakes",
      "Keep answers short and reassuring",
      "Link the FAQ from README"
    ],
    helpfulNotes: ["Good FAQs sound human. Use direct answers."]
  },
  {
    title: "Add examples for good Discussion answers",
    labels: ["daily starter issue", "documentation", "community", "help wanted", "time: 30 min", "level: trust-builder"],
    context: "Discussions are more useful when answers teach clearly and include assumptions.",
    goal: "Create examples of weak and strong GitHub Discussion answers.",
    suggestedFiles: ["docs/DISCUSSION_ANSWER_EXAMPLES.md", "docs/MAINTAINER_PLAYBOOK.md"],
    acceptanceCriteria: [
      "Include at least three question-and-answer examples",
      "Show how to include commands safely",
      "Mention when to ask a clarifying question",
      "Link from the maintainer playbook"
    ],
    helpfulNotes: ["This supports real community help without encouraging badge farming."]
  },
  {
    title: "Add CLI tests for unknown commands",
    labels: ["daily starter issue", "cli", "good first issue", "testing", "time: 1 hour", "level: second-pr"],
    context: "The CLI throws an error for unknown commands, but the behavior should be covered by a small test so future changes do not break it.",
    goal: "Add a focused test that proves unknown CLI commands fail with a useful message.",
    suggestedFiles: ["tests/cli.test.ts", "package.json", "docs/CLI.md"],
    acceptanceCriteria: [
      "Add a test that runs the CLI with an unknown command",
      "Assert the command exits unsuccessfully",
      "Assert the output includes `Unknown command`",
      "Keep the test small and easy to read"
    ],
    helpfulNotes: [
      "Use Node's built-in test helpers or a simple child process assertion.",
      "This is a good first code contribution because the behavior already exists."
    ]
  },
  {
    title: "Add a `--json` output option for starter issue ideas",
    labels: ["daily starter issue", "cli", "help wanted", "developer tooling", "time: 1 hour", "level: second-pr"],
    context: "The `issues` command prints human-readable text, but automation examples are easier when the CLI can also return JSON.",
    goal: "Add a `node dist/src/cli.js issues --json` mode that prints starter issue ideas as JSON.",
    suggestedFiles: ["src/cli.ts", "tests/smoke.test.ts", "docs/CLI.md"],
    acceptanceCriteria: [
      "Support `issues --json` without changing the default text output",
      "Return title, label, difficulty, goal, and acceptance criteria",
      "Add or update a test for the JSON output",
      "Document the new option in `docs/CLI.md`"
    ],
    helpfulNotes: [
      "Keep the output stable and machine-readable.",
      "Do not add a new dependency for this."
    ]
  },
  {
    title: "Add a command that lists available contributor profiles",
    labels: ["daily starter issue", "cli", "good first issue", "developer tooling", "time: 1 hour", "level: second-pr"],
    context: "The CLI supports beginner and maintainer profiles, but users only discover that by reading help text.",
    goal: "Add a small `profiles` command that lists supported checklist profiles.",
    suggestedFiles: ["src/cli.ts", "docs/CLI.md", "tests/smoke.test.ts"],
    acceptanceCriteria: [
      "Add `node dist/src/cli.js profiles`",
      "Print `beginner` and `maintainer`",
      "Include one sentence explaining when to use each profile",
      "Add a smoke test or assertion for the command"
    ],
    helpfulNotes: ["This is intentionally small so a new contributor can finish it in one PR."]
  },
  {
    title: "Improve daily issue bot label coverage",
    labels: ["daily starter issue", "developer tooling", "help wanted", "time: 30 min", "level: maintainer-practice"],
    context: "The daily issue bot creates labels when needed, but newer backlog labels should also get clear colors and descriptions.",
    goal: "Improve the label map used by the daily issue bot so generated issues look consistent.",
    suggestedFiles: ["scripts/createDailyIssue.ts", "docs/DAILY_ISSUE_BOT.md"],
    acceptanceCriteria: [
      "Add colors for `testing` and `developer tooling`",
      "Add descriptions for generated labels where useful",
      "Keep existing labels unchanged",
      "Run `npm run issue:daily` to verify the dry-run still works"
    ],
    helpfulNotes: ["This is a maintainer-quality task because it improves automation hygiene."]
  },
  {
    title: "Add a guide for reproducing a bug before opening a PR",
    labels: ["daily starter issue", "documentation", "good first issue", "testing", "time: 30 min", "level: second-pr"],
    context: "New contributors often jump into a fix before they can reproduce the problem, which makes reviews harder.",
    goal: "Create a short guide for writing reproduction steps and expected behavior.",
    suggestedFiles: ["docs/BUG_REPRODUCTION_GUIDE.md", "CONTRIBUTING.md"],
    acceptanceCriteria: [
      "Explain actual behavior vs expected behavior",
      "Show a copy-paste reproduction template",
      "Mention command output and screenshots when useful",
      "Link the guide from `CONTRIBUTING.md`"
    ],
    helpfulNotes: ["This helps contributors sound professional in issues and PRs."]
  },
  {
    title: "Add issue filtering examples for contributors",
    labels: ["daily starter issue", "documentation", "community", "good first issue", "time: 15 min", "level: first-pr"],
    context: "GitHub issue filters are powerful, but beginners may not know how to find open tasks by label or difficulty.",
    goal: "Add examples for filtering issues by label, state, and assignment status.",
    suggestedFiles: ["docs/FINDING_ISSUES.md", "README.md"],
    acceptanceCriteria: [
      "Show filters for `good first issue`, `help wanted`, and `cli`",
      "Explain `is:open` and `no:assignee`",
      "Include direct links to useful repo searches",
      "Keep the guide practical and short"
    ],
    helpfulNotes: ["This can make the repo easier for visitors to enter without asking first."]
  },
  {
    title: "Add a guide for creating useful issue titles",
    labels: ["daily starter issue", "documentation", "good first issue"],
    context: "Clear issue titles help contributors scan the backlog quickly.",
    goal: "Document examples of vague issue titles and stronger versions.",
    suggestedFiles: ["docs/ISSUE_TITLE_GUIDE.md"],
    acceptanceCriteria: [
      "Add at least 8 before-and-after title examples",
      "Mention action words like Add, Fix, Document, Improve",
      "Keep examples relevant to beginner open-source work",
      "Add a short checklist at the end"
    ],
    helpfulNotes: ["This should be easy for a new contributor to complete."]
  },
  {
    title: "Add a small command glossary for the CLI",
    labels: ["daily starter issue", "documentation", "cli", "good first issue", "time: 15 min", "level: first-pr"],
    context: "The CLI is small, but contributors should understand what each command does.",
    goal: "Add a command glossary for the `oss-lab` CLI.",
    suggestedFiles: ["docs/CLI.md"],
    acceptanceCriteria: [
      "Explain `check --profile beginner`",
      "Explain `check --profile maintainer`",
      "Explain `issues`",
      "Include one short example per command"
    ],
    helpfulNotes: ["No code changes are needed unless the docs reveal a real CLI gap."]
  },
  {
    title: "Improve the contributor card example",
    labels: ["daily starter issue", "documentation", "beginner friendly", "time: 15 min", "level: first-pr"],
    context: "Contributor cards should feel welcoming but still professional.",
    goal: "Improve the example contributor card with clearer fields.",
    suggestedFiles: ["contributors/README.md", "CONTRIBUTING.md"],
    acceptanceCriteria: [
      "Add a polished contributor card template",
      "Mention not to share private contact details",
      "Keep the example short",
      "Link the contributor card instructions from CONTRIBUTING.md"
    ],
    helpfulNotes: ["This is a safe docs task for someone making a first PR."]
  },
  {
    title: "Add a guide for asking better GitHub questions",
    labels: ["daily starter issue", "documentation", "community", "beginner friendly", "time: 30 min", "level: first-pr"],
    context: "Good questions get better answers and make Discussions easier to maintain.",
    goal: "Write a short guide that helps beginners ask answerable GitHub questions.",
    suggestedFiles: ["docs/ASKING_GOOD_QUESTIONS.md", "README.md"],
    acceptanceCriteria: [
      "Include what command was run, what happened, and what was expected",
      "Add a copy-paste question template",
      "Mention screenshots only when useful",
      "Link the guide from README"
    ],
    helpfulNotes: ["Make this encouraging. The goal is to help people ask, not scare them."]
  }
];
