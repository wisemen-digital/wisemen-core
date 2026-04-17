---
name: skill-authoring
description: Maintain the shared agent skill system for this repository, including canonical skills, template updates, validation, and Claude sync. Use when creating or updating a managed skill in `.agents/skills` or `.agents/templates/skills`.
---

<!-- skill-template: knowledge@1 -->

# Shared Skill Authoring

## Scope

Maintain the managed cross-agent skill system in this repository.

This skill covers canonical skills in `.agents/skills`, templates in `.agents/templates/skills`, Claude projections in `.claude/skills`, and agent entrypoints in `.claude/commands/skills` and `.gemini/commands/skills`.

## Use

- Start every new managed skill from `pnpm skills:init --template <knowledge|workflow|scripted> --name <skill-name>`.
- Keep `SKILL.md` frontmatter limited to `name` and `description`.
- Make the description explicit about triggers and include `Use when ...`.
- Keep `SKILL.md` concise and move large supporting material into `references/`.
- Update `agents/openai.yaml` whenever the skill intent changes.

## Rules

- Edit canonical skills in `.agents/skills`; do not hand-edit `.claude/skills`.
- Run `pnpm skills:check` after every managed skill change.
- Leave `packages/**/skills` alone unless the task explicitly targets package-published skill assets.
- Keep links inside skills pointing at real files.

## References

- `.agents/templates/skills/authoring-guide.md`
- `AGENTS.md`
- `CLAUDE.md`
- `GEMINI.md`
