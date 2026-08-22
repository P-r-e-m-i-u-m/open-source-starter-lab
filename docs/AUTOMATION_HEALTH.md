# Automation Health

This repo uses GitHub Actions to keep contributor support moving without manual busywork.

The goal is not to make the repo noisy. The goal is to catch broken automation early and keep every workflow easy to recover.

---

## Active Automations

| Workflow | Purpose | Safety guard |
| --- | --- | --- |
| `CI` | Builds and tests the project on pushes and PRs | 10 minute timeout |
| `Daily Issue Bot` | Creates up to five beginner starter issues from a curated backlog | Duplicate protection in the script, two daily schedule windows, concurrency guard |
| `Weekly Help Thread` | Opens the weekly issue-assignment discussion | Existing-thread check, concurrency guard |
| `Assignment Helper` | Assigns contributors who comment `.take` or ask to work on an issue | Dry-run request recognition and marked reply body |
| `Contributor Queue` | Keeps maintainer follow-up visible | Concurrency guard, secondary rate-limit skip |
| `PR Welcome Guard` | Replies to PRs with review-readiness guidance | Updates one marked comment instead of posting duplicates |
| `Contributor Proof After Merge` | Thanks contributors, closes linked issues, updates the First Merge Wall, and creates contributor passports | Per-PR concurrency guard, direct issue listing instead of search API |
| `Automation Health` | Dry-runs automation scripts daily AND monitors for workflows stuck in the queue | Read-only permissions, `continue-on-error: true`, 20-minute queued run threshold |

---

## Daily Health Check

`Automation Health` runs this command:

```bash
npm run automation:health


---

## 📋 What Changed

| Section | Change |
|---------|--------|
| **Active Automations Table** | Updated `Automation Health` row to mention queued run monitoring and `continue-on-error: true` |
| **New Section: Queued Run Monitor** | Added full explanation of how it works, what warnings look like, why it matters, and what to do |
| **Recovery Steps** | Added step 7 for queued run warnings |
| **Long-Term Rule** | Added note about monitoring new automations |

---

## 🚀 Your Next Steps

1. **Replace the content** of your file with this updated version
2. **Make sure the file name is correct**: `docs/AUTOMATION_HEALTH.md` (not `# Automation Health.txt`)
3. **Commit and push:**

```bash
git add docs/AUTOMATION_HEALTH.md
git commit -m "docs: update automation health docs with queued run monitor

- Add queued run monitor section
- Update active automations table
- Add recovery step for stuck workflows
- Update long-term rule

Closes #184"

git push origin automation/queued-workflow-check