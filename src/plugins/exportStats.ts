import * as fs from 'fs';
import * as path from 'path';

export interface ContributorStats {
  username: string;
  pullRequests: number;
  issues: number;
  labelsTouched: string[];
}

export function exportStats(
  stats?: ContributorStats,
  outputPath: string = 'contributor-stats.json'
): void {
  const data: ContributorStats = stats ?? {
    username: 'unknown',
    pullRequests: 0,
    issues: 0,
    labelsTouched: [],
  };

  const resolvedPath = path.resolve(process.cwd(), outputPath);
  fs.writeFileSync(resolvedPath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`Stats successfully exported to ${resolvedPath}`);
}
