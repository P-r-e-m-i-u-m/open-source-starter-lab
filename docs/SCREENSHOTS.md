# Screenshots And Visual System

This repo uses a small visual system so visitors can understand the project quickly.

Good screenshots should show the product, the workflow, or the proof layer. Do not add random decorative images.

## Visual Assets

| Asset | Purpose |
| --- | --- |
| `assets/banner.png` | Main README banner |
| `assets/screenshots/website-hero.jpg` | Website hero preview |
| `assets/screenshots/trust-passport-section.jpg` | Trust Passport website section |
| `assets/screenshots/mobile-issue-finder.jpg` | Mobile issue finder preview |
| `assets/screenshots/terminal-demo.gif` | Animated terminal demo showing checks and proof flow |
| `assets/screenshots/terminal-preview.svg` | Terminal proof preview |
| `assets/screenshots/automation-flow.svg` | Automation architecture flow |

## README Placement

The README should show visuals near the top:

1. banner
2. badges and website link
3. visual preview gallery
4. start path and proof links

This helps visitors decide what the repo does before reading every section.

## Screenshot Rules

- Use stable filenames so existing Markdown links do not break.
- Prefer JPEG for large website screenshots.
- Prefer SVG for diagrams and terminal-style previews.
- Keep GIFs short and focused on commands, checks, and outcomes.
- Keep screenshots focused on real repo behavior.
- Use helpful alt text.
- Replace existing screenshots only when the UI meaning changes.
## Website PR Proof

When your PR changes a page on the website, include proof that the page still works.

A good website PR proof usually includes:

* A screenshot of the changed section
* A note about loading the page locally
* The output of `npm run site:check-links`

Example:

> Loaded the homepage locally with `npm run site:dev`. The new link appears below the hero title.
> Ran `npm run site:check-links` and all links passed.
> Screenshot attached.

You do not need a screenshot for every small change. Describing what you loaded and what you checked is often enough.
## Refresh Checklist

When the website changes meaningfully:

1. Run the site locally.
2. Capture:
   - desktop hero
   - trust passport section
   - mobile issue finder
3. Keep the same filenames.
4. Run:

```bash
npm run check
npm run automation:health
```

5. Verify the README still renders cleanly.
