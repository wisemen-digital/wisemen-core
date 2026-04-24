---
"@wisemen/skills-cli": minor
---

Initial release. CLI that pulls AI coding skills from installed `@wisemen/*` packages and renders them per LLM target (Claude Code, `AGENTS.md`, `llms.txt`).

- `wisemen-skills sync` — scan `node_modules/@wisemen/*`, render skills to all configured adapters, write a `.wisemen-skills.lock.json` lockfile.
- `wisemen-skills check` — exits non-zero if any output would change (use in CI).
- `wisemen-skills list` — print the discovered skills per package.
- Adapters: `claude` (`.claude/skills/wisemen/<pkg>/<skill>/SKILL.md`), `agents-md` (fenced section in `AGENTS.md`), `llms-txt` (per-package summary).
- Programmatic `build-manifest` helper for producer packages to emit `skills/manifest.json`.

See [`docs/packages/_meta/authoring-skills.md`](../docs/packages/_meta/authoring-skills.md) for the producer-side contract.
