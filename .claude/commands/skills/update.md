# Update Shared Skill

Update shared skills through the canonical repo workflow.

1. Read `AGENTS.md`, `CLAUDE.md`, and `.agents/templates/skills/authoring-guide.md`.
2. Edit only `.agents/skills` or `.agents/templates/skills` unless the task explicitly targets another location.
3. Do not hand-edit `.claude/skills`.
4. Run `pnpm skills:check`.
5. Report any validation failures or sync drift before finishing.
