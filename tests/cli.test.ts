import { spawnSync } from 'node:child_process';

function testUnknownCommand(): void {
  console.log('🧪 Running: Unknown command test...');

  const tests = [
    {
      name: 'unknown command fails with non-zero exit code',
      args: ['dist/src/cli.js', 'definitely-invalid-command'],
      check: (result: any) => {
        if (result.status === 0) {
          throw new Error('Expected non-zero exit code');
        }
        return true;
      }
    },
    {
      name: 'error message contains "Unknown command"',
      args: ['dist/src/cli.js', 'notARealCommand'],
      check: (result: any) => {
        const output = `${result.stdout}${result.stderr}`;
        if (!output.includes('Unknown command')) {
          throw new Error(`Expected "Unknown command" in output. Got: ${output}`);
        }
        return true;
      }
    },
    {
      name: 'unknown command output is not empty',
      args: ['dist/src/cli.js', 'foo'],
      check: (result: any) => {
        const output = `${result.stdout}${result.stderr}`;
        if (output === '') {
          throw new Error('Expected non-empty output');
        }
        return true;
      }
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const result = spawnSync(
        process.execPath,
        test.args,
        { encoding: 'utf8', timeout: 5000 }
      );
      test.check(result);
      console.log(`  ✅ ${test.name}`);
      passed++;
    } catch (error: any) {
      console.error(`  ❌ ${test.name}: ${error.message}`);
      failed++;
    }
  }

  if (failed > 0) {
    console.error(`\n❌ ${failed} test(s) failed, ${passed} passed`);
    process.exit(1);
  }

  console.log(`\n✅ All ${passed} tests passed! 🎉`);
}

testUnknownCommand();