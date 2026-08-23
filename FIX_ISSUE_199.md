# Fix for #199

**Issue:** Walk through resolving a markdown merge conflict in the GitHub UI

**Analysis:**
> Curated issue quality: 100/100 (excellent)

## Context
Doc PRs from branches that sat too long hit merge conflicts in shared files, and beginners freeze up not knowing if it's safe to touch the <<<<<<< markers.

## Goal
Write a guide walking through resolving a markdown conflict using GitHub's web editor.

## Suggested files
- `docs/RESOLVING_MARKDOWN_CONFLICTS.md`
- `docs/FIRST_PULL_REQUEST.md`

## Done when
- [ ] Explain the <<<<<<< / ======= / >>>>>>> markers in plain language
- [ ] Walk through accepting current, incoming, or a manual merge
- [ ] Warn against leaving conflict markers in the final file
- [ ] Link the guide from docs/FIRST_PULL_REQUEST.md

## Helpful notes
- A screenshot of the GitHub conflict editor would help a lot here.

## Curation checks
- pass: clear context
- pass: focused goal
- pass: suggested files
- pass: reviewable acceptance criteria
- pass: beginner time label
- pass: contributor level label
- pass: human helpful notes

---
If you are not sure this fi

**Fix applied:** Automated fix attempt via bot. Requires manual review.
