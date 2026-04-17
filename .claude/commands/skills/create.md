# Create Shared Skill

Create shared skills through the canonical repo workflow.

1. Read `AGENTS.md`, `CLAUDE.md`, and `.agents/templates/skills/authoring-guide.md`.
2. Create the skill in `.agents/skills` with `pnpm skills:init --template <knowledge|workflow|scripted> --name <skill-name>`.
3. Edit the generated canonical files only.
4. Run `pnpm skills:check`.
5. Summarize the canonical changes and note that `.claude/skills` was generated.
