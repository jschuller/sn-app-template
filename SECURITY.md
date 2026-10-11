# Security policy

## Reporting a vulnerability

Report vulnerabilities privately through
[GitHub Security Advisories](https://github.com/jschuller/sn-app-template/security/advisories/new).
Do not open a public issue.

- Acknowledgement within 48 hours, assessment within a week.
- Include the template version, SDK version, instance release, and steps to reproduce. Never include credentials or
  customer data.

## Supported versions

| Version | Supported |
|---|---|
| 1.x | Yes |
| < 1.0 | No |

## What the template does

- **Least privilege by default:** REST routes require the app's user role; data access uses `GlideRecordSecure`, so
  record ACLs apply to every caller; writes and deletes need the admin role; other scopes may only read the table; the
  app runs with runtime access tracking *enforcing* and declares each platform API it uses.
- **CSRF:** the UI page sends the session token (`X-UserToken`) on every request.
- **Input validation:** the Script Include validates types, lengths and choice values before writing.
- **No secrets in source:** credentials stay in the OS keychain (`now-sdk auth`) or CI secrets; example MCP configs
  reference environment variables only.
- **Supply chain:** dependencies are pinned to exact versions with a committed lockfile and installed with `npm ci`;
  GitHub Actions are pinned to commit SHAs; Dependabot proposes updates weekly with no auto-merge; release packages
  carry a signed build-provenance attestation (`gh attestation verify <zip> --repo jschuller/sn-app-template`).

## Known advisories in development tooling

`npm audit` and the repository's Dependabot alerts list advisories, some rated high or critical, in packages that
`@servicenow/sdk` depends on: for example `handlebars`, `fastify`, `js-yaml`, `joi` and `undici`. They are all
*development* dependencies of the SDK's own tooling (UI bundling and its development server, templating, SBOM
generation, HTTP calls to the instance). They run on the developer's machine and in CI while the SDK runs. None of them
is part of the app installed on the instance: the package `now-sdk pack` builds contains only the app's metadata, its
server scripts and the UI bundle (React and the code in `src/client`).

How the template handles them:

- **Fixed by SDK updates.** The SDK is pinned to an exact version, so its dependencies move only when ServiceNow
  publishes a new SDK. Dependabot opens one grouped pull request for the `@servicenow/*` packages when it does; such a
  pull request is merged after the build and a test-instance deployment pass, like any SDK upgrade
  ([docs/compatibility.md](docs/compatibility.md)).
- **No `overrides` by default.** Forcing versions the SDK was not released with can break builds and installs in ways
  that are hard to trace. If a critical advisory is still open after the next SDK release, patched versions may be
  pinned through npm `overrides` in a release that is verified on an instance first.
- **Reducing exposure meanwhile:** run the SDK only on projects and instances you trust.

An advisory in a package that does reach the instance (React, or code in `src/`) is a vulnerability in this template:
report it as described above.
