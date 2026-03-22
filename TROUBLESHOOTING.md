# Troubleshooting

Common issues when developing with this template. Each was discovered during production deployments and is encoded in the template to prevent recurrence.

## REST Table API returns 403

**Symptom:** Valid credentials and ACLs, but `GET /api/now/table/x_snc_example_item` returns 403.

**Cause:** Missing `CrossScopePrivilege` records. Scoped app tables require explicit cross-scope access grants for the REST Table API (which operates from global scope).

**Fix:** Ensure `src/fluent/privileges/cross-scope-privileges.now.ts` has 4 entries per table (read, create, write, delete) and that the table definition includes `allowWebServiceAccess: true`.

## Blank BYOUI page

**Symptom:** Navigating to `x_snc_example_app.do` shows a blank page or React doesn't mount.

**Causes:**
- Missing `<sdk:now-ux-globals></sdk:now-ux-globals>` in `src/client/index.html` — this tag injects ServiceNow globals (`window.g_ck`, session context) that React needs.
- JSX not compiled — run `npm run build` before `now-sdk install`.
- UiPage missing `direct: true` in `src/fluent/ui-pages/app-page.now.ts`.

## CSRF token errors (401/403 on POST/PATCH/DELETE)

**Symptom:** GET requests work but mutations fail with 401 or 403.

**Cause:** Missing `X-UserToken` header. ServiceNow requires the CSRF token for state-changing operations.

**Fix:** Include `'X-UserToken': window.g_ck` in all `fetch()` headers. The `g_ck` value is injected by `<sdk:now-ux-globals>`. See `src/client/services/ApiService.js` for the pattern.

**Important:** `GlideAjax` does **not** work in BYOUI pages — it fails silently. Always use `fetch()` to your Scripted REST API.

## Script Include not found at runtime

**Symptom:** REST API route throws "AppService is not defined" or similar.

**Cause:** Script Include instantiation uses the scoped API name, not the class name.

**Fix:** Use `var svc = new x_snc_example.AppService();` (with scope prefix), not `new AppService()`.

## Scope prefix mismatch after set-scope.sh

**Symptom:** Build succeeds but deploy creates duplicate records or fails.

**Fix:** After running `set-scope.sh`, also update:
1. `now.config.json` → `scope` field
2. `now.config.json` → `scopeId` (sys_id from the target instance's `sys_app` record)
3. Delete `src/fluent/generated/` and rebuild — the key registry maps to the old scope.

## now-sdk install fails with auth error

**Symptom:** `Error: Authentication failed` or `401 Unauthorized`.

**Fix:**
1. Re-run `now-sdk auth --add YOUR_ALIAS --type basic`
2. Verify the instance URL doesn't have a trailing slash
3. Ensure the user has the `admin` role on the target instance
4. For PDI instances, check that the instance is awake (they hibernate after inactivity)
