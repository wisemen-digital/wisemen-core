---
description: "Add a sub-component (parts pattern) to an existing component, updating context, style slots, and exports"
allowed-tools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash"]
---

Add a sub-component (parts pattern) to an existing component. Arguments: "$ARGUMENTS" (format: "parent-component sub-component-name", e.g., "badge badge-action" or "card card-footer").

## Before You Start

Read these reference files to match exact patterns:
- `src/ui/button/button/ButtonIcon.vue` — sub-component injecting parent context + using style slot
- `src/ui/button/button/button.context.ts` — context with `InjectionKey`, `provide`, `inject`
- `src/ui/button/index.ts` — barrel exports for parent + sub-components with `UI` prefix

## Steps

1. **Parse arguments** — extract parent component name and sub-component name.
   - Parent folder: `kebab-case` under `src/ui/`
   - Sub-component: `PascalCase` for Vue file (e.g., `BadgeAction.vue`)

2. **Read the parent component's files:**
   - `*.context.ts` — understand context interface and what's available to inject
   - `*.style.ts` — understand existing slots
   - `*.vue` — understand template structure
   - `*.props.ts` — understand parent props
   - `index.ts` — understand existing exports

3. **Decide on props approach:**
   - **No own props:** Sub-component only uses parent context (e.g., `ButtonIcon` receives `icon` and `size` via its own inline props but styling from context)
   - **Inline props:** Sub-component has a few props defined directly in `defineProps<{...}>()` — use when props are simple and specific to this sub-component
   - **Separate `.props.ts`:** Only create a separate file if the sub-component has 4+ props or complex types that benefit from reuse

4. **Add a slot to the style** in parent's `*.style.ts`:
   - Add a new key to the `slots` object with the sub-component's camelCase name
   - Add variant-specific styling if needed (follow existing slot patterns)
   - Example — adding an `action` slot to badge:
     ```ts
     slots: {
       action: `cursor-pointer text-secondary hover:text-primary`,  // NEW
       root: `...`,
       label: `...`,
     },
     ```

5. **Update the context** in `*.context.ts` (if needed):
   - If sub-component needs values not already in context, add them
   - The style is typically already in context as `ComputedRef<ParentStyle>` — sub-components access slots from it

6. **Create `{SubComponentName}.vue`** in the parent's directory:

   Example following the `ButtonIcon` pattern:
   ```vue
   <script setup lang="ts">
   import { useInject{Parent}Context } from './{parent}.context'

   const props = defineProps<{
     // Only props specific to this sub-component
   }>()

   const { {parent}Style } = useInject{Parent}Context()
   </script>

   <template>
     <div :class="{parent}Style.{slotName}()">
       <slot />
     </div>
   </template>
   ```

   Key patterns:
   - Use `useInject{Parent}Context()` to get the computed style
   - Call the style slot function: `parentStyle.slotName()`
   - Use `<slot />` for content projection where appropriate
   - Keep the template minimal — sub-components are presentation-only

7. **Update `index.ts`** — add export with `UI` prefix:
   ```ts
   // {SubComponentName}
   export { default as UI{SubComponentName} } from './{SubComponentName}.vue'
   ```
   If the sub-component has a separate props file:
   ```ts
   export { type {SubComponentName}Props as UI{SubComponentName}Props } from './{subComponentName}.props.ts'
   ```

8. **Update `src/ui/index.ts`** — add the sub-component export if it's public (most are).

9. **Run validation:**
   ```
   pnpm lint:fix && pnpm type-check
   ```
   Fix any issues until both pass.

## Testing

Sub-components are tested in the **parent component's stories**, not in their own story file. After creating the sub-component:
- Update the parent's `*.story.ts` to include a story showing the sub-component in use
- The parent story should demonstrate the sub-component in context (e.g., Button with ButtonIcon)

## Checklist before done
- [ ] Parent style: new slot added to `slots` object
- [ ] Parent style: variant-specific classes for new slot (if needed)
- [ ] Parent context: updated (if sub-component needs additional values)
- [ ] Sub-component Vue file: injects parent context
- [ ] Sub-component Vue file: uses `parentStyle.slotName()` for styling
- [ ] Component `index.ts`: export with `UI` prefix added
- [ ] `src/ui/index.ts`: export added (if public)
- [ ] Parent story: updated to show sub-component usage
- [ ] `pnpm lint:fix` passes
- [ ] `pnpm type-check` passes
