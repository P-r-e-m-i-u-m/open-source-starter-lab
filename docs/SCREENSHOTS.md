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
- Keep screenshots focused on real repo behavior.
- Use helpful alt text.
- Replace existing screenshots only when the UI meaning changes.

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
