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
  record ACLs apply to every caller; writes and deletes need the admin role; other scopes may only read the table.
- **CSRF:** the UI page sends the session token (`X-UserToken`) on every request.
- **Input validation:** the Script Include validates types, lengths and choice values before writing.
- **No secrets in source:** credentials stay in the OS keychain (`now-sdk auth`) or CI secrets; example MCP configs
  reference environment variables only.
- **Supply chain:** dependencies are pinned to exact versions with a committed lockfile and installed with `npm ci`;
  GitHub Actions are pinned to commit SHAs; Dependabot proposes updates weekly with no auto-merge; release packages
  carry a signed build-provenance attestation (`gh attestation verify <zip> --repo jschuller/sn-app-template`).

## Known advisories in development tooling

`npm audit` reports advisories in packages that `@servicenow/sdk` depends on (for example `undici` inside the SDK CLI).
They affect the developer's machine and CI while running the SDK, not the app installed on the instance, and are fixed by
SDK updates. Dependabot proposes those updates as they ship.
