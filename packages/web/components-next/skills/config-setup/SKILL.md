---
name: config-setup
description: >
  Import @wisemen/vue-core-components/style.css, wrap app in
  VcConfigProvider with locale/toast/pagination config, extend the icon
  set with extendIcons and module augmentation, customize component
  styles globally with defineComponentVariant or per-instance with
  classConfig prop. Use when setting up a Vue 3 project with this
  component library.
type: lifecycle
library: vue-core-components
library_version: "3.0.1"
sources:
  - "wisemen-digital/wisemen-core:packages/web/components-next/src/index.ts"
  - "wisemen-digital/wisemen-core:packages/web/components-next/src/components/config-provider/VcConfigProvider.vue"
  - "wisemen-digital/wisemen-core:packages/web/components-next/src/class-variant/customClassVariants.ts"
  - "wisemen-digital/wisemen-core:packages/web/components-next/src/icons/icons.ts"
---

# @wisemen/vue-core-components — Config & Setup

## Setup

```typescript
// main.ts
import '@wisemen/vue-core-components/style.css'

import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.mount('#app')
```

```vue
<!-- App.vue -->
<script setup lang="ts">
import { VcConfigProvider } from '@wisemen/vue-core-components'
</script>

<template>
  <VcConfigProvider
    locale="en-US"
    :pagination="{ limit: 20 }"
    toast-position="bottom-right"
    :auto-close-toast="{ success: 3000, error: false, info: 5000 }"
  >
    <RouterView />
  </VcConfigProvider>
</template>
```

VcConfigProvider injects context consumed by all child components — locale for date/number formatting, pagination defaults for `usePagination`, and toast configuration for `useToast`. Without this wrapper, composables like `useToast` and components like `VcDateField` throw missing-context errors.

Peer dependencies: `reka-ui`, `motion-v`, `vue-i18n`, `temporal-polyfill`.

## Core Patterns

### Extend the icon set

The library ships base icons (close, check, chevrons, search, etc.). Register your project icons so components can reference them by name:

```typescript
// src/icons.ts
import { extendIcons } from '@wisemen/vue-core-components'
import type { Icons } from '@wisemen/vue-core-components'

// Module augmentation — tells TypeScript about your custom icons
declare module '@wisemen/vue-core-components' {
  interface Icons {
    home: typeof import('./HomeIcon.vue')
    settings: typeof import('./SettingsIcon.vue')
    users: typeof import('./UsersIcon.vue')
  }
}

extendIcons({
  home: import('./HomeIcon.vue'),
  settings: import('./SettingsIcon.vue'),
  users: import('./UsersIcon.vue'),
})
```

After extending, the `Icon` type includes your custom names. Components accept them via `icon-left`, `icon-right`, etc.:

```vue
<VcButton icon-left="home">Home</VcButton>
<VcTextField icon-left="search" v-model="query" />
```

Icons are lazy-loaded (`import()` returns a Promise), so they don't bloat the initial bundle.

### Customize styles globally with defineComponentVariant

Override default styles for a specific variant of a component across your entire app:

```typescript
import { defineComponentVariant } from '@wisemen/vue-core-components'

// Make all medium buttons wider with more padding
defineComponentVariant({
  component: 'button',
  target: { prop: 'size', value: 'md' },
  config: { root: 'px-2xl py-md' },
})

// Make all primary buttons use a custom background
defineComponentVariant({
  component: 'button',
  target: { prop: 'variant', value: 'primary' },
  config: { root: 'bg-brand-600 hover:bg-brand-700' },
})
```

Call this at app startup (before mounting). Variant overrides are stored globally and applied whenever a matching component renders.

### Customize styles per-instance with classConfig

Every component accepts a `classConfig` prop for one-off overrides. The config targets specific internal slots:

```vue
<script setup lang="ts">
import { VcButton } from '@wisemen/vue-core-components'
</script>

<template>
  <!-- classConfig targets specific component slots -->
  <VcButton
    :class-config="{ root: 'rounded-full', content: 'gap-lg' }"
  >
    Custom styled button
  </VcButton>

  <!-- Each component has different slots — check the component's style file -->
  <VcTextField
    v-model="name"
    :class-config="{ root: 'w-full', input: 'font-mono' }"
  />
</template>
```

Components have multiple internal elements (root, content, icon slots, input, etc.). Raw `class` only hits the outermost element. `classConfig` lets you target each slot independently.

## Common Mistakes

### CRITICAL: Not importing style.css

```typescript
// main.ts — missing CSS import
import { VcButton } from '@wisemen/vue-core-components'
// Components render as unstyled HTML — no colours, no spacing, no layout
```

```typescript
// main.ts — CSS imported as separate entry point
import '@wisemen/vue-core-components/style.css'
import { VcButton } from '@wisemen/vue-core-components'
```

The stylesheet is a separate export (`./style.css` in package.json exports map). It contains all Tailwind-generated component styles. Without it, every component renders as raw unstyled HTML elements.

Source: `package.json` exports — `"./style.css": "./dist/style.css"` is a distinct entry from `"."`.

### CRITICAL: Missing VcConfigProvider

```vue
<!-- App.vue — no provider -->
<template>
  <RouterView />
</template>
<!-- useToast() throws, VcDateField can't format dates, usePagination has no defaults -->
```

```vue
<template>
  <VcConfigProvider locale="en-US">
    <RouterView />
  </VcConfigProvider>
</template>
```

VcConfigProvider uses Vue's `provide`/`inject` to pass configuration to all descendant components. Components that need locale, toast config, or pagination defaults inject from this context. Without it, they throw or fall back to broken defaults.

Source: `src/components/config-provider/VcConfigProvider.vue` — provides `configContext` with locale, pagination, toast, and maps settings.

### HIGH: Using raw class instead of classConfig

```vue
<!-- class only hits the root <div> — inner elements unaffected -->
<VcButton class="rounded-full px-8">Click</VcButton>
```

```vue
<!-- classConfig targets the specific slot that needs styling -->
<VcButton :class-config="{ root: 'rounded-full px-2xl' }">Click</VcButton>
```

Components render multiple nested elements (root wrapper, content container, icon slots, loader overlay, etc.). A `class` prop only applies to the outermost element. To style inner elements, use `classConfig` with the slot name. Each component's style file documents its available slots.

Source: `src/class-variant/classVariant.type.ts` — `ResolvedClassConfig<T>` maps slot names to class strings.

## See Also

- [table-usage](../table-usage/SKILL.md) — VcTable compound component with usePagination
- [form-field-usage](../form-field-usage/SKILL.md) — VcFormField wrapping pattern
- [dialog-toast-usage](../dialog-toast-usage/SKILL.md) — VcDialog and useToast
