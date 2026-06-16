import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const siteFilePath = path.join(process.cwd(), 'site', 'index.html');
const siteDirectory = path.dirname(siteFilePath);

const html = readFileSync(siteFilePath, 'utf8');

const linkPattern = /(?:href|src)="([^"]+)"/g;

const ignoredPrefixes = [
  'http://',
  'https://',
  '#',
  'mailto:',
  'tel:'
];

const missingLinks: string[] = [];

let match: RegExpExecArray | null;

while ((match = linkPattern.exec(html)) !== null) {
  const link = match[1];

  if (ignoredPrefixes.some((prefix) => link.startsWith(prefix))) {
    continue;
  }

  const cleanLink = link.split('#')[0].split('?')[0];

  if (!cleanLink) {
    continue;
  }

  const targetPath = path.join(siteDirectory, cleanLink);

  if (!existsSync(targetPath)) {
    missingLinks.push(link);
  }
}

if (missingLinks.length > 0) {
  console.error('Missing local site links found:');

  missingLinks.forEach((link) => {
    console.error(`- ${link}`);
  });

  process.exit(1);
}

console.log('Site link check passed.');