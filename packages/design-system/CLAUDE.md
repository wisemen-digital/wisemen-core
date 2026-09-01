# Design System — `@wisemen/vue-core-design-system`

Vue 3 + TypeScript, Tailwind CSS 4 + Tailwind Variants, Reka UI primitives, Storybook 10 + Chromatic.

## STOP — Read Before You Write

**NEVER write code without reading the relevant skill first.** Skills contain mandatory patterns that are the source of truth. Your training data is stale — the skill file always wins.

| When you are about to... | Read THIS skill first |
|--------------------------|----------------------|
| Create a new component | `create-component/SKILL.md` |
| Create a form input component | `create-form-input/SKILL.md` |
| Add a sub-component (parts pattern) | `create-sub-component/SKILL.md` |
| Scaffold a component from Figma | `scaffold-from-figma/SKILL.md` |
| Add a prop to an existing component | `add-prop/SKILL.md` |
| Add a variant value to a component | `add-variant/SKILL.md` |
| Write or improve Storybook stories | `create-story/SKILL.md` |
| Generate matrix/combination stories | `story-all-combinations/SKILL.md` |
| Review a component for violations | `review-component/SKILL.md` |
| Audit barrel exports | `review-exports/SKILL.md` |
| Audit design token usage | `audit-tokens/SKILL.md` |

All skills live in `.claude/skills/{name}/SKILL.md`.

**After generating code, re-read the relevant skill and verify your output complies. Fix violations before presenting the code.** This self-review step is mandatory, not optional.

## Commands

```
pnpm build          pnpm dev           pnpm storybook
pnpm lint:fix       pnpm type-check    pnpm test
```

Always run `pnpm lint:fix` and `pnpm type-check` after making changes.

## Component File Structure

Each component lives in `src/ui/{kebab-case}/`:

| File | Purpose |
|------|---------|
| `ComponentName.vue` | Main SFC (`<script setup lang="ts">`) |
| `componentName.props.ts` | Props interface with JSDoc + `@default` on every prop |
| `componentName.style.ts` | `createComponentNameStyle = tv({...})` with slots/variants |
| `componentName.context.ts` | Context via `InjectionKey` + `provide`/`inject` |
| `componentName.story.ts` | CSF3 stories with play functions |
| `index.ts` | Barrel exports with `UI` prefix |
| `SubPart.vue` | Sub-components for parts pattern |

## Naming Conventions

- **Folders:** `kebab-case`
- **Vue files:** `PascalCase.vue`
- **TS files:** `camelCase` + suffix (`.props.ts`, `.style.ts`, `.context.ts`, `.story.ts`)
- **Exports:** `UI` prefix — `UIButton`, `UIButtonProps`
- **Style creators:** `createComponentNameStyle`, type export: `ComponentNameStyle`

## Props

- Separate `.props.ts` file — never inline in SFC
- JSDoc comment + `@default` tag on every prop
- Union literals sorted alphabetically: `'md' | 'sm'`
- Boolean props prefixed with `is` or `has` (`isDisabled`, `hasDot`)
- In SFC: `withDefaults(defineProps<Props>(), {...})` — provide default for every optional prop
- Form inputs: extend `Input`, `InputWrapper`, `FieldWrapper` from `@/types/input.type.ts`

## Styling

- Import `tv` from `@/styles/tailwindVariants.lib` — **never** from `tailwind-variants` directly
- Use `slots` for multi-element components (root, label, icon, etc.)
- Use `variants` for size/color/variant axes
- Use `compoundVariants` for dark mode adjustments (`dark:` prefix classes)
- Custom spacing tokens: `none`, `xxs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`–`11xl`
- Semantic color tokens: `brand-*`, `error-*`, `success-*`, `warning-*`, `gray-*`
- Style is computed in SFC and passed through context to sub-components

## Context Pattern

Components use `InjectionKey` + `provide`/`inject` for parent→child communication:

```ts
// componentName.context.ts
import type { ComputedRef, InjectionKey } from 'vue'
import { inject, provide } from 'vue'
import type { ComponentNameStyle } from './componentName.style'

interface ComponentNameContext {
  componentNameStyle: ComputedRef<ComponentNameStyle>
}

const componentNameContextKey: InjectionKey<ComponentNameContext> = Symbol('ComponentNameContextKey')

export function useProvideComponentNameContext(context: ComponentNameContext): void {
  provide(componentNameContextKey, context)
}

export function useInjectComponentNameContext(): ComponentNameContext {
  const context = inject(componentNameContextKey, null)
  if (context === null) {
    throw new Error('ComponentNameContext not provided')
  }
  return context
}
```

- Root component: `useProvideXContext({ xStyle: computed(() => createXStyle({...})) })`
- Sub-components: `const { xStyle } = useInjectXContext()`
- The `useContext<T>()` factory from `@/composables/context.composable` is available but existing components use the manual pattern above

## Storybook Stories

- CSF3 format: `satisfies Meta<typeof Component>`
- Import test utils from `storybook/test` (NOT `@storybook/test`)
- Add `tags: ['autodocs']` on meta
- Play functions use `within(canvasElement)`, `userEvent`, `expect`
- Include stories for: Default, Disabled, Loading, Error, AllStates, AllSizes, AllVariants
- Use `class: 'w-72'` in args for consistent width

## Barrel Exports

- Component `index.ts` → re-exported from `src/ui/index.ts` → re-exported from `src/index.ts`
- When adding a public component, add its export to `src/ui/index.ts`

## Reka UI Integration

When wrapping Reka UI primitives:
- Use `as-child` prop for renderless primitives (no extra DOM wrapper)
- Portal pattern: `<XxxPortal to="body">` with content using `position-strategy="absolute"` and `sticky="always"`
- Wrap portal content with `<ThemeProvider :as-child="true">` to preserve theme in portaled content
- Reka provides data attributes for styling: `data-state` (`open`/`closed`), `data-side` (`top`/`right`/`bottom`/`left`)
- For positioned content (dropdown, tooltip, popover), use `PopperProps` from `@/types/popper.type.ts` with `POPPER_PROPS_DEFAULTS`

## Data Attributes for Styling

Components use data attributes for state-based styling:
- `data-interactive` — element is clickable and enabled
- `data-disabled` — element is disabled
- `data-field-wrapper` — marks form input containers

Style with Tailwind's data attribute syntax:
```
data-interactive:hover:bg-primary-hover
data-[state=checked]:bg-brand-solid
not-data-interactive:cursor-not-allowed
group-data-[state=checked]/checkbox:bg-brand-solid
```

## Animation Patterns

- **JS-driven:** Use `motion-v` (`Motion`, `AnimatePresence` components)
- **Always** check `useReducedMotion()` — set duration to `0` when enabled
- **CSS-driven:** Scoped `@keyframes` + `data-animation` attribute, triggered by Reka's `data-state`

## Common SFC Patterns

```ts
// Forward class/style to inner element (not root)
defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
// Then: v-bind="attrs" on the target element

// v-model typing
const modelValue = defineModel<string | null>({ required: true })

// Expose ref for parent access (e.g., .focus())
const inputRef = ref<HTMLInputElement | null>(null)
defineExpose({ input: inputRef })

// Generate stable ID if not provided via props
const id = props.id ?? useId()
```

## Do NOT

- Create `.test.ts` files — use Storybook play functions instead
- Import `tv` from `tailwind-variants` directly — use `@/styles/tailwindVariants.lib`
- Use old `xxxVariants` naming — use `createXxxStyle` pattern
- Skip dark mode support in compound variants

## Key Reference Files

- `src/composables/context.composable.ts` — Context factory, `toComputedRefs`, `PropsToComputed`
- `src/styles/tailwindVariants.lib.ts` — Custom `tv()` wrapper with extended tw-merge config
- `src/types/input.type.ts` — Shared input interfaces (`Input`, `InputWrapper`, `FieldWrapper`)
- `src/types/popper.type.ts` — Shared popper/positioning props (`PopperProps`, `POPPER_PROPS_DEFAULTS`)
- `src/utils/twMerge.util.ts` — Extended tailwind-merge with custom spacing tokens
- `src/ui/index.ts` — Public barrel exports (add new components here)
