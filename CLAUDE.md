@AGENTS.md

## Claude Code notes

- Project skills live in `.claude/skills/` (mirrored from `.agents/skills/` by `npm run sync:skills`; edit the
  `.agents/skills/` copy). Use `add-table` to add a table end to end and `deploy-and-verify` to deploy and test.
  `/find-issues` scans the repository with read-only sub-agents and proposes issues; `/issue-interview <n>` turns
  an issue into a spec and labels it `ready`. Both start only when you type them.
- ServiceNow's official SDK skill (`now-sdk`, from ServiceNow/sdk) teaches the `npx now-sdk explain` workflow that
  `AGENTS.md` relies on. If it is already installed as a user skill (`~/.claude/skills/now-sdk`), do not also install
  the plugin (`servicenow-sdk@claude-plugins-official`): it is the same skill twice. Otherwise install one of them.
- Optional instance access through MCP: copy `.mcp.json.example` to `.mcp.json` (gitignored) and fill in the instance
  and the secret-store item. It starts the server through a launcher that reads the API key from the OS secret store,
  so no credential is in the file or in the shell. Keep it read-only unless a task needs writes.
- The app's purpose, users and acceptance criteria go in `docs/PRD.md`; read it before a feature, and update it when
  the scope changes.
- Personal notes (instance names, local doc caches) go in `CLAUDE.local.md`, which is gitignored.
