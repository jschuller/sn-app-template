## What and why
<!-- What does this change, and why? Link the issue if there is one. -->

## How it was tested
<!-- Build, lint, and — for behaviour changes — the instance release/patch and ATF result. -->

## Checklist
- [ ] `npm run lint` and `npm run build` pass
- [ ] `src/fluent/generated/keys.ts` changes are included (no hand edits)
- [ ] No `Table()`/`Record()` definitions removed without saying so above
- [ ] Behaviour changes have an ATF test, and were run on a test instance
- [ ] `AGENTS.md`, `README.md`, `TROUBLESHOOTING.md` updated where they describe the change
- [ ] `CHANGELOG.md` has a line under `[Unreleased]`
- [ ] No secrets, credentials, instance passwords or customer data
