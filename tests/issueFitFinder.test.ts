import assert from "node:assert/strict";
import { findIssueFit } from "../src/issueFitFinder.js";

const docsFit = findIssueFit("docs", "30m");
assert.equal(docsFit.skill, "docs");
assert.equal(docsFit.timeBudget, "30m");
assert.equal(docsFit.firstCommand, "npm run check");
assert.ok(docsFit.issueSearchUrl.startsWith("https://github.com/P-r-e-m-i-u-m/open-source-starter-lab"));
assert.ok(docsFit.issueSearchUrl.includes("label%3A%22skill%3A%20docs%22"));
assert.ok(docsFit.issueSearchUrl.includes("no%3Aassignee"));
assert.ok(docsFit.commentTemplate.includes("Please assign this to me"));

const javascriptFit = findIssueFit(" ts ", "hour");
assert.equal(javascriptFit.skill, "javascript");
assert.equal(javascriptFit.timeBudget, "1h");
assert.ok(javascriptFit.proofChecklist.some((item) => item.includes("full project check")));

assert.throws(() => findIssueFit("unknown"), /Use --skill/);
assert.throws(() => findIssueFit("docs", "2h"), /Use --time/);

const firstTestingFit = findIssueFit("testing", "15m");
firstTestingFit.proofChecklist.push("mutated by caller");
const secondTestingFit = findIssueFit("testing", "15m");
assert.ok(!secondTestingFit.proofChecklist.includes("mutated by caller"));

console.log("Issue fit finder tests passed.");
