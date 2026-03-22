# ServiceNow App Template — AI Coding Instructions

This is a ServiceNow scoped app built with the now-sdk Fluent API. Three source layers:

- `src/fluent/*.now.ts` — Metadata-as-code (tables, ACLs, roles, REST API, UI pages)
- `src/server/*.server.js` — Script Includes (server-side business logic)
- `src/client/*.jsx` — BYOUI React pages (client-side UI)

## Scope Convention

All table, field, and API names use the scope prefix `x_snc_example_`. When adding new resources, always use this prefix.

## Critical Patterns

1. **BYOUI pages use fetch(), NOT GlideAjax** — GlideAjax fails silently in React/BYOUI context. Use `fetch()` with `X-UserToken: window.g_ck` for CSRF protection.

2. **Script Includes load independently** — Globals from one SI are NOT visible in others. Define scope prefix constants (`FP`, `TP`) in EVERY `.server.js` file.

3. **CrossScopePrivileges required for REST Table API** — Without them, REST returns 403 even with valid ACLs. Need 4 privileges per table (read/create/write/delete).

4. **Now.include() bundles .server.js at build time** — Script Include declarations in Fluent reference server files via `script: Now.include('../../server/MyService.server.js')`.

5. **UiPage uses direct: true** — SDK compiles JSX bundle inline via Rollup+SWC. HTML files use `<sdk:now-ux-globals>` to inject ServiceNow globals.

6. **Tables need allowWebServiceAccess: true** — Required for REST Table API access.

## Build & Deploy

```bash
npm run build        # Compiles JSX, validates Fluent
now-sdk install      # Deploys everything to ServiceNow instance
```
