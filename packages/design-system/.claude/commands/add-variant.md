---
description: "Add a variant value to an existing component (e.g., /add-variant button ghost)"
allowed-tools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash"]
---
# Add Variant

Add a new variant value to an existing component's props, style, and story.

Arguments: `$ARGUMENTS` (format: `component-name variant-value`)

1. Read `.claude/skills/add-variant/SKILL.md` — follow it exactly
2. Parse arguments to extract component name and variant value
3. Execute the skill steps
4. Run `pnpm lint:fix && pnpm type-check`
5. Report which files were modified
