export interface ContributionStats {
  pullRequests: number;
  docsPullRequests: number;
}

interface Badge {
  name: string;
  description: string;
  earned(stats: ContributionStats): boolean;
}

const BADGES: Badge[] = [
  {
    name: "First PR",
    description: "Opened your first pull request.",
    earned: (stats) => stats.pullRequests >= 1,
  },
  {
    name: "Five PRs",
    description: "Opened five pull requests.",
    earned: (stats) => stats.pullRequests >= 5,
  },
  {
    name: "Docs Contributor",
    description: "Improved the documentation with a pull request.",
    earned: (stats) => stats.docsPullRequests >= 1,
  },
];

export function badges(stats: ContributionStats = { pullRequests: 0, docsPullRequests: 0 }): void {
  const earnedBadges = BADGES.filter((badge) => badge.earned(stats));

  if (earnedBadges.length === 0) {
    console.log("No badges earned yet. Open a pull request to earn your first badge!");
    return;
  }

  console.log(`Badges earned (${earnedBadges.length}/${BADGES.length}):`);
  for (const badge of earnedBadges) {
    console.log(`- ${badge.name}: ${badge.description}`);
  }
}