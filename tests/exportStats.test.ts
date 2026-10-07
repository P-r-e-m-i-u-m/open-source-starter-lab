import assert from "node:assert/strict";
import fs from "node:fs";
import os  from "node:os";
import path from "node:path";

import { exportStats } from "../src/plugins/exportStats.js";
const tempDir = fs.mkdtempSync(
  path.join(os.tmpdir(), "export-stats-test-")
);
const outputPath = path.join(tempDir, "stats.json");
const stats = {
    username : "test-user",
    pullRequests : 3,
    issues : 2,
    labelsTouched : ["bug", "good-first-issue"]
};

exportStats(stats, outputPath);
const written = JSON.parse(
    fs.readFileSync(outputPath, "utf-8")
);
assert.deepEqual(written, stats);
fs.rmSync(tempDir, { recursive: true, force: true});