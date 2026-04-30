---
description: "Generate a matrix story rendering ALL variant x size x state combinations for maximum Chromatic visual regression coverage"
allowed-tools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash"]
---

Generate a comprehensive matrix story that renders ALL variant combinations for the component "$ARGUMENTS". This maximizes Chromatic visual regression coverage.

## Steps

1. **Find the component** — resolve `$ARGUMENTS` to a component directory under `src/ui/`. Read:
   - The `*.props.ts` file — identify ALL variant/union props and their possible values
   - The `*.style.ts` file — identify ALL style variants (size, variant, color, etc.)
   - The `*.vue` file — understand slots, v-model, and required props
   - The `*.story.ts` file — check for existing stories to avoid duplicates

2. **Read the canonical story example** for reference:
   - `src/ui/text-field/textField.story.ts` — AllStates and AllSizes patterns

3. **Identify all axes** (variant dimensions):
   - Size variants (e.g., `'sm' | 'md' | 'lg'`)
   - Style variants (e.g., `'primary' | 'secondary' | 'tertiary'`)
   - Color variants (e.g., `'brand' | 'error' | 'success' | 'warning'`)
   - Boolean states: `isDisabled`, `isLoading`, `isReadonly`
   - Error state: `errorMessage` present

4. **Generate/update the story file** with these combination stories:

   **`AllVariants`** — if a `variant` prop exists:
   ```ts
   export const AllVariants: Story = {
     args: { modelValue: ... },
     render: (): object => ({
       components: { ComponentName },
       setup() { /* refs for each variant */ },
       template: `
         <div class="flex flex-wrap gap-4">
           <ComponentName v-for="variant in variants" :key="variant"
             v-model="values[variant]" :variant="variant" ... class="w-64" />
         </div>
       `,
     }),
   }
   ```

   **`AllSizes`** — if a `size` prop exists:
   - Render all sizes side by side with `items-end` alignment

   **`AllStates`** — render Default, Filled, Disabled, Readonly, Loading, Error:
   - Each with realistic content/values
   - Wrapped in `<div class="flex flex-wrap gap-4">`

   **`VariantSizeMatrix`** — THE FULL MATRIX:
   - Renders a grid of ALL variant x size combinations
   - Use a nested loop or explicit listing
   - Structure as rows (one per variant) and columns (one per size)
   ```ts
   export const VariantSizeMatrix: Story = {
     args: { modelValue: ... },
     render: (): object => ({
       components: { ComponentName },
       setup() {
         const variants = ['primary', 'secondary', 'tertiary']
         const sizes = ['sm', 'md', 'lg']
         // ... refs
         return { variants, sizes }
       },
       template: `
         <div class="flex flex-col gap-6">
           <div v-for="variant in variants" :key="variant" class="flex flex-col gap-2">
             <span class="text-xs font-medium text-secondary">{{ variant }}</span>
             <div class="flex items-end gap-4">
               <ComponentName v-for="size in sizes" :key="size"
                 :variant="variant" :size="size" ... class="w-48" />
             </div>
           </div>
         </div>
       `,
     }),
   }
   ```

   **`StateMatrix`** — if the component has multiple boolean states:
   - Grid of variant x state (disabled, loading, error, readonly)
   ```ts
   export const StateMatrix: Story = {
     args: { modelValue: ... },
     render: (): object => ({
       components: { ComponentName },
       setup() {
         const states = [
           { label: 'Default', props: {} },
           { label: 'Disabled', props: { isDisabled: true } },
           { label: 'Loading', props: { isLoading: true } },
           { label: 'Error', props: { errorMessage: 'Error message' } },
           { label: 'Readonly', props: { isReadonly: true } },
         ]
         // ...
       },
       // ...
     }),
   }
   ```

   **`DarkModeComparison`** — if component has theme-dependent styles:
   - Uses Storybook's globals to show light vs dark side by side
   - Useful for Chromatic visual diff

5. **Story conventions:**
   - Import from `storybook/test` (NOT `@storybook/test`)
   - Use `ref` for all v-model values
   - Use `class="w-48"` or `class="w-64"` for consistent sizing
   - Label each row/section with `<span class="text-xs font-medium text-secondary">`
   - Always use `satisfies Meta<typeof Component>` on meta
   - Add `tags: ['autodocs']` on meta

6. **Run:** `pnpm lint:fix`
