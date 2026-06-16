import { spawnSync } from 'node:child_process';

const result = spawnSync(
  process.execPath,
  ['dist/src/cli.js', 'unknown-command'],
  {
    encoding: 'utf8'
  }
);

if (result.status === 0) {
  throw new Error('Expected unknown command to exit with a non-zero status code.');
}

const output = `${result.stdout}${result.stderr}`;

if (!output.includes('Unknown command')) {
  throw new Error('Expected output to include "Unknown command".');
}

console.log('Unknown command CLI test passed.');