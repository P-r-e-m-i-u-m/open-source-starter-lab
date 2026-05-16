# Hacktoberfest 2026 Contribution Badge Plan

## Badge System

### Badges
| Badge | Requirement | Image |
|-------|------------|-------|
| 🌱 Seedling | 1 PR merged | Beginner |
| 🌿 Sapling | 4 PRs merged | Intermediate |
| 🌳 Tree | 10 PRs merged | Advanced |
| 🏆 Champion | 25+ PRs merged | Expert |

### Badge Criteria
- PRs must be to participating repos
- Only meaningful contributions (no typo-only PRs)
- PR must be merged, not just opened
- Spam PRs disqualify from badge system

### Implementation
```yaml
# .github/workflows/hacktoberfest-badges.yml
name: Hacktoberfest Badge Check
on:
  pull_request:
    types: [closed]

jobs:
  check-badge:
    if: github.event.pull_request.merged == true
    runs-on: ubuntu-latest
    steps:
      - name: Count merged PRs
        uses: actions/github-script@v7
        with:
          script: |
            const prs = await github.rest.search.issues({
              q: `author:${context.payload.pull_request.user.login} is:pr is:merged repo:${context.repo.owner}/${context.repo.repo}`
            });
            const count = prs.data.total_count;
            // Award badge based on count
```

### Badge Display
Badges shown on:
- GitHub profile README
- Project contributors page
- Monthly leaderboard

### Timeline
- October 1-31: Contribution period
- November 1-7: Badge review
- November 10: Badges awarded
