# Claude Skill Workflow

Follow [AGENTS.md](./AGENTS.md) for all shared-skill work.

- Create and edit shared skills only in `.agents/skills`.
- Use `.agents/templates/skills` as the required source for new skills.
- Do not hand-edit `.claude/skills`; regenerate it with `pnpm skills:sync`.
- Finish every skill change with `pnpm skills:check`.
