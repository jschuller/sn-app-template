---
name: deploy-and-verify
description: Build, deploy and verify this ServiceNow app on a development instance — lint, build, now-sdk install, the ATF suite through now-sdk cicd, and REST smoke checks. Use when the user asks to deploy, install, push to an instance, run ATF tests, or check that a change works on ServiceNow.
---

# Deploy and verify

Deploy only to a development or test instance the user named, with a `now-sdk auth` alias they created. Never to
production (production gets the published app through the App Repo: `npx now-sdk explain ci-integration`). Never print,
log or store credentials.

1. **Pre-flight** — `npm run lint && npm run build`. Fix errors before deploying. Confirm the scope in `now.config.json`
   carries the target instance's vendor prefix (instances refuse other vendors' prefixes; `npm run setup` renames it).
2. **Find the alias** — `npx now-sdk auth --list`; ask the user which alias to use if more than one fits.
3. **Install** — `npm run deploy -- --auth <alias>`. Install is asynchronous; the CLI prints a rollback link on success.
   On "Could not determine app installation status", retry once with `--reinstall` after telling the user it removes
   instance-only changes to the app. On "Unable to install third party application", see step 1.
4. **ATF** — `npm run test:instance -- --auth <alias> -o json`. If it answers "Scheduled test/suite execution is disabled",
   the instance needs `sn_atf.runner.enabled` and then `sn_atf.schedule.enabled` set to `true` — ask the user before
   changing instance properties. Report the pass/fail counts and the result URL.
5. **REST smoke** (optional) — in a browser session on the instance, the UI page `x_snc_example_app.do` must list items;
   a user without `x_snc_example.user` must get HTTP 403 from `/api/x_snc_example/example_api/items`.
6. **Report** — what was installed (version from `package.json`), the ATF result, and anything not verified.
