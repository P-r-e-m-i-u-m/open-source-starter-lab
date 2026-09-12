import assert from "node:assert/strict";

import { weeklySummary } from "../src/plugins/weeklySummary.js";

let output = "";

const originalLog = console.log;

console.log = (message: string) => {
  output = message;
};

weeklySummary();

console.log = originalLog;

assert.equal(output, "Not implemented yet.");

console.log("Weekly summary tests passed.");