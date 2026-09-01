---
description: "Add a new prop to an existing component, updating all 5 files consistently (props, SFC defaults, style, context, story)"
allowed-tools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash"]
---

Add a new prop to an existing component. Arguments: "$ARGUMENTS" (format: "component-name propName: type", e.g., "button isGhost: boolean" or "badge color: 'error' | 'success' | 'warning'").

Adding a prop touches up to 5 files. This skill ensures all are updated consistently.

## Steps

1. **Parse arguments** — extract:
   - Component name (kebab-case folder under `src/ui/`)
   - Prop name (camelCase)
   - Prop type (TypeScript type)
   - Determine if it's a boolean (`is`/`has` prefix), a variant (union type), or a data prop

2. **Read ALL component files:**
   - `*.props.ts` — current props interface
   - `*.style.ts` — current style definition (if variant-related)
   - `*.context.ts` — current context interface (if prop is passed to children)
   - `*.vue` — current SFC with `withDefaults`
   - `*.story.ts` — current stories with `argTypes`

3. **Update `*.props.ts`:**
   - Add the prop to the interface in **alphabetical position** among same-category props
   - Add JSDoc comment with description
   - Add `@default` tag with the default value
   - If union type, sort members alphabetically: `'error' | 'success' | 'warning'`
   - If boolean, ensure `is`/`has` prefix

4. **Update `*.vue`** (`withDefaults`):
   - Add default value to the `withDefaults()` call
   - Default MUST match the `@default` JSDoc tag
   - For booleans: default is typically `false`
   - For optional strings/objects: default is typically `null`
   - For union types: default is the most common/neutral value

5. **Update `*.style.ts`** (if the prop is a variant):
   - Add a new variant axis to the `variants` object
   - Style each slot that needs variant-specific classes
   - Add `compoundVariants` for dark mode if other variants have dark mode entries
   - Update the computed style in the `.vue` file to pass the new variant

6. **Update `*.context.ts`** (if the prop needs to reach sub-components):
   - The prop is automatically included if the context extends `PropsToComputed<Props>`
   - If the context has a manually defined interface, add the prop as `ComputedRef<Type>`

7. **Update `*.story.ts`:**
   - Add to `argTypes`:
     - Boolean → `control: 'boolean', description: '...'`
     - String → `control: 'text', description: '...'`
     - Union → `control: 'select', options: [...], description: '...'`
     - Number → `control: 'number', description: '...'`
   - If it's a variant, add/update `AllVariants` story
   - Update existing stories' args if the new prop changes default behavior

8. **Run validation:**
   ```
   pnpm lint:fix && pnpm type-check
   ```
   Fix any issues until both pass.

## Checklist before done
- [ ] Props file: JSDoc + `@default` present
- [ ] Props file: alphabetical position correct
- [ ] Props file: union members sorted alphabetically
- [ ] SFC: `withDefaults` has matching default
- [ ] Style: variant added (if applicable)
- [ ] Style: dark mode compound variants added (if applicable)
- [ ] Context: updated (if sub-components need it)
- [ ] Story: `argTypes` updated
- [ ] Story: new variant story added (if applicable)
- [ ] `pnpm lint:fix` passes
- [ ] `pnpm type-check` passes
