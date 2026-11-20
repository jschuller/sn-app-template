---
name: find-issues
description: Scan this ServiceNow app for problems worth an issue — bugs, missing ACLs or tests, rule breaks, stale docs — with parallel read-only sub-agents, then propose issues and file only the ones the user picks. Use when the user runs /find-issues or asks what needs fixing in the repository.
argument-hint: "[area or question to focus on]"
disable-model-invocation: true
---

# Find issues

Read only until the user picks: the scan changes no file, branch or instance.

1. **Scope.** If `$ARGUMENTS` names an area or a question, scan only that. Otherwise scan the five areas below.
2. **Scan in parallel.** Start one read-only sub-agent (Explore) per area, in a single message. Give each one its
   area, `AGENTS.md`'s rules, and this instruction: report findings with `file:line`, the evidence, and why it matters;
   no guesses; no fixes.
   - **Metadata and security:** `src/fluent/**` — tables, ACLs, roles, cross-scope privileges, `keys.ts` drift.
   - **Server code:** Script Includes and `*.server.js` — validation, `GlideRecordSecure`, error handling.
   - **REST API:** Scripted REST routes — `enforceAcl` on every route, status codes, input checks.
   - **Client:** `src/client/**` — `fetch()` not GlideAjax, error states, accessibility.
   - **Tests, CI and docs:** ATF tests and `tests/` against the code; CI workflow; README, AGENTS.md and CHANGELOG
     against what the code does.
3. **Check before proposing.** Read each finding's cited lines yourself. Drop what you cannot confirm, and drop
   duplicates of open issues (`gh issue list --state open --limit 100`).
4. **Propose.** One table: title, area, evidence (`file:line`), severity (bug / risk / cleanup), size (S/M/L).
   Then ask which ones to file.
5. **File only the picked ones** with `gh issue create --title … --body …`. Each body: what is wrong, the evidence,
   and what done looks like. Add no label other than `bug` or `enhancement`; specs come from `/issue-interview`.
