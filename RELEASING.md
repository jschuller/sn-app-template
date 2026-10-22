# Releasing

How a version of this template is cut. Releases are manual and deliberate: each one is verified on a ServiceNow
instance first.

## Versioning

- `package.json` `version` is the single source of truth. It also becomes the app's `sys_app` version when installed.
- Tags are `vX.Y.Z`. The release workflow fails if the tag does not equal `v` + `package.json` version.
- [Semantic Versioning](https://semver.org/) for the template: **major** when apps built from an earlier version need
  manual changes to adopt it (renamed files, changed sys_ids, removed patterns), **minor** for new patterns or SDK
  upgrades, **patch** for fixes and docs.

## Pre-flight

On the release branch, with a clean tree:

1. `npm ci && npm run lint && npm test && npm run build:ci && npm run sync:skills -- --check`
2. Verify on an instance (a PDI is fine), in a scratch copy so the template scope stays `x_snc_example`:
   ```bash
   rsync -a --exclude node_modules --exclude .git ./ /tmp/sn-smoke/ && cd /tmp/sn-smoke && npm ci
   npm run setup -- --scope x_<vendor>_smoke --name "Template Smoke"
   npm run build && npm run deploy -- --auth <alias>
   npm run test:instance -- --auth <alias>
   ```
   Record the instance release and patch, and anything not verified, for the release notes.
3. Check `npm audit` and decide whether any advisory needs action before release.

## Cut the release

1. Set `version` in `package.json` (and run `npm install` to update the lockfile).
2. In `CHANGELOG.md`, move `[Unreleased]` entries under `## [X.Y.Z] - YYYY-MM-DD` and update the compare links.
3. Update the verified matrix in `docs/compatibility.md`.
4. Commit (`release: vX.Y.Z`), open a PR, wait for CI, merge.
5. Write the release notes (`notes.md`): a one-line summary in bold, then *Highlights*, *Security*, *Fixed*,
   *Upgrade notes*, and a closing line stating what was verified, on which SDK version and instance release.
6. Create the release from `main`:
   ```bash
   gh release create vX.Y.Z --target main --title "vX.Y.Z — <tagline>" --notes-file notes.md
   ```

## After the release

- The **Release** workflow attaches `target/<app>_<version>.zip` with a build-provenance attestation. Check it ran:
  `gh run list --workflow release.yml --limit 1`, and verify the asset:
  `gh attestation verify <zip> --repo jschuller/sn-app-template`.
- The packaged zip is a reference build of the template app. It installs only on instances whose vendor prefix is
  `snc`; everyone else builds their own app with `npm run setup`.
- Add an `## [Unreleased]` section back to `CHANGELOG.md` if it was removed.
