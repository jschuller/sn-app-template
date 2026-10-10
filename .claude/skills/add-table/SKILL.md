---
name: add-table
description: Add a new table to this ServiceNow app end to end — Fluent Table(), record ACLs, AppService methods, Scripted REST routes, an ATF test and registration. Use when the user asks for a new table, entity, record type or data model in this now-sdk project.
---

# Add a table

Work through every step; a table without ACLs, tests or registration is not done. Check property names with
`npx now-sdk explain table --format=raw` (and `acl`, `restapi`, `test`) rather than guessing.

Names below use `widget` as the example entity; keep the project's scope prefix (`x_snc_example` unless `npm run setup`
changed it — read `scope` from `now.config.json`).

1. **Table** — create `src/fluent/tables/widget.now.ts`:
   - `export const x_snc_example_widget = Table({ name: 'x_snc_example_widget', label, display, schema: { … } })`
   - every column name starts with `x_snc_example_`; pick column types from `npx now-sdk explain --list` (`*column-api`)
   - `allowWebServiceAccess: true` only if the REST Table API must reach it
   - `actions: { read: true }` (object form; controls cross-scope access — add writes only if another scope needs them)
2. **ACLs** — in `src/fluent/acls/`, one `Acl()` per operation (`read`, `create`, `write`, `delete`), `type: 'record'`,
   `table: 'x_snc_example_widget'`, `roles: [exampleUserRole]` or `[exampleAdminRole]` imported from `../roles/app-roles.now`.
3. **Service** — add methods to `src/server/AppService.server.js` (or a new Script Include, see AGENTS.md). Use
   `GlideRecordSecure`, validate input, return `{ status, body }` like the existing item methods.
4. **REST routes** — add routes to `src/fluent/rest-api/app-api.now.ts` (`/widgets`, `/widgets/{sys_id}`), each with its
   own `$id` and `enforceAcl: [exampleApiAcl]`; scripts only call the service and `svc.send(response, result)`.
5. **ATF test** — add a `Test()` to `src/fluent/tests/` that inserts a record, validates it, exercises the service
   methods via `runServerSideScript` (use `assertEqual`), and add it to the `TestSuite`. Every step gets a unique `$id`.
6. **Register** — `export * from './tables/widget.now'` in `src/fluent/index.now.ts` (other files import by side effect).
7. **Verify** — `npm run lint && npm run build`; commit the `src/fluent/generated/keys.ts` changes with the code.
   If an instance is available, run the `deploy-and-verify` skill.
8. **Docs** — add the table to the "What gets deployed" table in `README.md` and a line under `[Unreleased]` in
   `CHANGELOG.md`.
