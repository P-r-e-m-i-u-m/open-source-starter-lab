export type StarterProfile = "beginner" | "maintainer";

export interface ChecklistItem {
  id: string;
  title: string;
  why: string;
  command?: string;
}

export interface ChecklistResult {
  profile: StarterProfile;
  score: number;
  items: ChecklistItem[];
  nextAction: string;
}

const beginnerItems: ChecklistItem[] = [
  {
    id: "fork",
    title: "Fork or clone the repository",
    why: "You need your own workspace before changing files.",
    command: "git clone <repo-url>"
  },
  {
    id: "branch",
    title: "Create a focused branch",
    why: "Small branches make pull requests easier to review.",
    command: "git checkout -b docs/add-my-first-note"
  },
  {
    id: "change",
    title: "Make one small improvement",
    why: "The best first PR is clear, useful, and easy to verify."
  },
  {
    id: "test",
    title: "Run the project check",
    why: "Passing checks prove the change did not break the project.",
    command: "npm run check"
  },
  {
    id: "pr",
    title: "Open a pull request with evidence",
    why: "Maintainers can review faster when you show what changed and how you tested."
  }
];

const maintainerItems: ChecklistItem[] = [
  {
    id: "labels",
    title: "Label beginner-friendly work",
    why: "Clear labels help new contributors find the right first task."
  },
  {
    id: "templates",
    title: "Use issue and PR templates",
    why: "Templates turn vague reports into actionable tasks."
  },
  {
    id: "ci",
    title: "Keep CI fast and visible",
    why: "A short green check builds trust with contributors."
  },
  {
    id: "answers",
    title: "Answer Discussions with complete steps",
    why: "Good answers teach the public, not only the person asking."
  },
  {
    id: "recognition",
    title: "Recognize contributors",
    why: "People return when their work is noticed respectfully."
  }
];

export function buildChecklist(profile: StarterProfile): ChecklistResult {
  const items = profile === "maintainer" ? maintainerItems : beginnerItems;

  return {
    profile,
    score: profile === "maintainer" ? 82 : 76,
    items,
    nextAction:
      profile === "maintainer"
        ? "Create 3 small issues with clear acceptance criteria."
        : "Pick one good first issue and comment that you want to work on it."
  };
}
