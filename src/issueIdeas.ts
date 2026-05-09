export interface IssueIdea {
  title: string;
  label: string;
  difficulty: "easy" | "medium";
  goal: string;
  acceptanceCriteria: string[];
}

export const issueIdeas: IssueIdea[] = [
  {
    title: "Add a Windows Git setup guide",
    label: "good first issue",
    difficulty: "easy",
    goal: "Create a short guide for installing Git and confirming it works on Windows.",
    acceptanceCriteria: [
      "Add a docs page for Windows setup",
      "Include git --version verification",
      "Mention Git Credential Manager"
    ]
  },
  {
    title: "Add common first PR mistakes",
    label: "documentation",
    difficulty: "easy",
    goal: "Document mistakes beginners make when opening their first pull request.",
    acceptanceCriteria: [
      "Add at least five mistakes",
      "Include one fix for each mistake",
      "Keep examples short and friendly"
    ]
  },
  {
    title: "Add CLI output examples",
    label: "help wanted",
    difficulty: "easy",
    goal: "Improve examples for the oss-lab CLI.",
    acceptanceCriteria: [
      "Show beginner checklist output",
      "Show maintainer checklist output",
      "Add commands to docs/CLI.md"
    ]
  },
  {
    title: "Add a contribution glossary",
    label: "good first issue",
    difficulty: "easy",
    goal: "Explain common open-source words in simple language.",
    acceptanceCriteria: [
      "Explain fork, branch, commit, pull request, issue, review, and CI",
      "Use beginner-friendly wording",
      "Link the glossary from README"
    ]
  },
  {
    title: "Add a maintainer response playbook",
    label: "documentation",
    difficulty: "medium",
    goal: "Create reusable reply examples for welcoming contributors and reviewing PRs.",
    acceptanceCriteria: [
      "Add at least six maintainer reply examples",
      "Include positive and correction-focused replies",
      "Avoid robotic wording"
    ]
  }
];
