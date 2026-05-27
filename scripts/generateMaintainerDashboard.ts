import { readdir, readFile, writeFile } from "node:fs/promises";
import { dailyIssueBacklog } from "../src/dailyIssueBacklog.js";
import { scoreDailyIssue } from "../src/issueQuality.js";

const dashboardPath = "docs/MAINTAINER_DASHBOARD.md";
const passportDirectory = "contributors/passports";

interface PassportSummary {
  user: string;
  file: string;
  level: string;
  contributions: number;
}

function hasFlag(flag: string): boolean {
  return process.argv.includes(flag);
}

function formatDate(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

async function readPassports(): Promise<PassportSummary[]> {
  let files: string[] = [];
  try {
    files = await readdir(passportDirectory);
  } catch {
    return [];
  }

  const summaries: PassportSummary[] = [];
  for (const file of files.filter((name) => name.endsWith(".md") && name !== "README.md")) {
    const content = await readFile(`${passportDirectory}/${file}`, "utf8");
    const user = content.match(/^# @(.+) Open Source Trust Passport/m)?.[1] ?? file.replace(/\.md$/, "");
    const level = content.match(/^- Level: (.+)$/m)?.[1] ?? "not assigned yet";
    const contributions = content
      .split("\n")
      .filter((line) => /^\| #\d+ \|/.test(line.trim()))
      .length;

    summaries.push({ user, file, level, contributions });
  }

  return summaries.sort((a, b) => b.contributions - a.contributions || a.user.localeCompare(b.user));
}

function summarizeIssueQuality(): string[] {
  const scores = dailyIssueBacklog.map(scoreDailyIssue);
  const average = Math.round(scores.reduce((total, score) => total + score.score, 0) / scores.length);
  const excellent = scores.filter((score) => score.rating === "excellent").length;
  const strong = scores.filter((score) => score.rating === "strong").length;
  const needsPolish = scores.filter((score) => score.rating === "needs polish").length;

  return [
    `- Curated backlog size: ${dailyIssueBacklog.length} issues`,
    `- Average issue quality score: ${average}/100`,
    `- Excellent issues: ${excellent}`,
    `- Strong issues: ${strong}`,
    `- Needs polish: ${needsPolish}`
  ];
}

function selectSpotlight(passports: PassportSummary[]): string[] {
  const spotlight = passports[0];
  if (!spotlight) {
    return [
      "No spotlight selected yet.",
      "",
      "The first monthly spotlight should go to a contributor who ships a focused PR, includes check output, and helps keep the repo welcoming."
    ];
  }

  return [
    `This month, the spotlight is on @${spotlight.user}.`,
    "",
    `- Passport level: ${spotlight.level}`,
    `- Verified contributions: ${spotlight.contributions}`,
    "- Why it matters: visible proof helps new contributors trust that the repo is active and reviewable."
  ];
}

async function buildDashboard(): Promise<string> {
  const passports = await readPassports();
  const spotlight = selectSpotlight(passports);
  const passportRows = passports.length
    ? passports
        .map(
          (passport) =>
            `| @${passport.user} | ${passport.level} | ${passport.contributions} | [passport](../contributors/passports/${passport.file}) |`
        )
        .join("\n")
    : "| No passports yet | - | - | - |";

  return [
    "# Maintainer Dashboard",
    "",
    `Generated: ${formatDate()}`,
    "",
    "This dashboard is the small operating view for Open Source Starter Lab. It keeps the repo looking alive, curated, and reviewable without making contributors guess what is happening.",
    "",
    "## Health Signals",
    "",
    "| Signal | Link | Maintainer meaning |",
    "| --- | --- | --- |",
    "| CI | [workflow](https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/actions/workflows/ci.yml) | Build and smoke tests are the first trust signal |",
    "| Automation Health | [workflow](https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/actions/workflows/automation-health.yml) | Automation scripts dry-run before they break public flows |",
    "| Daily Issue Bot | [workflow](https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/actions/workflows/daily-issue-bot.yml) | Beginner tasks keep moving from a curated backlog |",
    "| Contributor Queue | [queue](https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/issues/46) | Shows who may need follow-up |",
    "| Weekly Assignment Thread | [discussion](https://github.com/P-r-e-m-i-u-m/open-source-starter-lab/discussions/44) | Main place to match people by skill and time |",
    "",
    "## Issue Quality",
    "",
    ...summarizeIssueQuality(),
    "",
    "Every daily issue should include context, goal, suggested files, acceptance criteria, time label, level label, and helpful notes.",
    "",
    "## Passport Snapshot",
    "",
    "| Contributor | Level | Contributions | Proof |",
    "| --- | --- | --- | --- |",
    passportRows,
    "",
    "## Monthly Contributor Spotlight",
    "",
    ...spotlight,
    "",
    "## This Month's Maintainer Focus",
    "",
    "- Keep open issues between 20 and 35 curated tasks.",
    "- Reply quickly when somebody asks for assignment.",
    "- Merge small PRs with clear proof.",
    "- Point returning contributors to Level 2 and Level 3 passport paths.",
    "- Keep the website as the main product surface, with README acting as the fast GitHub doorway.",
    ""
  ].join("\n");
}

async function main(): Promise<void> {
  const dashboard = await buildDashboard();

  if (hasFlag("--dry-run")) {
    console.log(dashboard);
    return;
  }

  await writeFile(dashboardPath, dashboard, "utf8");
  console.log(`Generated ${dashboardPath}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
