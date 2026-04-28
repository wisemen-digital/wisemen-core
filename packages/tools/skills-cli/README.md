# @wisemen/skills-cli

Sync AI coding skills from installed `@wisemen/*` packages into a consumer project, rendered per LLM target.

## What it does

When a `@wisemen/*` package ships a `skills/` folder in its tarball, `wisemen-skills sync` pulls those skills into your project and renders them for each LLM you use:

- **Claude Code** — `.claude/skills/wisemen/<pkg>/<skill>/SKILL.md`
- **AGENTS.md** — a fenced `<!-- wisemen-skills:start/end -->` section (hand-written content outside the markers is preserved)
- **llms.txt** — a single index file following the emerging cross-LLM standard

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
# wisemen-skills — synced output (regenerated on pnpm install)
.claude/skills/wisemen/
.wisemen-skills.lock.json
llms.txt
```

If your `AGENTS.md` is fully managed by `wisemen-skills sync` (no hand-written content outside the markers), you can gitignore it too. Otherwise keep it tracked — the tool preserves content outside its markers.

## Monorepo support

The CLI auto-detects monorepo workspace roots. When you run `wisemen-skills sync` from anywhere inside a workspace, it walks up from the current directory looking for `pnpm-workspace.yaml` or a `package.json` with a `workspaces` field, and syncs to that root.

```
maes/                            ← workspace root (auto-detected)
├── .claude/skills/wisemen/      ← all skills rendered here
│   ├── vue-core-api-utils/
│   ├── formango/
│   └── INDEX.md
├── AGENTS.md
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
| `--target <names>` | sync, check | Comma-separated adapter targets: `claude`, `agents-md`, `llms-txt`. Default: all. |
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

Optional `wisemen-skills.config.{ts,mts,mjs,js,json}` at project root. If multiple exist, the first match in that order wins.

```ts
import type { Config } from '@wisemen/skills-cli'

export default {
  // Which adapters to render. Default: all three.
  targets: ['claude', 'agents-md', 'llms-txt'],

  // Output paths per adapter. Values shown are the defaults.
  claude: { outDir: '.claude/skills/wisemen' },
  agentsMd: { path: 'AGENTS.md' },
  llmsTxt: { path: 'llms.txt' },

  packages: {
    // Allowlist — null means "all @wisemen/* packages". Set to an array
    // to restrict to specific packages.
    allow: null,

    // Denylist — exclude specific packages from discovery.
    deny: [],

    // Non-@wisemen-scoped packages that ship skills.
    // Default: ['formango'] (because formango is published without the @wisemen scope).
    unscoped: ['formango'],
  },
} satisfies Config
```

All fields are optional — config is only needed to override defaults.

## Programmatic API

The package exports a `build-manifest` subpath for producer packages:

```ts
import { buildManifest, writeManifest } from '@wisemen/skills-cli/build-manifest'

// In-memory manifest from a skills directory
const manifest = buildManifest({ skillsDir: './skills' })

// Write manifest.json to disk
writeManifest({ skillsDir: './skills', manifestPath: './skills/manifest.json' })
```

Or run it as a standalone script:

```bash
node node_modules/@wisemen/skills-cli/dist/build-manifest-bin.mjs --skills ./skills --out ./skills/manifest.json
```

## Authoring skills (for `@wisemen/*` package maintainers)

See [`docs/packages/_meta/authoring-skills.md`](../../docs/packages/_meta/authoring-skills.md) in this repo.
