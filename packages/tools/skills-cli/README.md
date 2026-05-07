# @wisemen/skills-cli

Sync AI coding skills from installed `@wisemen/*` packages into a consumer project.

## What it does

When a `@wisemen/*` package ships a `skills/` folder in its tarball, `wisemen-skills sync` pulls those skills into your project and renders them for each LLM you use:

- **SKILLS** — `.agents/skills/packages@<pkg>@<skill>/SKILL.md`

Skill versions track the installed package version automatically: bump `@wisemen/vue-core-api-utils` from `1.1.0` to `1.2.0` and the next sync picks up 1.2.0 skills.

## Install

```bash
pnpm add -D @wisemen/skills-cli
```

Add to your **root** `package.json`:

```jsonc
{
  "scripts": {
    "skills:sync": "wisemen-skills sync",
    "skills:check": "wisemen-skills check",
    // Auto-sync on install. "|| true" ensures pnpm install never fails due to sync.
    "postinstall": "wisemen-skills sync --silent || true"
  }
}
```

## `.gitignore`

Synced output is a derived artifact and should not be committed. Add to your `.gitignore`:

```gitignore
.agents/skills/package@*
```

## Monorepo support

The CLI auto-detects monorepo workspace roots. When you run `wisemen-skills sync` from anywhere inside a workspace, it walks up from the current directory looking for `pnpm-workspace.yaml` or a `package.json` with a `workspaces` field, and syncs to that root.

```
maes/                            ← workspace root (auto-detected)
├── .agents/skills/      ← all skills rendered here
│   ├── @packages@wisemen-vue-core-api-utils-.../
│   ├── formango/
├── apps/
│   ├── web/
│   └── admin/
└── package.json                 ← postinstall: wisemen-skills sync
```

Use `--cwd <path>` to override auto-detection and sync to a specific directory.

## Commands

| Command | Purpose |
|---------|---------|
| `wisemen-skills sync` | Scan `node_modules/@wisemen/*`, render all enabled adapters, write the lockfile. Idempotent — re-runs produce zero mutations if nothing changed. |
| `wisemen-skills check` | Same scan, but exits non-zero if any output would change. Use in CI. |
| `wisemen-skills list` | Print the discovered skills per package with descriptions. |

### Flags

| Flag | Commands | Description |
|------|----------|-------------|
| `--dry-run` | sync | Print changes without writing files. |
| `--silent` | all | Suppress informational output. |
| `--verbose` | sync, check | Print every file that would change. |
| `--cwd <path>` | all | Project root. Default: auto-detected workspace root, or current directory. |

### Exit codes

| Code | Meaning |
|------|---------|
| `0` | Success (sync/list) or in-sync (check). |
| `1` | Drift detected (check) or runtime error. |

## Configuration

Optional `wisemen-skills.config.json` at project root. If multiple exist, the first match in that order wins.

```json
{
  "packages": {
    // Allowlist — null means "all @wisemen/* packages". Set to an array
    // to restrict to specific packages.
    "allow": null,

    // Denylist — exclude specific packages from discovery.
    "deny": [],

    // Non-@wisemen-scoped packages that ship skills.
    // Default: ['formango'] (because formango is published without the @wisemen scope).
    "unscoped": ["formango"],
  },
}
```

All fields are optional — config is only needed to override defaults.


## Authoring skills (for `@wisemen/*` package maintainers)

See [`docs/packages/_meta/authoring-skills.md`](../../docs/packages/_meta/authoring-skills.md) in this repo.
