# Contributing

Contributions are welcome. The template stays small and opinionated: one verified pattern per concept, not every
possible variation.

## What belongs here

- Fixes to existing patterns, and corrections to anything the docs claim that turns out to be wrong
- New Fluent patterns not yet demonstrated (for example UI actions, client scripts, scheduled scripts, flows) —
  open a pattern request first
- Improvements to `AGENTS.md`, the agent skills, troubleshooting and compatibility notes
- CI and release improvements

## What does not

- Application-specific business logic (create your own repository from the template instead)
- A second way of doing something the template already demonstrates
- Dependencies beyond what the SDK and the tooling need

## Process

1. Fork, then branch from `main`.
2. `npm ci`, make the change, keep the `x_snc_example` scope prefix.
3. `npm run lint && npm test && npm run build`; commit any `src/fluent/generated/keys.ts` changes with the code.
4. If you changed `.agents/skills/`, run `npm run sync:skills`.
5. For behaviour changes, deploy to a test instance (under a scope with your vendor prefix — `npm run setup` on a
   scratch copy) and run the ATF suite. Say which release and patch you tested in the PR.
6. Add a line under `[Unreleased]` in `CHANGELOG.md`.

Releases are cut by the maintainer; see [RELEASING.md](RELEASING.md).
