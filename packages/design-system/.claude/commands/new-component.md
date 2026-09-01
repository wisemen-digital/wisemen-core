---
description: Interactive workflow to scaffold a complete new component
allowed-tools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash"]
---
# New Component

Scaffold a new design system component interactively.

## Step 1: Gather Requirements

Ask the user these questions (wait for answers before proceeding):

1. **Name**: What should the component be called? (e.g., "toggle", "tag", "progress-bar")
2. **Type**: Is this a:
   - Regular component (like Badge, Card)
   - Form input (like TextField, NumberField — has label, error, hint)
   - Sub-component of an existing component (like CardFooter, BadgeAction)
3. **Reka UI**: Does it wrap a Reka UI primitive? If so, which one?
4. **Props**: What props does it need? (variants, sizes, colors, booleans)
5. **Parts**: Does it need sub-components? (e.g., Header, Footer, Content)

## Step 2: Confirm Plan

Present the plan before generating:
```
Component: UI{PascalName}
Directory: src/ui/{kebab-name}/
Files to create:
  - {camelName}.props.ts
  - {camelName}.style.ts
  - {camelName}.context.ts (if has parts)
  - {PascalName}.vue
  - {camelName}.story.ts
  - index.ts
  - {SubPart}.vue (for each sub-component)
Props: [list]
Variants: [list]
Export: src/ui/index.ts
```

Wait for user confirmation.

## Step 3: Generate

Based on the type, read and follow the appropriate skill:
- Regular: `.claude/skills/create-component/SKILL.md`
- Form input: `.claude/skills/create-form-input/SKILL.md`
- Sub-component: `.claude/skills/create-sub-component/SKILL.md`

Follow the skill instructions exactly.

## Step 4: Validate

Run `pnpm lint:fix && pnpm type-check` and fix any issues.

## Step 5: Summary

Report what was created and suggest `pnpm storybook` to verify.
