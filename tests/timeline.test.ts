import assert from "node:assert/strict";
import { parseContributorTimeline } from "../src/plugins/timeline.js";

const contents = `
| #304 | 2026-09-10 | merged | Add timeline command |
| #279 | 2026-09-07 | merged | Add contributor timeline |
| #283 | 2026-09-10 | merged | Improve timeline output |
| invalid | not-a-date | merged | Ignore this row |
`;

const entries = parseContributorTimeline(contents);

assert.deepEqual(entries, [
  {
    prNumber: 279,
    date: "2026-09-07",
    title: "Add contributor timeline"
  },
  {
    prNumber: 283,
    date: "2026-09-10",
    title: "Improve timeline output"
  },
  {
    prNumber: 304,
    date: "2026-09-10",
    title: "Add timeline command"
  }
]);

const manyEntries = parseContributorTimeline(`
| #1 | 2026-01-01 | merged | First PR |
| #2 | 2026-01-02 | merged | Second PR |
| #3 | 2026-01-03 | merged | Third PR |
| #4 | 2026-01-04 | merged | Fourth PR |
| #5 | 2026-01-05 | merged | Fifth PR |
| #6 | 2026-01-06 | merged | Sixth PR |
`);

assert.equal(manyEntries.length, 5);

console.log("Timeline tests passed.");