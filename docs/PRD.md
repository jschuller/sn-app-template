# Product requirements: <app name>

The design document for this app: what it is for and how to tell it works. Agents read it before a feature
(`CLAUDE.md`); keep it short and current. Replace every `<…>` after `npm run setup`.

## Purpose

<One or two sentences: the problem, for whom, and what changes when the app is in use.>

## Users and roles

| Role | Who | May |
|---|---|---|
| `<scope>.user` | <who> | <list, create, …> |
| `<scope>.admin` | <who> | <update, delete, configure> |

## Scope

- In: <the records, pages and APIs this app owns>
- Out: <what it leaves to other apps or to the platform>

## Requirements

| # | Requirement | Acceptance (an ATF test or a check anyone can run) |
|---|---|---|
| 1 | <what the app must do> | <how it is shown to work> |

## Data

<Tables the app adds or reads, and where seed data comes from (Fluent `Record()`, never a `.env` loader).>

## Open questions

- <a decision not made yet, and who makes it>
