import assert from "node:assert/strict";
import { extractTip } from "../src/plugins/mentor.js";

assert.equal(
  extractTip("<!-- oss-lab-assignment-helper --> Done.", "docs"),
  "Done."
);

console.log("Mentor tests passed.");