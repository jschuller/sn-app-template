# Contributing

Contributions are welcome. This template aims to stay minimal and opinionated — it demonstrates one validated pattern per concept rather than covering every possibility.

## What belongs here

- Bug fixes to existing patterns
- New Fluent API patterns not yet demonstrated (e.g., UI Actions, Client Scripts, Scheduled Jobs)
- Improvements to CLAUDE.md or troubleshooting docs
- Build/CI improvements

## What doesn't belong here

- Application-specific business logic (fork the template instead)
- Alternative approaches to patterns already demonstrated
- Dependencies beyond what the SDK requires

## Process

1. Fork the repo
2. Create a feature branch from `main`
3. Make your changes — follow existing naming conventions and scope prefix pattern
4. Run `npm run build` to verify Fluent compilation
5. Open a PR with a clear description of what pattern is added/fixed and why

## Scope prefix

All new tables, fields, and APIs must use the `x_snc_example_` prefix. The `set-scope.sh` script handles renaming for users who fork the template.
