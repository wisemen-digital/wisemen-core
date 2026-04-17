# Shared Skill Authoring Guide

Use this guide when creating or updating any managed skill in `.agents/skills`.

## Goals

- Keep one canonical skill source that works for Codex and can be projected to Claude.
- Keep instructions compact enough to preserve context budget.
- Prefer reusable references and scripts over oversized `SKILL.md` files.

## Template Choice

- `knowledge`: Explain stable domain knowledge, rules, constraints, and references.
- `workflow`: Guide a multi-step task where the agent should follow a consistent process.
- `scripted`: Wrap a fragile workflow around bundled scripts or commands.

## Required Rules

- Start from `pnpm skills:init --template <template> --name <skill-name>`.
- Keep `SKILL.md` frontmatter limited to `name` and `description`.
- Make `description` concrete and include `Use when ...`.
- Keep `SKILL.md` at 500 lines or fewer.
- Use imperative writing.
- Put detailed examples, policies, or schemas in `references/`.
- Link only to real repo files.
- Keep `agents/openai.yaml` present and in sync with the skill body.

## Cross-Agent Notes

- Codex consumes the canonical `.agents/skills` folders directly.
- Claude consumes the generated mirror in `.claude/skills`.
- Gemini uses `GEMINI.md` plus `.gemini/commands/skills/*.toml` to drive the same canonical workflow.

## Validation

- Run `pnpm skills:validate` to check managed skills.
- Run `pnpm skills:sync` after canonical skill edits.
- Run `pnpm skills:check` before commit and before asking another agent to use the skill.
