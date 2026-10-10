# Compatibility and upgrades

This page records what the template is verified against, what changed in the ServiceNow **Brazil** release and in
`@servicenow/sdk` 4.5–4.13 that matters to app builders, and how to take future SDK and platform upgrades safely.

## Verified matrix

| Template | SDK | Instance | Verified |
|---|---|---|---|
| v1.0.0 | 4.13.6 | Brazil Patch 0 (`glide-brazil-08-25-2026__patch0`) | Build, install, 2/2 ATF tests, REST/ACL probes (2026-10-10) |
| v1.0.0 | 4.13.6 | Australia, Zurich | Not verified. The app uses no Brazil-only features, so it is expected to work; report issues |

"Verified" means: `npm run lint`, `npm run build:ci`, `npm run setup` on a scratch copy, `now-sdk install` over OAuth,
`now-sdk cicd testsuite run` (both tests pass), a user without the app role getting HTTP 403 from the Scripted REST
API and the REST Table API, and every Scripted REST route returning its documented status codes.
The UI page was not exercised in a browser for v1.0.0.

## Findings from the Brazil verification

These came out of installing the app on a Brazil Patch 0 instance and are encoded in the template:

1. **Instances refuse other vendors' scope prefixes.** Installing the template's own `x_snc_example` scope failed with
   `Unable to install third party application 'x_snc_example'`. A scope must use the instance's vendor prefix
   (`glide.appcreator.company.code`, shown as the company code on PDIs). This is why `npm run setup` comes first.
2. **`now-sdk install` works over OAuth in 4.13.6.** SDK 4.13.0 failed to upload the app zip when authenticated with
   OAuth; 4.13.6 installs and upgrades cleanly with an OAuth (authorization code + PKCE) alias.
3. **Route-level ACLs override the API-level one.** A Scripted REST route without `enforceAcl` gets the platform's
   "Scripted REST External Default" ACL, which replaces the ACL set on the `RestApi`. Every route sets
   `enforceAcl: [exampleApiAcl]`.
4. **The app's own tables need no cross-scope privileges.** Earlier versions shipped four `CrossScopePrivilege` records
   targeting the app's own table "to prevent REST 403". Removing them changed nothing: the REST Table API still served
   records to an authorized user, and still returned 403 to a user without the app role. Table API access is governed
   by `allowWebServiceAccess` and the ACLs.
5. **Platform APIs used from the scope do need privileges where runtime access is enforced.** With the app's runtime
   access tracking left permissive, the platform logged
   `Security restricted: Execute operation on API 'GlideRecordSecure.getValue' … was granted` and allowed the call.
   The template declares that privilege so the app also works where access is enforced.
6. **ATF via `now-sdk cicd` needs two properties.** `sn_atf.runner.enabled` and then `sn_atf.schedule.enabled` must be
   `true` (a business rule refuses the second while the first is false). Fresh PDIs ship with both off.

## Brazil release notes that matter to app builders

Brazil entered early availability on 2026-09-24. ServiceNow's own pages disagree on the general-availability date
(October vs. November 2026), so check the [release notes landing page](https://www.servicenow.com/docs/r/release-notes/rn-learn-landing-page.html)
for the current status.

- **Studio absorbs the ServiceNow IDE.** Studio gains source-file editing and source control; the separate IDE
  experience is being folded in ([ServiceNow Developer blog](https://www.servicenow.com/community/developer-passport-blog/so-you-re-getting-yourself-a-brazil-pdi-what-s-different/ba-p/3592342),
  [deprecations](https://www.servicenow.com/docs/r/release-notes/rn-summary-deprecated-info.html)). Apps built here stay
  editable from source; a workspace can clone this repository.
- **Choices can merge instead of replace.** `now.config.json` `legacyChoices: false` makes the SDK emit `sys_choice_v2`
  (additive merge with tracked removals), supported on Brazil, Australia Patch 4+ and Zurich Patch 11+. The template keeps
  the default (`true`, delete-and-insert) because it works on every release; switch when all target instances support v2.
- **Basic authentication is restricted on new instances.** Basic auth to REST APIs succeeds only for web-service-only
  users, users with a valid MFA code, or users with `snc_basic_auth_api_access`. Prefer OAuth for `now-sdk auth`, MCP
  servers and CI. Basic-auth prompts in the SDK now ask for a TOTP code when MFA is on.
- **OAuth client credentials for CI.** `now-sdk install` and `now-sdk cicd` accept `SN_SDK_*` environment variables
  (`npx now-sdk explain ci-integration`). The SDK requires the OAuth application user to be an `admin` with
  **Identity Type = Human**, which conflicts with ServiceNow's guidance to make integration accounts Machine
  identities — use a dedicated user and restrict it to the test instance.
- **Build Agent custom skills and rules.** Build Agent (ServiceNow's in-instance AI) can load custom skills from the
  `sn_build_agent_skill` tables (`npx now-sdk explain sdlc-guide`). Build Agent and external agents can work on the same
  app when the source lives in Git.
- **ACL features worth using.** Deny-unless ACLs (`decisionType: 'deny'`) and query ACLs (`query_match`,
  `query_range`) are available through the Fluent `Acl()` API (`npx now-sdk explain security-guide`). They predate
  Brazil but are the recommended way to harden sensitive tables.

## SDK 4.4 → 4.13 changes reflected in the template

| Change | SDK | Template impact |
|---|---|---|
| `explain` command (versioned docs for agents) | 4.6 | `AGENTS.md` sends agents to `npx now-sdk explain` before writing Fluent |
| ESLint plugin no longer needed (published as an empty stub) | 4.5 | Removed `@servicenow/eslint-plugin-sdk-app-plugin` and ESLint 8; ESLint 10 flat config |
| `query` command (read live records) | 4.8 | Documented for agents |
| `cicd` command (ATF suites, App Repo publish/install/rollback) | 4.10 | `npm run test:instance`, optional CI job |
| `TestSuite()` | 4.11 | ATF tests grouped into the "Example App" suite |
| `Table({ actions })` object form; array form deprecated | 4.x | `actions: { read: true }` |
| `Role` `$id` deprecated (derived from `name`) | 4.x | Roles have no `$id`; role sys_ids changed (see CHANGELOG upgrade notes) |
| `keys.ts` should be committed; `build --frozenKeys` for CI | 4.x | `keys.ts` committed; CI uses `npm run build:ci` |
| Install is asynchronous by default; OAuth install fix | 4.12 / 4.13 | Verified install over OAuth on Brazil |

## Upgrading the SDK in an app built from this template

1. Read the release notes: [github.com/ServiceNow/sdk/releases](https://github.com/ServiceNow/sdk/releases).
2. Bump `@servicenow/sdk` (and `@servicenow/glide` to the version the SDK's templates use) to exact versions;
   `npm install`.
3. Re-orient: `npx now-sdk explain --list --format=raw` and re-read the topics for the APIs the app uses (look for
   "deprecated").
4. `npm run lint && npm run build`. Review the `src/fluent/generated/keys.ts` diff: new keys are expected for new
   records; changed sys_ids for existing records mean an install would create duplicates — stop and investigate.
5. Deploy to a test instance, run `npm run test:instance`, and only then merge.

## Watch list (next releases)

- **Canada** (expected 2027, per community sources; not confirmed by ServiceNow): re-run the verification above on the
  first available patch.
- `legacyChoices` default: if the SDK flips it to `false`, choice handling on older instances changes.
- React version for UI pages: the SDK's UI page guide pins React 18.2.0 while `now-sdk init` scaffolds React 19; the
  template follows the guide until they agree.
- Server-side JavaScript modules (`@servicenow/glide` imports) are now the SDK's recommended way to write business rule
  and REST handler scripts; the template keeps a Script Include for portability and testability from ATF.
