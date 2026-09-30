import { readFileSync } from "node:fs";
import { join } from "node:path";

export interface TimelineEntry {
  prNumber: number;
  date: string;
  title: string;
}

const PASSPORTS_DIR = join("contributors", "passports");
const MAX_TIMELINE_ENTRIES = 5;

function normalizeContributor(contributor: string): string | undefined {
  const normalized = contributor.trim().replace(/^@/, "").toLowerCase();

  if (!/^[a-z0-9-]+$/.test(normalized)) {
    return undefined;
  }

  return normalized;
}

export function parseContributorTimeline(contents: string): TimelineEntry[] {
  const entries: TimelineEntry[] = [];

  for (const line of contents.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("| #")) continue;

    const cells = trimmed
      .split("|")
      .map((cell) => cell.trim())
      .filter((cell) => cell.length > 0);

    const prText = cells[0];
    const date = cells[1];
    const title = cells[3];

    if (!prText || !date || !title || !/^#\d+$/.test(prText)) continue;
    if (Number.isNaN(Date.parse(date))) continue;

    entries.push({
      prNumber: Number(prText.slice(1)),
      date,
      title
    });
  }

  return entries
    .sort(
      (a, b) =>
        Date.parse(a.date) - Date.parse(b.date) ||
        a.prNumber - b.prNumber
    )
    .slice(0, MAX_TIMELINE_ENTRIES);
}

export function getContributorTimeline(contributor: string): TimelineEntry[] {
  const normalized = normalizeContributor(contributor);
  if (!normalized) return [];

  try {
    const contents = readFileSync(
      join(PASSPORTS_DIR, `${normalized}.md`),
      "utf8"
    );

    return parseContributorTimeline(contents);
  } catch {
    return [];
  }
}

export function timeline(contributor: string): void {
  const normalized = normalizeContributor(contributor);

  if (!normalized) {
    console.log("Provide a valid GitHub username.");
    return;
  }

  const entries = getContributorTimeline(normalized);

  console.log(`@${normalized} first merged PR timeline\n`);

  if (entries.length === 0) {
    console.log("No verified merged pull requests found for this contributor.");
    return;
  }

  entries.forEach((entry, index) => {
    console.log(`${index + 1}. ${entry.date} -> #${entry.prNumber} -> ${entry.title}`);
  });
}
