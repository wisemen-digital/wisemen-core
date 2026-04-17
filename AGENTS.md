# Agent Instructions

This repository uses a managed cross-agent skill system.

## Canonical Locations

- Author and edit shared skills in `.agents/skills`.
- Scaffold new shared skills from `.agents/templates/skills`.
- Treat `.claude/skills` as generated output. Do not hand-edit it.
- Keep legacy package-published skills under `packages/**/skills` unchanged unless the task explicitly targets them.

## Required Workflow

1. Pick one template archetype: `knowledge`, `workflow`, or `scripted`.
2. Scaffold with `pnpm skills:init --template <template> --name <skill-name>`.
3. Keep `SKILL.md` frontmatter limited to `name` and `description`.
4. Put long reference material in `references/` instead of bloating `SKILL.md`.
5. Run `pnpm skills:check` after every create or update.

## Shared Conventions

- Keep skill bodies concise and imperative.
- Make descriptions explicit about trigger conditions and include `Use when ...`.
- Add or update `agents/openai.yaml` for every managed skill.
- Keep `.gemini/commands/skills/*` and `.claude/commands/skills/*` aligned with the canonical skill workflow.
