# @wisemen/skills-cli

Sync AI coding skills from installed `@wisemen/*` packages into a consumer project, rendered per LLM target.

## What it does

When a `@wisemen/*` package ships a `skills/` folder in its tarball (see the authoring contract at `docs/packages/_meta/authoring-skills.md`), `wisemen-skills sync` pulls those skills into your project and renders them for each LLM you use — e.g. `.claude/skills/wisemen/<pkg>/<skill>/SKILL.md` for Claude Code, a fenced section in `AGENTS.md` for Codex/Aider, and an `llms.txt` summary index.

Skill versions track the installed package version automatically: if you bump `@wisemen/vue-core-api-utils` from `1.1.0` to `1.2.0`, the next sync picks up the 1.2.0 skills.

## Install

```bash
pnpm add -D @wisemen/skills-cli
```

Add to your root `package.json`:

```jsonc
{
  "scripts": {
    "skills:sync": "wisemen-skills sync",
    "skills:check": "wisemen-skills check",
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

## Configuration

Optional `wisemen-skills.config.{ts,js,json}` at repo root:

```ts
import type { Config } from '@wisemen/skills-cli'

export default {
  targets: ['claude', 'agents-md', 'llms-txt'],
  claude: { outDir: '.claude/skills/wisemen' },
  agentsMd: { path: 'AGENTS.md' },
  llmsTxt: { path: 'llms.txt' },
  packages: {
    unscoped: ['formango'],  // non-@wisemen packages that ship skills
  },
} satisfies Config
```

Defaults match the example above — config is only needed to override.

## Commands

| Command | Purpose |
|---------|---------|
| `wisemen-skills sync` | Scan `node_modules/@wisemen/*`, render all enabled adapters, write the lockfile. |
| `wisemen-skills check` | Same scan, but exits non-zero if any output would change (use in CI). |
| `wisemen-skills list` | Print the discovered skills per package. |

Flags (all commands): `--target <names>`, `--dry-run`, `--silent`, `--verbose`, `--cwd <path>`.

## Authoring skills (for `@wisemen/*` package maintainers)

See `docs/packages/_meta/authoring-skills.md` in this repo.
