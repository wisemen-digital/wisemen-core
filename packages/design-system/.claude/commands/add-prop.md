---
description: "Add a prop to an existing component (e.g., /add-prop button isGhost: boolean)"
allowed-tools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash"]
---
# Add Prop

Add a new prop to an existing component, updating all files consistently.

Arguments: `$ARGUMENTS` (format: `component-name propName: type`)

1. Read `.claude/skills/add-prop/SKILL.md` — follow it exactly
2. Parse arguments to extract component name, prop name, and type
3. Execute the skill steps
4. Run `pnpm lint:fix && pnpm type-check`
5. Report which files were modified
