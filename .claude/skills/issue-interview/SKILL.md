---
name: issue-interview
description: Turn one GitHub issue into a spec an agent can build from — read the issue and the code, ask the user what is unclear, write the spec into the issue and label it ready. Use when the user runs /issue-interview <number> or asks to spec, refine or make an issue ready.
argument-hint: "<issue number>"
disable-model-invocation: true
---

# Issue interview

Edits the issue only: no code, branch or instance changes.

1. **Read.** `gh issue view $ARGUMENTS --comments`. Read the code it touches, and the `AGENTS.md` rules and
   `npx now-sdk explain` topics that apply. If the issue already has a `## Spec` section, review that instead of
   starting over.
2. **Interview.** Ask the user only what the code and the issue cannot answer: behaviour, edge cases, roles and ACLs,
   data to keep, what is out of scope. Ask a few questions per round and offer a recommended answer for each. Stop
   when every acceptance criterion can be tested.
3. **Write the spec** into the issue body under `## Spec` (`gh issue edit $ARGUMENTS --body-file <file>`; keep the
   original text above it):
   - **Goal:** one sentence.
   - **Acceptance criteria:** numbered, each testable (ATF step, `npm test`, or a REST call and its status code).
   - **Changes:** files and Fluent objects to add or change; new ACLs, roles and cross-scope privileges.
   - **Out of scope** and **open questions** (none left when it is labelled ready).
4. **Label.** Show the spec, then on the user's yes add the label `ready`
   (`gh issue edit $ARGUMENTS --add-label ready`; if the label does not exist, create it with
   `gh label create ready --description "Spec agreed; ready to build"`).
