@AGENTS.md

## Claude Code notes

- Project skills live in `.claude/skills/` (mirrored from `.agents/skills/` by `npm run sync:skills`; edit the
  `.agents/skills/` copy). Use `add-table` to add a table end to end and `deploy-and-verify` to deploy and test.
- ServiceNow's official SDK skill is a plugin: `/plugin install servicenow-sdk@claude-plugins-official`. It teaches the
  `npx now-sdk explain` workflow that `AGENTS.md` relies on.
- Optional instance access through MCP: copy `.mcp.json.example` to `.mcp.json` (gitignored) and export the
  `SERVICENOW_*` variables it references. Keep it read-only unless a task needs writes.
- Personal notes (instance names, local doc caches) go in `CLAUDE.local.md`, which is gitignored.
