---
description: "Audit a component against all design system conventions (props, style, context, SFC, exports, story)"
allowed-tools: ["Read", "Glob", "Grep", "Bash"]
---

Audit the component at "$ARGUMENTS" against design system conventions.

## Steps

1. **Resolve the component** — find the directory under `src/ui/` matching `$ARGUMENTS`. Read ALL files in the component directory.

2. **Also read** `src/ui/index.ts` to check barrel exports.

3. **Run this checklist** and report pass/fail for each item:

### Props (`*.props.ts`)
- [ ] Props defined in separate `.props.ts` file (not inline in SFC)
- [ ] JSDoc comment on every prop
- [ ] `@default` tag on every prop
- [ ] Union literal types sorted alphabetically
- [ ] Boolean props use `is`/`has` prefix
- [ ] Form inputs extend shared interfaces from `@/types/input.type.ts` (if applicable)

### Style (`*.style.ts`)
- [ ] Uses `createXxxStyle` naming (NOT `xxxVariants`)
- [ ] Imports `tv` from `@/styles/tailwindVariants.lib` (NOT `tailwind-variants`)
- [ ] Has `slots` for multi-element components
- [ ] Has `variants` for configurable axes (size, variant, color)
- [ ] Has `compoundVariants` for dark mode adjustments
- [ ] Exports `XxxStyle` type via `ReturnType<typeof createXxxStyle>`

### Context (`*.context.ts`)
- [ ] Uses `useContext` factory from `@/composables/context.composable` (NOT manual Symbol + provide/inject)
- [ ] Interface extends `PropsToComputed<Props>` (if props are passed to children)
- [ ] Exports destructured `[useProvideXContext, useInjectXContext]`

### SFC (`*.vue`)
- [ ] Uses `<script setup lang="ts">`
- [ ] Uses `withDefaults(defineProps<Props>(), {...})`
- [ ] Defaults provided for every optional prop
- [ ] Defaults match `@default` JSDoc tags in props file
- [ ] Computes style and provides context (if has sub-components)
- [ ] Uses `toComputedRefs(props)` when providing context

### Exports (`index.ts`)
- [ ] All public components exported with `UI` prefix
- [ ] All prop types exported with `type` keyword and `UI` prefix
- [ ] Component listed in `src/ui/index.ts` (if meant to be public)

### Story (`*.story.ts`)
- [ ] Uses CSF3 format with `satisfies Meta<typeof Component>`
- [ ] Has `tags: ['autodocs']`
- [ ] Imports from `storybook/test` (NOT `@storybook/test`)
- [ ] Has `argTypes` for all props
- [ ] Default story has a `play` function
- [ ] Covers key states (disabled, loading, error as applicable)
- [ ] Has AllStates combo story

4. **Output a structured report** like:
   ```
   ## Component Review: {name}

   ### Props ✅ (6/6)
   ### Style ⚠️ (4/6)
   - FAIL: Uses old `xxxVariants` naming → rename to `createXxxStyle`
   - FAIL: Missing dark mode compound variants
   ### Context ✅ (3/3)
   ...
   ```

5. **Offer to fix** any failing items automatically. If the user agrees, make the changes and run `pnpm lint:fix && pnpm type-check`.
