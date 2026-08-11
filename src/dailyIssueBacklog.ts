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
    labels: ["daily starter issue", "documentation", "good first issue", "beginner friendly", "time: 30 min", "level: first-pr"],
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
  },
  {
    title: "Add website copy for contributors bringing real problems",
    labels: ["daily starter issue", "documentation", "community", "help wanted", "time: 30 min", "level: second-pr"],
    context: "The repo now supports contributor-created idea issues, but the website can explain that path more clearly.",
    goal: "Improve the website copy so visitors understand when to open a real problem idea instead of taking a beginner task.",
    suggestedFiles: ["site/index.html", "site/README.md"],
    acceptanceCriteria: [
      "Explain the difference between claiming an issue and proposing a real problem",
      "Mention examples like missing guides, confusing workflows, or automation gaps",
      "Keep the copy short and human",
      "Run `npm run site:check-links`"
    ],
    helpfulNotes: ["This is a good task for someone who wants to improve product messaging without changing app logic."]
  },
  {
    title: "Add tests for daily issue duplicate handling",
    labels: ["daily starter issue", "testing", "developer tooling", "help wanted", "time: 1 hour", "level: second-pr"],
    context: "The daily issue bot should skip open duplicate titles and keep looking for fresh backlog items.",
    goal: "Add a small test or fixture that protects duplicate-skipping behavior.",
    suggestedFiles: ["tests/smoke.test.ts", "scripts/createDailyIssue.ts"],
    acceptanceCriteria: [
      "Cover the case where selected daily issues already exist",
      "Assert the bot can still find fresh candidates",
      "Keep the test independent from live GitHub API calls",
      "Run `npm run check`"
    ],
    helpfulNotes: ["Do not call GitHub in the test. Extracting a tiny pure helper is okay if it keeps the test simple."]
  },
  {
    title: "Improve the live issue feed empty state",
    labels: ["daily starter issue", "developer tooling", "help wanted", "time: 30 min", "level: second-pr"],
    context: "The website live feed currently shows a simple empty message when GitHub returns no issues.",
    goal: "Make the empty state more useful by linking to the real problem issue template and weekly assignment thread.",
    suggestedFiles: ["site/app.js", "site/index.html"],
    acceptanceCriteria: [
      "Keep the existing live issue feed behavior",
      "Add a helpful empty state with two next actions",
      "Escape any dynamic issue text safely",
      "Run `npm run site:check-links`"
    ],
    helpfulNotes: ["This is a practical JavaScript task with a visible website result."]
  },
  {
    title: "Add a maintainer triage checklist for real problem ideas",
    labels: ["daily starter issue", "documentation", "community", "help wanted", "time: 30 min", "level: maintainer-practice"],
    context: "Contributor-created idea issues need a clear maintainer path so they become useful work instead of vague suggestions.",
    goal: "Create a checklist for triaging `needs triage` idea issues into ready tasks.",
    suggestedFiles: ["docs/MAINTAINER_PLAYBOOK.md", "docs/ISSUE_QUALITY.md"],
    acceptanceCriteria: [
      "Explain when to keep, close, split, or convert an idea issue",
      "Include a short maintainer reply template",
      "Mention adding labels for skill, time, and contributor level",
      "Link to the real problem issue template"
    ],
    helpfulNotes: ["This helps stronger contributors and maintainers collaborate without making the repo messy."]
  },
  {
    title: "Add CLI help text for the first issue fit command",
    labels: ["daily starter issue", "cli", "developer tooling", "good first issue", "time: 30 min", "level: second-pr"],
    context: "The `fit` command is useful, but contributors may not discover the accepted skill and time values.",
    goal: "Improve CLI output or docs so `fit` clearly shows accepted skill and time examples.",
    suggestedFiles: ["src/cli.ts", "docs/CLI.md", "tests/smoke.test.ts"],
    acceptanceCriteria: [
      "Show at least three accepted skill examples",
      "Show accepted time values like `15m`, `30m`, and `1h`",
      "Keep existing command behavior working",
      "Run `npm run check`"
    ],
    helpfulNotes: ["This is a real code task but still small enough for a focused PR."]
  },
  {
    title: "Add a docs page for reviewing someone else's first PR",
    labels: ["daily starter issue", "documentation", "community", "help wanted", "time: 30 min", "level: trust-builder"],
    context: "Returning contributors can become more valuable by helping review or explain first PRs kindly.",
    goal: "Write a guide that shows how to review a beginner PR without sounding harsh.",
    suggestedFiles: ["docs/REVIEWING_FIRST_PRS.md", "docs/CONTRIBUTOR_LADDER.md"],
    acceptanceCriteria: [
      "Include a short review checklist",
      "Add examples of helpful review comments",
      "Mention asking for proof like `npm run check` output",
      "Link from the contributor ladder"
    ],
    helpfulNotes: ["This supports real community growth beyond one-time beginner PRs."]
  },
  {
    title: "Add issue labels for website and accessibility work",
    labels: ["daily starter issue", "developer tooling", "help wanted", "time: 30 min", "level: maintainer-practice"],
    context: "The repo website is becoming a product surface, so website and accessibility tasks should be easy to find.",
    goal: "Add label support for website and accessibility related issues in automation docs or label setup.",
    suggestedFiles: ["scripts/createDailyIssue.ts", "docs/AUTOMATION_HEALTH.md"],
    acceptanceCriteria: [
      "Add label colors and descriptions for `website` and `accessibility`",
      "Keep existing labels unchanged",
      "Mention when maintainers should use the labels",
      "Run `npm run automation:health`"
    ],
    helpfulNotes: ["This is a maintainer workflow improvement, not a visual redesign."]
  },
  {
    title: "Add a small accessibility pass for website buttons",
    labels: ["daily starter issue", "developer tooling", "help wanted", "time: 1 hour", "level: second-pr"],
    context: "The website has strong visual styling, but interactive elements should stay keyboard-friendly and readable.",
    goal: "Review website buttons and links for focus states, labels, and touch target clarity.",
    suggestedFiles: ["site/index.html", "site/styles.css"],
    acceptanceCriteria: [
      "Check that primary links have clear accessible text",
      "Improve focus styles if needed",
      "Avoid changing the full visual direction",
      "Run `npm run site:check-links`"
    ],
    helpfulNotes: ["A before-and-after screenshot is helpful for this PR."]
  },
  {
    title: "Add a guide for converting a discussion into an issue",
    labels: ["daily starter issue", "documentation", "community", "help wanted", "time: 30 min", "level: trust-builder"],
    context: "Useful ideas often start in Discussions, but maintainers need a simple way to turn them into scoped issues.",
    goal: "Document a lightweight process for converting a good Discussion comment into a ready issue.",
    suggestedFiles: ["docs/WEEKLY_HELP_THREAD.md", "docs/MAINTAINER_PLAYBOOK.md"],
    acceptanceCriteria: [
      "Explain what information must be copied from the Discussion",
      "Include a ready issue checklist",
      "Mention `needs triage` and skill labels",
      "Keep the guide short"
    ],
    helpfulNotes: ["This helps the repo feel active without creating random low-quality issues."]
  },
  {
    title: "Add a contributor proof example for website changes",
    labels: ["daily starter issue", "documentation", "help wanted", "time: 30 min", "level: second-pr"],
    context: "Website PRs need different proof than docs-only PRs because visual changes should be checked.",
    goal: "Add an example of good PR proof for website changes.",
    suggestedFiles: ["docs/PR_DESCRIPTION_GUIDE.md", "docs/SCREENSHOTS.md"],
    acceptanceCriteria: [
      "Show a short website PR proof example",
      "Mention local page loading or screenshot proof",
      "Mention `npm run site:check-links`",
      "Keep the wording beginner-friendly"
    ],
    helpfulNotes: ["This improves review quality for future website contributors."]
  }
];
