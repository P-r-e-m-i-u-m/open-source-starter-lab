import assert from "node:assert/strict";
import { issueIdeas } from "../src/issueIdeas.js";

assert.ok(Array.isArray(issueIdeas));
assert.ok(issueIdeas.length > 0);
assert.equal(issueIdeas[0].title,"Add a Windows Git setup guide");
assert.equal(issueIdeas[0].difficulty,"easy");