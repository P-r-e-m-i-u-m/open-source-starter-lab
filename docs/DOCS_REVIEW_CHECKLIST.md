# Documentation Review Checklist

Use this checklist when reviewing documentation pull requests. It helps reviewers move faster and keeps feedback consistent and kind.

## Checklist

**Clarity**
- [ ] Is the purpose of the change clear from the title and description?
- [ ] Is the wording easy to understand for a first-time contributor?
- [ ] Are grammar and spelling reasonable?

**Links and Commands**
- [ ] Do all links point to real, working pages?
- [ ] Are commands accurate and safe to run?
- [ ] If repo links or scripts were changed, was `npm run check` run and did it pass?

**Formatting**
- [ ] Do file names and paths match what exists in the repository?
- [ ] Is formatting consistent with existing docs (headings, lists, code blocks)?
- [ ] Are code examples wrapped in proper fenced code blocks with a language tag?

**Content**
- [ ] Are examples helpful, practical, and easy to follow?
- [ ] Does the documentation match current project behavior?
- [ ] Is the change focused and easy to review in one sitting?

## Example Review Comment

> Thanks for the contribution! The guide is clear and easy to follow.
>
> One thing to check: could you confirm the example command still matches the current CLI output? You can verify by running `npm run check` locally.
>
> After that, this looks ready to merge. Nice work keeping it focused!