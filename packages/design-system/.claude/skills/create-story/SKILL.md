---
description: "Generate a Storybook story (CSF3) for a component with play functions, argTypes, and state/size/variant stories"
allowed-tools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash"]
---

Generate a Storybook story for the component "$ARGUMENTS".

## Steps

1. **Find the component** — resolve `$ARGUMENTS` to a component directory under `src/ui/`. Read:
   - The `.props.ts` file to understand all props and their types
   - The `.vue` file to understand slots, behavior, and template structure
   - The `.style.ts` file to understand available variants/sizes

2. **Read the canonical story example** for reference:
   - `src/ui/text-field/textField.story.ts`

3. **Generate `{camelName}.story.ts`** in the component directory with:

   **Meta:**
   ```ts
   import type { Meta, StoryObj } from '@storybook/vue3-vite'
   import { expect, userEvent, within } from 'storybook/test'
   ```
   - `title: 'Components/{PascalName}'`
   - `tags: ['autodocs']`
   - `component: {PascalName}`
   - `argTypes` derived from props:
     - Boolean props → `control: 'boolean'`
     - String props → `control: 'text'`
     - Union types → `control: 'select', options: [...]`
     - Each with `description` from JSDoc

   **Stories to include:**
   - `Default` — sensible args, play function testing basic interaction
   - `Disabled` (if `isDisabled` prop exists) — verify disabled state
   - `Loading` (if `isLoading` prop exists) — show loading state
   - `Error` (if `errorMessage` prop exists) — verify error display and aria-invalid
   - Per-size stories (if `size` prop exists) — one story per size value
   - `AllStates` — render function showing all states side by side
   - `AllSizes` — render function showing all sizes side by side
   - `AllVariants` (if `variant` prop exists) — render function showing all variants

   **Play function conventions:**
   - Use `within(canvasElement)` to scope queries
   - Query by role or label, not test IDs
   - Use `userEvent` for interactions, `expect` for assertions
   - Test accessibility attributes (aria-invalid, aria-required, disabled)

   **Render function conventions:**
   - Use `ref` for v-model values
   - Use `class="w-72"` or `class="w-64"` for consistent widths
   - Wrap multiple components in `<div class="flex flex-wrap gap-4">`

4. **Run:** `pnpm lint:fix`
