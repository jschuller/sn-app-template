# Troubleshooting

Problems seen while building, installing and testing apps from this template. Most were reproduced on a Brazil
Patch 0 instance with SDK 4.13.6; see [docs/compatibility.md](docs/compatibility.md).

## Install fails: "Unable to install third party application"

**Cause:** the app's scope uses another vendor's prefix. Instances install `x_<vendor>_…` apps only when `<vendor>` is
their own company code (system property `glide.appcreator.company.code`), so the template's default scope is refused.

**Fix:** `npm run setup -- --scope x_<your vendor>_<app> --name "<App Name>"`, then build and deploy again.

## Install fails: "Could not determine app installation status"

Install runs asynchronously and polls the instance. Check the execution tracker link the CLI prints (or
`sys_execution_tracker` on the instance). If the upload succeeded but polling failed, retry once with
`npm run deploy -- --auth <alias> --reinstall`. `--reinstall` uninstalls first, which deletes anything changed on the
instance that is not in source, including the records in the app's tables. Coding agents must get your explicit
approval before they run it (AGENTS.md rule 2).

## `now-sdk auth` or install fails with 401

1. Prefer OAuth: `npx now-sdk auth --add https://<instance>.service-now.com --type oauth --alias <alias>`.
2. Basic auth is restricted on new instances: the user needs `snc_basic_auth_api_access`, a valid MFA code (the CLI
   prompts for a TOTP code), or web-service-only access.
3. Changing the user's password revokes OAuth refresh tokens: run `auth --add` again.
4. Personal Developer Instances hibernate after inactivity. Wake the instance from developer.servicenow.com; until then
   APIs answer with an HTML login page.
5. Use `npx now-sdk …` (the project's pinned SDK), not an older global `now-sdk`.

## ATF: "Scheduled test/suite execution is disabled"

`npm run test:instance` drives the CI/CD API, which runs suites as scheduled executions. Set the system properties
`sn_atf.runner.enabled` and then `sn_atf.schedule.enabled` to `true` (a business rule refuses the second while the first
is false). Both are off on new PDIs.

## REST API returns 403

- **For the app's Scripted REST API** (`/api/<scope>/example_api/items`): the caller lacks the `<scope>.user` role, which
  the REST endpoint ACL requires on every route. Create needs the user role; update and delete need admin.
- **For the REST Table API** (`/api/now/table/<scope>_item`): the table needs `allowWebServiceAccess: true` and the
  caller must pass the table's read ACL. No `CrossScopePrivilege` is involved — earlier template versions said
  otherwise; that was disproved on Brazil.
- **Only mutations fail from the UI page:** the request lacks `X-UserToken: window.g_ck`. `ApiService.js` sends it on
  every request; keep `<sdk:now-ux-globals>` in `index.html`, which provides `g_ck`.

## A route ignores the ACL set on the RestApi

A route without its own `enforceAcl` gets the platform's "Scripted REST External Default" ACL, which overrides the API
level. Set `enforceAcl: [exampleApiAcl]` on each route.

## "Access to GlideRecord.update from scope … not allowed" (HTTP 500 or a failed ATF step)

The app runs with runtime access tracking **enforcing** (`now.config.json` → `accessControls.runtimeAccessTracking`),
so every platform script API it calls must be declared. Add the API named in the message as a `CrossScopePrivilege`
(`targetType: 'scriptable'`, `operation: 'execute'`, `targetScope: 'global'`) in
`src/fluent/privileges/cross-scope-privileges.now.ts`, then deploy.

**If the call is still refused after deploying:** the denied call made the platform create its own privilege record
with status *requested*, and installing the app keeps that record instead of your *allowed* one. Approve it (System
Applications → Application Cross-Scope Access, set Status to Allowed) or redeploy with `--reinstall` on a development
instance. `--reinstall` deletes the records in the app's tables; coding agents must get your explicit approval before
they run it (AGENTS.md rule 2).

Prefer to find these before deploying to a strict instance: run the app's flows and the ATF suite with
`runtimeAccessTracking: "permissive"` and check the log for `Security restricted: Execute operation on API '…' … was
granted` — but note that permissive recording on Brazil Patch 0 missed some APIs (`GlideRecord.setValue`,
`GlideRecord.update`) that enforcing then refused, so always finish with a run under enforcing.

## UI page is blank or stale

- Keep `<sdk:now-ux-globals></sdk:now-ux-globals>` in `src/client/index.html` (theming and `g_ck`).
- Keep `?uxpcb=$[UxFrameworkScriptables.getFlushTimestamp()]` on the script tag, or browsers may serve an old bundle.
- `UiPage` needs `direct: true` and an `endpoint` that starts with `<scope>_`.
- Do not use GlideAjax in UI pages; it fails silently. Call REST with `fetch()`.
- Check the browser console; the page reports API errors in an alert at the top.

## Build errors in `.now.ts` files

- `Unsupported statement in Fluent source file` / `Unsupported variable initializer`: Fluent files may only contain SDK
  calls and `export const x = SdkCall(...)`. Export the constant or inline the call.
- `Failed to parse property`: properties must be literals — no string concatenation (`'a' + 'b'`) or computed values.
- `--frozenKeys` failure in CI: run `npm run build` locally and commit `src/fluent/generated/keys.ts`.

## "AppService is not defined" at runtime

Script Includes are called by API name: `new x_snc_example.AppService()`. The file must still declare the class under
the Script Include's name: `var AppService = (function() { … return AppService; })();`. Each Script Include file
defines its own constants inside that function (`var FP = 'x_snc_example_';`); never rely on another file's constants.
