# AGENTS.md — ServiceNow scoped app (now-sdk + Fluent)

Instructions for AI coding agents (Claude Code, Codex, Pi, Copilot, Cursor, …) working in this repository.
Human-facing docs are in `README.md`; Claude Code–specific notes are in `CLAUDE.md`.

## What this is

A ServiceNow scoped application built entirely from source with the ServiceNow SDK (`now-sdk`, Fluent).
Three source layers, one deploy:

| Layer | Path | What it holds |
|---|---|---|
| Fluent metadata | `src/fluent/**/*.now.ts` | Tables, roles, ACLs, REST API, script include and UI page declarations, business rules, menus, demo data, ATF tests |
| Server logic | `src/server/*.server.js` | Script Include code (`AppService`), bundled with `Now.include()` |
| Client UI | `src/client/**` | A React UI page (BYOUI) bundled by the SDK: `index.html` → `app.jsx` → `components/` + `services/` |

Request flow: React page → `fetch()` with `X-UserToken: window.g_ck` → Scripted REST API (`/api/x_snc_example/example_api/items`)
→ `x_snc_example.AppService` → `GlideRecordSecure` (table ACLs apply to the caller).

## Commands

```bash
npm ci                                   # install exact dependency versions
npm run lint                             # ESLint (client, server, scripts)
npm run build                            # compile Fluent + bundle the UI (writes src/fluent/generated/keys.ts)
npm run build:ci                         # build --frozenKeys: fails if keys.ts is stale (CI uses this)
npm run deploy -- --auth <alias>         # now-sdk install to a dev/test instance
npm run test:instance -- --auth <alias>  # run the "Example App" ATF suite on the instance
npx now-sdk explain <topic> --format=raw # SDK docs for the installed version (see below)
npx now-sdk query <table> -q '<query>' -o json --auth <alias>  # read live instance data
```

Always use the project-local SDK (`npx now-sdk` / `npm run …`), never a global `now-sdk` or `npx @servicenow/sdk@latest`:
the docs and behaviour must match the pinned version in `package.json`.

## Orient with `now-sdk explain` first

The SDK ships version-matched documentation (about 260 topics). Before writing or changing Fluent code, look it up instead
of guessing property names:

```bash
npx now-sdk explain --list --format=raw                 # all topics
npx now-sdk explain <term> --list --peek --format=raw   # search
npx now-sdk explain table --format=raw                  # read one (e.g. table, acl, restapi, uipage, test, keys-file)
```

Run `npx now-sdk <command> --help` before using any subcommand flag for the first time. ServiceNow's official agent skill
for the SDK (`now-sdk`, from github.com/ServiceNow/sdk) teaches the same workflow; see README → "AI coding agents".

## Rules

1. **Scope prefix everywhere.** Tables, fields, roles, REST paths and UI page endpoints start with `x_snc_example`
   (`x_snc_example_item`, `x_snc_example_name`, `x_snc_example.user`, `x_snc_example_app.do`). A new app runs
   `npm run setup -- --scope x_<vendor>_<app> --name "<Name>"` once; never hand-edit the scope.
2. **Never delete a `Table()`, `Record()`, `BusinessRule()` or other record definition without asking the user.**
   Removing it from source makes the next install delete it on the instance (tracked in `keys.ts`). Use `Now.del()` /
   `npx now-sdk explain now-del-guide` when deletion is intended.
3. **Commit `src/fluent/generated/keys.ts`.** It maps every `Now.ID[...]` key to a stable sys_id. Never edit it by hand,
   never rename an existing `Now.ID` key (that creates a new record and orphans the old one). CI builds with `--frozenKeys`.
4. **Fluent files are declarative.** Every top-level statement must be an SDK call or an `export const x = SdkCall(...)`;
   plain `const` declarations, string concatenation in properties and other statements fail the build. Use one string
   literal per property.
5. **Script Includes load independently.** Each `.server.js` file defines its own constants (`var FP = 'x_snc_example_';`);
   globals from one Script Include are not visible in another. Call them by API name: `new x_snc_example.AppService()`.
6. **Data access goes through `GlideRecordSecure`** in anything reachable from REST or the UI, so ACLs apply to the caller.
   Plain `GlideRecord` bypasses ACLs; use it only where elevated access is intended and say why in a comment.
7. **REST routes stay thin** and delegate to `AppService`, which validates input and returns `{ status, body }`.
   Put `enforceAcl` on **every** route: a route without it gets the platform default ACL, which overrides the API-level one.
8. **UI pages call REST with `fetch()`; GlideAjax does not work in UI pages.** Send `X-UserToken: window.g_ck` on every
   request. `index.html` keeps `<sdk:now-ux-globals>`, `class="-polaris"` and the `?uxpcb=$[UxFrameworkScriptables.getFlushTimestamp()]`
   cache-buster on the script tag; no DOCTYPE; write `$[AMP]` for `&` in HTML text. Import CSS from JS; no CSS modules.
   No build configs (webpack/vite) — the SDK bundles the client.
9. **Secrets never go in source.** Use `Property({ type: 'password2' })` with a `// @fluent-disable-sync` comment and set the
   value on the instance. No credentials in `.env`, `.mcp.json`, scripts or commit messages; `now-sdk auth` keeps
   credentials in the OS keychain.
10. **Instances refuse other vendors' prefixes.** An install of `x_<vendor>_…` fails with "Unable to install third party
   application" unless `<vendor>` is the instance's `glide.appcreator.company.code`. If the scope is still the
   template's default (`package.json` version 1.x and name `example-app`), run `npm run setup` before deploying.

## Recipes (details: `npx now-sdk explain <topic>`)

- **Add a table:** follow the `add-table` skill (`.agents/skills/add-table/SKILL.md`): `Table()` in `src/fluent/tables/`,
  four record ACLs, `AppService` methods, REST routes, an ATF test, then register the file in `src/fluent/index.now.ts`.
  Use the object form `actions: { read: true }` — it controls *cross-scope* access, so grant writes only when another scope
  needs them. Keep `allowWebServiceAccess: true` if the REST Table API must reach the table.
- **Add a Script Include:** code in `src/server/<Name>.server.js` (`Class.create()` pattern), declaration in
  `src/fluent/script-includes/` with `script: Now.include('../../server/<Name>.server.js')`, `apiName: 'x_snc_example.<Name>'`,
  `accessibleFrom: 'package_private'` unless other scopes call it.
- **Add a REST route:** add to the `routes` of `src/fluent/rest-api/app-api.now.ts` with its own `$id`, `method`, `path`
  (`{param}` for path params, read via `request.pathParams`), and `enforceAcl: [exampleApiAcl]`.
- **Add a UI page:** an HTML entry in `src/client/` (same head as `index.html`), a JSX entry, and a `UiPage({ endpoint:
  'x_snc_example_<name>.do', html: imported, direct: true })` in `src/fluent/ui-pages/`. For record-centric lists and forms,
  the SDK's `ui-page-guide` recommends `@servicenow/react-components` (`NowRecordListConnected`, `RecordProvider`); this
  template's page deliberately shows the Scripted REST + `fetch()` pattern.
- **Call a platform API you have not used before** (a new `GlideRecord` method, `GlideDateTime`, `RESTMessageV2`, …):
  the app runs with runtime access tracking **enforcing** (`now.config.json` → `accessControls`), so the call fails with
  `Access to <API> from scope x_snc_example not allowed` until it is declared. Add a `CrossScopePrivilege`
  (`targetType: 'scriptable'`, `operation: 'execute'`, `targetScope: 'global'`, `targetName: '<API>'`) to
  `src/fluent/privileges/cross-scope-privileges.now.ts`, then deploy and run the ATF suite. The app's own tables never
  need a privilege.
- **Add an ATF test:** `Test()` in `src/fluent/tests/` and add it to the `TestSuite` there. Server steps
  (`recordInsert`, `recordValidation`, `runServerSideScript`, `createUser` with `impersonate`, …) need no REST auth profile.
  Every step gets its own `$id`. ATF rolls back the data a test creates.

## Done means

- `npm run lint` and `npm run build` pass, and `keys.ts` changes are committed with the code that caused them.
- For behaviour changes: deployed to a dev instance and `npm run test:instance` passes; new behaviour has an ATF test.
- Docs that describe the change (`README.md`, this file, `TROUBLESHOOTING.md`, `CHANGELOG.md` under `[Unreleased]`)
  are updated in the same change.

## Versioning and releases (template repository only)

`package.json` `version` is the single source of truth (it also becomes the app's `sys_app` version). Releases are
`vX.Y.Z` tags created with `gh release create`; the release workflow checks that the tag matches `package.json`.
See `RELEASING.md`. Derived apps reset the version to `0.1.0` in `npm run setup`.
