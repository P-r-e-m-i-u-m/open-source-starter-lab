const FILE_PATH_PATTERN = /`?([\w./-]+\.(ts|md))`?/;

// Only issues generated from a TODO in a file can be judged by reading that
// file. Any other title that happens to name a file must stay open.
const TODO_ISSUE_PREFIXES = ["Close out the TODO", "Write the recipe"];

function hasTodo(content: string): boolean {
  return /\/\/\s*(TODO|FIXME)[:\s]/.test(content) || /<!--\s*TODO[:\s]/.test(content);
}

export function isDailyIssueResolved(title: string, readFile: (path: string) => string): boolean {
  if (!TODO_ISSUE_PREFIXES.some((prefix) => title.startsWith(prefix))) {
    return false;
  }

  const filePath = title.match(FILE_PATH_PATTERN)?.[1];
  if (!filePath) {
    return false;
  }

  let content: string;
  try {
    content = readFile(filePath);
  } catch {
    return true;
  }

  return !hasTodo(content);
}
