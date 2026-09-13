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

const htmlCssFit = findIssueFit("HTML-CSS", "15m");
assert.equal(htmlCssFit.skill, "html-css");
assert.equal(htmlCssFit.timeBudget, "15m");
assert.equal(htmlCssFit.firstCommand, "npm install");
assert.ok(htmlCssFit.proofChecklist.some((item) => item.includes("Do not start a feature")));
assert.ok(htmlCssFit.commentTemplate.includes("Skill: html-css"));
assert.ok(htmlCssFit.commentTemplate.includes("Time today: 15m"));
assert.ok(htmlCssFit.commentTemplate.includes("Please assign this to me"));

const numericTimeFit = findIssueFit("testing", "60");
assert.equal(numericTimeFit.timeBudget, "1h");

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
