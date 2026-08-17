# How to Review Someone's First Pull Request

Reviewing a first-time contributor's pull request (PR) is one of the most valuable things you can do for an open-source community[reference:3]. A kind, clear review can turn a nervous beginner into a long-term contributor.

This guide will help you provide a review that is helpful, encouraging, and effective.

---

## The Mindset: Be a Guide, Not a Gatekeeper

Remember what it was like to make your first PR. The goal is to help the contributor succeed, not to find flaws. Use the language you would use with a teammate: be courteous, positive, encouraging, clear, and approachable[reference:4].

---

## A Review Checklist

Before you start, read the PR description fully to understand the intent[reference:5]. Then, use this checklist as a starting point[reference:6]:

- [ ] **Does the PR have a clear summary of what changed?**
    - If not, ask: *"Can you add a brief summary of what this PR does?"*
- [ ] **Does it link to the relevant issue?**
    - If not, ask: *"Can you add `Closes #123` to the description so the issue closes automatically?"*
- [ ] **Does it include a testing or verification section?**
    - For this project, check if the contributor ran `npm run check` and included the output[reference:7].
    - If not, ask: *"Great start! Can you please run `npm run check` and paste the output into the PR description? That will help us verify the change."*
- [ ] **Is the change focused and small?**
    - A good first PR is small and easy to review[reference:8]. If it's too large, ask: *"This PR covers a lot. Could you split it into smaller, more focused PRs?"*
- [ ] **Are there any obvious errors in grammar or language?**
    - Point them out kindly: *"Small suggestion: can we change 'its' to 'it's' here?"*

---

## Giving Your Feedback

When you're ready to comment:

1.  **Start with something positive.** Acknowledging their effort goes a long way.
    - *Example:* *"Thanks for opening this PR! This is a great first step."*
2.  **Be specific and actionable.** Explain what needs to change and why.
    - *Example:* *"The focus style looks great. Could you also add a similar style for the 'select' elements to keep it consistent?"*
3.  **Ask for clarification or proof.**
    - *Example:* *"Nice work! Can you add the output of `npm run check` so we can confirm everything passes?"*[reference:9]
4.  **Frame corrections positively.**
    - *Example:* *"This is close. The wording is a little hard for beginners. Can you rewrite it with one command per step?"*[reference:10]
5.  **Use GitHub's "Start a review" feature.** This allows you to add multiple comments and then submit them all at once with a summary[reference:11].

---

## How to Submit Your Review

1.  Once you've added your inline comments, click the green **"Review changes"** button at the top of the PR page[reference:12].
2.  **Leave a summary comment.** This is a great place to give an overall positive remark before listing your specific suggestions.
3.  Select **"Comment"** if you're just giving feedback, or **"Approve"** if the PR is ready to be merged.

---

## Example: A Full Review Comment

Here's what a kind and complete review might look like:

> *"Hi @new-contributor, thanks for opening this PR! This is a great addition to the docs.*
>
> *I have a few small suggestions:*
> *1. The new guide looks great. Could you also add a link to it from the main README?*
> *2. Can you run `npm run check` and paste the output here to confirm everything passes?*
>
> *Once those are done, I think this will be ready to merge. Thanks again for your contribution!"*

---

## Next Steps

After you've reviewed and the PR is merged, you've helped someone take a huge step in their open-source journey. This is how communities grow!
