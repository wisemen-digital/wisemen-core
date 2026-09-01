---
description: "Create a new form input component that extends Input/InputWrapper/FieldWrapper interfaces with useInput() composable and ARIA attributes"
allowed-tools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash"]
---

Create a new form input component named "$ARGUMENTS".

Form inputs are **different from regular components** — they extend shared input interfaces, use the `useInput()` composable for ARIA attributes, and compose `InputWrapper` + `FieldWrapper` sub-components.

## Steps

1. **Derive names** from the argument:
   - Folder: `kebab-case` (e.g., "date picker" → `date-picker`)
   - Component: `PascalCase` (e.g., `DatePicker`)
   - Camel: `camelCase` for file prefixes (e.g., `datePicker`)

2. **Before generating**, ask the user:
   - What is the native HTML element or Reka UI primitive? (e.g., `<input>`, `<textarea>`, `RekaDateFieldRoot`)
   - What custom props does it need beyond the shared input interfaces?
   - Does it need `v-model` with `string`, `number`, `Date`, or another type?
   - Does it need the `AutocompleteInput` interface?

3. **Read these reference files** to match the exact patterns:
   - `src/ui/text-field/textField.props.ts` — props extending `Input`, `InputWrapper`, `FieldWrapper`
   - `src/ui/text-field/TextField.vue` — SFC pattern with `useInput()`, `InputWrapper`, `FieldWrapper` composition
   - `src/ui/text-field/textField.style.ts` — style pattern for form inputs
   - `src/ui/text-field/textField.story.ts` — comprehensive story with form input states
   - `src/ui/number-field/NumberField.vue` — Reka UI primitive wrapping pattern for form inputs
   - `src/ui/number-field/numberField.props.ts` — extended props with custom fields
   - `src/types/input.type.ts` — shared interfaces: `Input`, `InputWrapper`, `FieldWrapper`, `AutocompleteInput`
   - `src/composables/input.composable.ts` — `useInput()` composable returning ARIA attributes

4. **Create files** in `src/ui/{kebab-name}/`:

   **`{camelName}.props.ts`** — Props interface:
   - MUST extend `Input`, `InputWrapper`, `FieldWrapper` (and `AutocompleteInput` if applicable)
   - Add component-specific props with JSDoc + `@default`
   - Union literals sorted alphabetically
   - Boolean props with `is`/`has` prefix
   ```ts
   import type {
     AutocompleteInput,
     FieldWrapper,
     Input,
     InputWrapper,
   } from '@/types/input.type'

   export interface {PascalName}Props extends Input, AutocompleteInput, InputWrapper, FieldWrapper {
     // Component-specific props here
   }
   ```

   **`{camelName}.style.ts`** — Style definition:
   - `import { tv } from '@/styles/tailwindVariants.lib'`
   - Input slot should include standard input classes:
     ```
     size-full truncate bg-transparent text-xs text-primary outline-none
     placeholder:text-placeholder
     read-only:cursor-default
     disabled:cursor-not-allowed disabled:text-disabled
     disabled:placeholder:text-fg-disabled-subtle
     ```
   - Include size variants for padding if applicable
   ```ts
   export const create{PascalName}Style = tv({
     slots: {
       input: '...',
     },
     variants: {
       size: {
         md: { input: 'px-md' },
         sm: { input: 'px-sm' },
       },
     },
   })
   export type {PascalName}Style = ReturnType<typeof create{PascalName}Style>
   ```

   **`{PascalName}.vue`** — Main SFC with this exact structure:
   ```vue
   <script setup lang="ts">
   import { computed, useAttrs, useId } from 'vue'

   import { useInput } from '@/composables/input.composable'
   import {
     AUTOCOMPLETE_INPUT_DEFAULTS,
     INPUT_DEFAULTS,
     INPUT_FIELD_DEFAULTS,
     INPUT_META_DEFAULTS,
   } from '@/types/input.type'
   import FieldWrapper from '@/ui/field-wrapper/FieldWrapper.vue'
   import InputWrapper from '@/ui/input-wrapper/InputWrapper.vue'

   defineOptions({ inheritAttrs: false })

   const props = withDefaults(defineProps<Props>(), {
     ...INPUT_DEFAULTS,
     ...INPUT_META_DEFAULTS,
     ...INPUT_FIELD_DEFAULTS,
     ...AUTOCOMPLETE_INPUT_DEFAULTS,
     // component-specific defaults
   })

   const modelValue = defineModel<ModelType>({ required: true })

   const style = computed(() => createStyle({ /* variants */ }))
   const attrs = useAttrs()
   const id = props.id ?? useId()

   const {
     isError,
     ariaBusy,
     ariaDescribedBy,
     ariaInvalid,
     ariaRequired,
   } = useInput(id, props)
   </script>
   ```
   - Template MUST compose `InputWrapper` → `FieldWrapper` → native/Reka element
   - InputWrapper receives: `error-message`, `is-disabled`, `is-required`, `hint`, `label`, `class`, `style`, `for`, `hide-error-message`
   - InputWrapper has slots: `label-left`, `label-right`
   - FieldWrapper receives: `icon-left`, `icon-right`, `is-loading`, `is-error`, `is-disabled`, `is-readonly`, `size`
   - FieldWrapper has slots: `left`, `right`
   - Native input gets: `v-bind="attrs"`, `:id`, `:aria-describedby`, `:aria-required`, `:aria-busy`, `:aria-invalid`, `:disabled`, `:readonly`, `:placeholder`, `:autocomplete`, `:name`, `:class="style.input()"`, `data-field-wrapper`

   **`{camelName}.story.ts`** — Stories MUST include:
   - Meta with `tags: ['autodocs']`, `component`, full `argTypes` for all input props
   - Import from `storybook/test` (NOT `@storybook/test`)
   - `Default` — with play function testing basic input + value assertion
   - `WithHint` — hint text visible
   - `Required` — `isRequired: true`, assert `aria-required`
   - `WithIcons` — both `iconLeft` and `iconRight`
   - `Disabled` — assert `disabled` attribute
   - `Readonly` — assert `readonly` attribute
   - `Loading` — `isLoading: true`
   - `Error` — with `errorMessage`, assert `aria-invalid="true"`
   - `AllStates` — render function showing Default, Filled, Disabled, Readonly, Loading, Error side by side
   - `AllSizes` — render function showing all size variants
   - `FormExample` — realistic form layout using multiple instances

   **`index.ts`** — Barrel exports:
   ```ts
   export { type {PascalName}Props as UI{PascalName}Props } from './{camelName}.props'
   export { default as UI{PascalName} } from './{PascalName}.vue'
   ```

5. **Add export** to `src/ui/index.ts`:
   - `export * from './{kebab-name}'`
   - Keep exports sorted alphabetically

6. **Run validation:**
   ```
   pnpm lint:fix && pnpm type-check
   ```
   Fix any issues until both pass.
