import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const source = readFileSync("site/app.js", "utf8");

class Element {
  innerHTML = "";
  textContent = "";
  value = "15";
  style = {};
  children: Element[] = [];
  addEventListener() {}
  append(...elements: Element[]) { this.children.push(...elements); }
  appendChild(element: Element) { this.children.push(element); }
}

async function renderFeed(issues: unknown[]) {
  const feed = new Element();
  const skill = new Element();
  skill.value = "docs";
  const controls = new Map([["#skill", skill]]);
  await runInNewContext(`${source}\nfetchLiveIssues();`, {
    document: {
      querySelector: (selector: string) => controls.get(selector) ?? new Element(),
      getElementById: () => feed,
      createElement: () => new Element(),
      addEventListener() {}
    },
    fetch: async () => ({ ok: true, json: async () => issues })
  });
  return feed;
}

const pullRequest = { number: 1, pull_request: { url: "https://api.github.com/repos/example/repo/pulls/1" } };
const issue = {
  number: 2,
  title: "A beginner task",
  html_url: "https://github.com/example/repo/issues/2",
  assignees: []
};

const emptyFeed = await renderFeed([]);
assert.match(emptyFeed.innerHTML, /No open good first issues found/);

// GitHub's issues endpoint also returns pull requests. After excluding them,
// an all-PR response must show the empty state rather than a blank success.
const prOnlyFeed = await renderFeed([pullRequest]);
assert.match(prOnlyFeed.innerHTML, /No open good first issues found/);
assert.equal(prOnlyFeed.children.length, 0);

const mixedFeed = await renderFeed([pullRequest, issue]);
assert.doesNotMatch(mixedFeed.innerHTML, /No open good first issues found/);
assert.equal(mixedFeed.children.length, 1);
assert.equal(mixedFeed.children[0].children[0].children[0].textContent, "[AVAILABLE] ");
assert.equal(mixedFeed.children[0].children[0].children[1].textContent, "#2 A beginner task");

const assignedFeed = await renderFeed([{ ...issue, assignees: [{ login: "contributor" }] }]);
assert.equal(assignedFeed.children[0].children[0].children[0].textContent, "[CLAIMED] ");

console.log("Site issue feed tests passed.");
