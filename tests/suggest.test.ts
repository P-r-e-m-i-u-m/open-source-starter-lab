import { spawnSync } from "node:child_process";

function run(args: string[]) {
  return spawnSync(process.execPath, ["dist/src/cli.js", ...args], {
    encoding: "utf8",
    timeout: 5000
  });
}

function testSuggestCommand(): void {
  console.log("🧪 Running: Suggest command test...");

  const tests = [
    {
      name: "no --skill flag prompts for one instead of crashing",
      args: ["suggest"],
      check: (result: ReturnType<typeof run>) => {
        if (result.status !== 0) {
          throw new Error(`Expected exit code 0, got ${result.status}`);
        }
        if (!result.stdout.includes("Tell me a skill")) {
          throw new Error(`Expected a prompt for a skill. Got: ${result.stdout}`);
        }
      }
    },
    {
      name: "valid --skill returns a suggested issue path",
      args: ["suggest", "--skill", "docs"],
      check: (result: ReturnType<typeof run>) => {
        if (result.status !== 0) {
          throw new Error(`Expected exit code 0, got ${result.status}`);
        }
        if (!result.stdout.includes("Suggested next issue")) {
          throw new Error(`Expected a suggestion header. Got: ${result.stdout}`);
        }
        if (!result.stdout.includes("Skill: docs")) {
          throw new Error(`Expected the resolved skill in output. Got: ${result.stdout}`);
        }
        if (!result.stdout.includes("Comment to paste")) {
          throw new Error(`Expected a ready-to-use comment template. Got: ${result.stdout}`);
        }
      }
    },
    {
      name: "skill alias resolves the same as canonical skill",
      args: ["suggest", "--skill", "js"],
      check: (result: ReturnType<typeof run>) => {
        if (result.status !== 0) {
          throw new Error(`Expected exit code 0, got ${result.status}`);
        }
        if (!result.stdout.includes("Skill: javascript")) {
          throw new Error(`Expected alias "js" to resolve to javascript. Got: ${result.stdout}`);
        }
      }
    },
    {
      name: "unknown skill fails gracefully without a stack trace",
      args: ["suggest", "--skill", "cobol"],
      check: (result: ReturnType<typeof run>) => {
        if (result.status !== 0) {
          throw new Error(`Expected exit code 0 (handled error), got ${result.status}`);
        }
        if (!result.stdout.includes("Could not suggest an issue")) {
          throw new Error(`Expected a friendly error message. Got: ${result.stdout}`);
        }
      }
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const result = run(test.args);
      test.check(result);
      console.log(`  ✅ ${test.name}`);
      passed++;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`  ❌ ${test.name}: ${message}`);
      failed++;
    }
  }

  if (failed > 0) {
    console.error(`\n❌ ${failed} test(s) failed, ${passed} passed`);
    process.exit(1);
  }

  console.log(`\n✅ All ${passed} suggest tests passed! 🎉`);
}

testSuggestCommand();