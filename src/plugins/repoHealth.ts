import { expect, test } from "@jest/globals";
import { repoHealth } from "../src/plugins/repoHealth.js";

test("repoHealth logs not implemented message", () => {
  const logs: string[] = [];
  const originalLog = console.log;
  console.log = (...args: unknown[]) => logs.push(args.join(" "));
  
  expect(() => repoHealth()).not.toThrow();
  
  console.log = originalLog;
  expect(logs).toContain("Not implemented yet.");
});