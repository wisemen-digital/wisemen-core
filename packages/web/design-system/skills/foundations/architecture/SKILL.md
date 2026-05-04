---
name: architecture
description: >
  Core architecture patterns for @wisemen/vue-core-design-system: the parts pattern
  (Root/Content/Icon sub-components), context system (useContext + provide/inject),
  PropsToComputed utility, toComputedRefs, file naming conventions, and export
  conventions (UI prefix). Load before building or extending any component.
type: foundation
category: architecture
library: vue-core-design-system
library_version: "0.8.0"
sources:
  - "packages/web/design-system/src/composables/context.composable.ts"
  - "packages/web/design-system/src/ui/badge/badge.context.ts"
  - "packages/web/design-system/src/ui/button/button/button.props.ts"
---

# Architecture

Core patterns underlying every component in the design system.

## Overview

Every component follows a consistent **parts-based architecture** where a main wrapper component composes smaller sub-components (parts). Props flow from the root part to children via Vue's provide/inject context system, not prop drilling.

## File Structure Convention

Each component directory follows this layout:

```
component-name/
├── ComponentName.vue           # Main wrapper — composes parts
├── componentName.props.ts      # Props interface (PascalCase type, camelCase file)
├── componentName.style.ts      # Tailwind Variants definition via tv()
├── componentName.context.ts    # Context provider/injector pair
├── parts/                      # Sub-components (optional)
│   ├── ComponentNameRoot.vue   # Root part — provides context, applies base styles
│   ├── ComponentNameContent.vue
│   └── ComponentNameIcon.vue
├── stories/                    # Storybook stories (optional)
│   ├── componentName.story.ts
│   └── ComponentNamePlayground.vue
└── index.ts                    # Public exports
```

**Naming rules:**
- Vue files: `PascalCase.vue`
- TypeScript files: `camelCase.suffix.ts` (where suffix is `props`, `style`, `context`, `type`, `composable`)
- Directories: `kebab-case`
- Export prefix: `UI` (e.g., `UIButton`, `UITextField`)
- Props type export: `UIComponentNameProps` (e.g., `UIButtonProps`)

## Context System

The `useContext` factory creates a matched provide/inject pair for any component:

```ts
import { useContext } from '@/composables/context.composable'

interface BadgeContext {
  color: ComputedRef<string>
  size: ComputedRef<string>
  style: ComputedRef<CreateBadgeStyle>
  onRemove: () => void
}

export const [useProvideBadgeContext, useInjectBadgeContext] =
  useContext<BadgeContext>('badgeContext')
```

### How useContext Works

```ts
function useContext<TContext>(contextName: string) {
  const contextKey: InjectionKey<TContext> = Symbol(contextName)

  function useProvideContext(context: TContext): TContext {
    provide(contextKey, context)
    return context
  }

  function useInjectContext<TFallback extends TContext | null = TContext>(
    fallback?: TFallback
  ): TFallback extends null ? TContext | null : TContext {
    const context = inject(contextKey, fallback ?? undefined)
    if (context === undefined && fallback === undefined) {
      throw new Error(`${contextName} context is not provided.`)
    }
    return (context ?? null) as any
  }

  return [useProvideContext, useInjectContext] as const
}
```

**Key behaviors:**
- No fallback provided: throws if context missing (strict mode)
- Fallback of `null`: returns `null` if context missing (optional mode)
- Context is keyed by `Symbol`, so multiple components can use `useContext` independently

### PropsToComputed

Converts a props object to an object of `ComputedRef` values. Functions are passed through as-is (event handlers, callbacks).

```ts
type PropsToComputed<T> = {
  [K in keyof Required<T>]: IsFunction<Exclude<T[K], undefined>> extends true
    ? T[K]
    : ComputedRef<Exclude<T[K], undefined>>;
}
```

### toComputedRefs

Runtime helper that wraps each prop in `computed()`:

```ts
function toComputedRefs<T>(props: T): PropsToComputed<T>
```

**Usage in Root component:**

```vue
<script setup lang="ts">
const props = withDefaults(defineProps<BadgeProps>(), {
  size: 'md',
})

useProvideBadgeContext({
  ...toComputedRefs(props),
  style: badgeStyle,
  onRemove,
})
</script>
```

## Parts Pattern

### Root Part (Provider)

The Root part sets up context and applies the base element:

```vue
<!-- BadgeRoot.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { toComputedRefs } from '@/composables/context.composable'
import { useProvideBadgeContext } from '../badge.context'
import { createBadgeStyle } from '../badge.style'

const props = withDefaults(defineProps<BadgeProps>(), {
  size: 'md',
  icon: null,
})

const badgeStyle = computed(() => createBadgeStyle({
  color: props.color,
  size: props.size,
  variant: props.variant,
}))

useProvideBadgeContext({
  ...toComputedRefs(props),
  style: badgeStyle,
  onRemove,
})
</script>

<template>
  <div :class="badgeStyle.root()">
    <slot />
  </div>
</template>
```

### Child Part (Consumer)

Child parts inject the context and use computed values:

```vue
<!-- BadgeIcon.vue -->
<script setup lang="ts">
import { useInjectBadgeContext } from '../badge.context'

const { icon, style } = useInjectBadgeContext()
</script>

<template>
  <component
    :is="icon"
    v-if="icon"
    :class="style.icon()"
  />
</template>
```

### Main Wrapper (Composition)

The main component composes parts with slots:

```vue
<!-- Badge.vue -->
<script setup lang="ts">
const props = defineProps<BadgeProps>()
const emit = defineEmits<BadgeEmits>()
</script>

<template>
  <BadgeRoot v-bind="props" @remove="emit('remove')">
    <BadgeIcon />
    <slot name="left" />
    <slot />
    <slot name="right" />
    <BadgeRemoveButton />
  </BadgeRoot>
</template>
```

## Export Convention

Every `index.ts` exports:
1. The main component with `UI` prefix
2. Props type with `UI` prefix
3. Individual parts with `UI` prefix (for advanced composition)
4. Style factory function (for extending styles)

```ts
// badge/index.ts
export { type BadgeProps as UIBadgeProps } from './badge.props'
export { default as UIBadge } from './Badge.vue'
```

Consumers import from the package:

```ts
import { UIBadge } from '@wisemen/vue-core-design-system'
import type { UIBadgeProps } from '@wisemen/vue-core-design-system'
```

## Common Mistakes

### CRITICAL: Forgetting to provide context in Root

Wrong:
```vue
<!-- Root component without useProvideContext -->
<script setup lang="ts">
const props = defineProps<BadgeProps>()
// Missing: useProvideBadgeContext(...)
</script>
```

Child parts will throw: `"badgeContext context is not provided."`

Correct: Always call `useProvideContext` in the Root part's setup.

### HIGH: Mutating context values directly

Wrong:
```ts
const { size } = useInjectBadgeContext()
size.value = 'lg' // Don't mutate injected ComputedRef
```

Context values are `ComputedRef` — read-only by design. Change props on the Root instead.

### MEDIUM: Using wrong import path

Wrong:
```ts
import { UIBadge } from '@wisemen/vue-core-design-system/src/ui/badge'
```

Correct:
```ts
import { UIBadge } from '@wisemen/vue-core-design-system'
```

Always import from the package root.

## See Also

- [Styling](../styling/SKILL.md) — How tv() and design tokens work
- [Input System](../input-system/SKILL.md) — How input components extend this architecture
