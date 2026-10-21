# Changelog

All notable changes to this template are recorded here, following [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versions follow [Semantic Versioning](https://semver.org/): a major version changes when an app built from an earlier
version needs manual work to adopt it.

## [Unreleased]

### Added
- Supply-chain baseline for CI and releases: `npm ci --ignore-scripts`, no npm cache in the release and
  instance-deploy jobs, Node 24.21.0 by exact version for releases, `.npmrc` `min-release-age=7`, Dependabot
  cooldowns (7 days, 14 for npm majors), job-level permissions and a zizmor job.
- ATF tests for the role split: a user with only `x_snc_example.user` may list and create but is denied update and
  delete (secured record steps and `AppService` 403s, `can_write`/`can_delete` false), and a user with only
  `x_snc_example.admin` may update (200) and delete (204, then 404), with `can_write`/`can_delete` true.

### Changed
- `SECURITY.md` explains the advisories reported in the SDK's development dependencies: they do not reach the
  installed app, are fixed by SDK updates, and are not overridden by default.

## [1.0.0] - 2026-10-10

> Brazil-ready, agent-neutral, verified on an instance.

### Added
- `AGENTS.md` as the single instruction file for coding agents (Claude Code, Codex, Pi, Copilot, Cursor); `CLAUDE.md`
  imports it.
- Agent skills `add-table` and `deploy-and-verify` in `.agents/skills/` (Agent Skills format), mirrored to
  `.claude/skills/` by `npm run sync:skills`, with a CI check.
- `npm run setup` (`scripts/setup.mjs`): cross-platform scope rename that also generates a new `scopeId`, resets the
  version and changelog, and clears record keys so each app gets its own sys_ids.
- REST endpoint ACL on every Scripted REST route; input validation, pagination (`limit`, `offset`) and proper status
  codes (200/201/204/400/403/404) in `AppService`.
- Runtime access tracking **enforcing** (`now.config.json` `accessControls`), with the nine platform APIs the code uses
  declared as cross-scope privileges — verified complete under enforcing on Brazil.
- Per-item `can_write` / `can_delete` in API responses; the UI page only offers edit and delete where the caller's ACLs
  allow, pages through items ("Load more"), and guards against double submits.
- ATF security test (a user without roles is denied) and a `TestSuite`; `npm run test:instance` runs it through
  `now-sdk cicd`.
- Inline edit of category and priority in the UI page; error messages from the API shown in the page.
- `npm run setup` refuses unsafe app names, refuses to run twice without `--force`, points badge and security links at
  the new repository, and leaves gitignored files alone.
- `docs/compatibility.md` (verified matrix, Brazil findings, SDK upgrade steps), CI workflow with frozen-key builds,
  release workflow with build-provenance attestation, Dependabot, issue forms, PR template, `RELEASING.md`.
- Example MCP configs for Claude Code and Pi that read credentials from environment variables; Codex snippet in README.

### Changed
- `@servicenow/sdk` 4.4.0 → 4.13.6, `@servicenow/glide` 27.0.4 → 27.0.5; React pinned to 18.2.0 as the SDK's UI page
  guide specifies; Node 24 in CI (`.nvmrc`).
- `AppService` does all CRUD with `GlideRecordSecure`; REST routes are thin wrappers.
- Table: `actions` object form (`{ read: true }`) — other scopes may read but not write; added a display column.
- Roles: no `$id` (derived from the name); admin contains user.
- Business rule now derives a default priority from the category (the category default lives on the column).
- UI page: `-polaris` class and `uxpcb` cache-buster per the SDK's UI page guide; split into small components styled with
  Horizon Design System variables.
- Demo records are demo data (`$meta.installMethod: 'demo'`).
- Application menu and modules require the user role; added a module for the UI page.
- `src/fluent/generated/keys.ts` is committed (the SDK's guidance); CI builds with `--frozenKeys`.
- ESLint 8 + the ServiceNow ESLint plugin → ESLint 10 flat config.
- Dependabot replaces the Renovate config (Renovate was never installed on the repository).

### Removed
- `set-scope.sh` (macOS-only), `now.config.schema.json` (stricter than the SDK's own schema), `.eslintrc`,
  `.env.example` (nothing read it), `.github/copilot-instructions.md` (Copilot reads `AGENTS.md`), `renovate.json`.
- The four `CrossScopePrivilege` records on the app's own table, and the claim that they prevent REST 403s.
  (The app's own tables need no privileges; the platform APIs it calls do.)
- Unused code: `AppService.getRecordCount`, the unused `created_date` column.

### Fixed
- REST routes bypassed the table ACLs (plain `GlideRecord`): any authenticated user could create, update and delete.
- Route parameters declared path parameters as required query parameters.
- The business rule's empty-category check never fired; the ATF test passed without exercising it.
- Updates could not set an empty description or clear values (truthiness checks).

### Security
- Every API route requires the app's user role, and record ACLs apply inside the API.
- MCP examples no longer contain a password field for `admin`; the MCP server version is pinned.

### Upgrade notes
For apps created from an earlier version of the template:
- Port the security fixes first: `GlideRecordSecure` in anything reachable from REST, and `enforceAcl` on every route.
- Removing `$id` from `Role()` changes the roles' sys_ids; keep your existing `$id` values if roles are already assigned
  to users on your instances.
- Removing the self-targeting `CrossScopePrivilege` records deletes them on the next install; this is safe.
- Turning on `runtimeAccessTracking: "enforcing"` refuses every platform API the app has not declared. Run your flows
  and ATF suite under enforcing on a development instance first (TROUBLESHOOTING.md explains the error and the
  *requested*-record trap), or leave the setting out to keep the SDK default (permissive).
- Commit `src/fluent/generated/keys.ts` and switch CI to `npm run build:ci`.

Verified on SDK 4.13.6 / Brazil Patch 0: lint, frozen-key build, setup on a scratch copy, install and reinstall over
OAuth, 2/2 ATF tests and every REST route's status codes with runtime access enforcing and no denials, and HTTP 403 for
a user without the app role on the Scripted REST API and the Table API. The UI page was built and linted but not
exercised in a browser.

[Unreleased]: https://github.com/jschuller/sn-app-template/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/jschuller/sn-app-template/releases/tag/v1.0.0
