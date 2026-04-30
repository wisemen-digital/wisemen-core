---
description: "Create a new design system component with all required files (props, style, context, SFC, story, barrel exports)"
allowed-tools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash"]
---

Create a new design system component named "$ARGUMENTS".

## Steps

1. **Derive names** from the argument:
   - Folder: `kebab-case` (e.g., "date picker" → `date-picker`)
   - Component: `PascalCase` (e.g., `DatePicker`)
   - Camel: `camelCase` for file prefixes (e.g., `datePicker`)

2. **Before generating**, ask the user:
   - What props does the component need? (variants, sizes, colors, booleans)
   - Does it need sub-components (parts pattern)?
   - Does it wrap a Reka UI primitive?

3. **Read these reference files** to match the exact patterns:
   - `src/ui/badge/badge.context.ts` — context pattern with `useContext` factory
   - `src/ui/badge/badge.props.ts` — props interface pattern
   - `src/ui/badge/badge.style.ts` — style pattern with `tv()`
   - `src/ui/badge/Badge.vue` — SFC pattern with `withDefaults`, `toComputedRefs`, provide context
   - `src/ui/button/button/button.style.ts` — slots/variants/compoundVariants reference
   - `src/ui/text-field/textField.story.ts` — comprehensive story reference

4. **Create files** in `src/ui/{kebab-name}/`:

   **`{camelName}.props.ts`** — Props interface with:
   - JSDoc comment + `@default` on every prop
   - Union literals sorted alphabetically
   - Boolean props with `is`/`has` prefix

   **`{camelName}.style.ts`** — Style definition:
   - `import { tv } from '@/styles/tailwindVariants.lib'`
   - `export const create{PascalName}Style = tv({ slots: {...}, variants: {...}, compoundVariants: [...] })`
   - `export type {PascalName}Style = ReturnType<typeof create{PascalName}Style>`
   - Include dark mode compound variants

   **`{camelName}.context.ts`** — Context:
   - `import { useContext, type PropsToComputed } from '@/composables/context.composable'`
   - Interface extending `PropsToComputed<Props>` with computed variants
   - `export const [useProvide{PascalName}Context, useInject{PascalName}Context] = useContext<{PascalName}Context>('{camelName}Context')`

   **`{PascalName}.vue`** — Main SFC:
   - `<script setup lang="ts">`
   - `withDefaults(defineProps<Props>(), {...})` with defaults for all optional props
   - Compute style, provide context
   - Template using style slots

   **`{camelName}.story.ts`** — Storybook stories:
   - Meta with `title: 'Components/{PascalName}'`, `tags: ['autodocs']`, `argTypes` for all props
   - Default story with play function
   - State stories (Disabled, Loading, etc. as applicable)
   - AllStates and AllSizes/AllVariants combo stories

   **`index.ts`** — Barrel exports:
   - `export { type {PascalName}Props as UI{PascalName}Props } from './{camelName}.props'`
   - `export { default as UI{PascalName} } from './{PascalName}.vue'`

5. **Add export** to `src/ui/index.ts`:
   - `export * from './{kebab-name}'`
   - Keep exports sorted alphabetically

6. **Run validation:**
   ```
   pnpm lint:fix && pnpm type-check
   ```
   Fix any issues until both pass.
