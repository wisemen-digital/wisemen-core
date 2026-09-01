# @wisemen/danger

Reusable [Danger JS](https://danger.systems/js/) rules and a composite GitHub Action for
running them, built for monorepos laid out as `apps/api` + `apps/web` (or any number of
`apps/<name>` folders).

## Installation

The action installs its own dependencies, but you can also add the package directly:

```bash
pnpm add -D danger @wisemen/danger
```

## Usage

Danger already runs for you as part of the [general project "build & test"
workflow](https://github.com/wisemen-digital/devops-github-actions/blob/v1/Docs/project-build-and-test.md) -
there's no need to add anything to your own workflows.

This runs once per PR and posts a single combined comment - see "Scoped configuration" below
for how a monorepo splits its rules across root/api/web without multiple workflow runs.

## Configuring rules

By default, no rules are enabled - Danger runs but posts nothing (see "Built-in rules" below
for the full list, which will grow over time). Add a `dangerfile.ts` (or `.js`) at your repo
root to enable/disable rules or add your own. Export `configureDanger` to tweak global config
and toggle rules, and/or `rules` to add project-specific rules:

```ts
// dangerfile.ts
import type { DefaultConfig, Rule } from '@wisemen/danger'

export function configureDanger (config: DefaultConfig): DefaultConfig {
  config.rules['changelog-updated'] = { enabled: true }

  return config
}

export const rules: Record<string, Rule> = {
  // your custom rules
}
```

## Scoped configuration for monorepos

You can configure Danger **three ways** in a monorepo with `apps/api` and `apps/web`:

| File                        | Scope                    |
|------------------------------|---------------------------|
| `dangerfile.ts`               | Whole repo (root)         |
| `apps/api/dangerfile.ts`       | `apps/api/**` only         |
| `apps/web/dangerfile.ts`       | `apps/web/**` only         |

Each dangerfile is discovered automatically - you opt a folder in just by adding the file
there, nothing else needs registering. All discovered dangerfiles run in the same process
against the same PR, so their output accumulates into **one combined comment**.

A rule scoped to `apps/api` (or any non-root scope) is **skipped entirely** when the PR
doesn't touch that folder - so enabling `conventional-commits` in `apps/api/dangerfile.ts`
will fail a PR that changes `apps/api/**` with a bad commit message, but will not fail (or
even run) a web-only PR. The root dangerfile is never skipped - it always sees the whole
repo.

```ts
// apps/api/dangerfile.ts
import type { DefaultConfig } from '@wisemen/danger'

export function configureDanger (config: DefaultConfig): DefaultConfig {
  config.rules['conventional-commits'] = { enabled: true, checkCommitMessages: true }

  return config
}
```

Rules receive the resolved `scope` (`''` for root, e.g. `'apps/api'` otherwise) and
pre-filtered `scopedFiles` (`modified`/`created`/`deleted`/`edited`/`all`) on their
`RuleContext`, so custom rules can stay scope-agnostic:

```ts
export const myRule = createRule('my-rule', 'My Rule', '...', async ({ scopedFiles }) => {
  const touchedMigrations = scopedFiles.edited.filter(f => f.includes('/migrations/'))
  // ...
})
```

The built-in `changelog-updated` rule derives its default target from scope too:
`dangerfile.ts` looks for `CHANGELOG.md`, `apps/api/dangerfile.ts` looks for
`apps/api/CHANGELOG.md`, and so on - override with `config.rules['changelog-updated'].changelogPath`
if you need something else.

## Built-in rules

All built-in rules are disabled by default - enable the ones you want via `config.rules` in
`configureDanger` (see "Configuring rules" above).

- `changelog-updated` - fails if the scope's `CHANGELOG.md` wasn't updated with a complete
  `### Description` / `### Migration` entry.
- `conventional-commits` - warns on commits that don't follow
  [Conventional Commits](https://www.conventionalcommits.org/).
