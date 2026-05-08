---
name: config-provider
description: >
  Application-level configuration provider that supplies locale, number formatting,
  hour cycle, teleport target, and Google Maps API key to all design system components
  via Vue's provide/inject. Must wrap the entire application.
type: component
library: vue-core-design-system
category: infrastructure
exports:
  - UIConfigProvider
  - useInjectConfigContext
---

# UIConfigProvider

Provides global configuration (locale, number formatting, hour cycle, teleport target, Google Maps API key) to all design system components via Vue's provide/inject.

## When to Use

- At the root of every application that uses the design system -- wrap your `App.vue` content in this component
- When you need to change locale, number formatting, or hour cycle settings application-wide

**Use instead:** Nothing -- this component is required for the design system to function correctly.

## Import

```ts
import { UIConfigProvider } from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import { UIConfigProvider } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UIConfigProvider locale="en-US">
    <RouterView />
  </UIConfigProvider>
</template>
```

## Source Files

For full API details, read the context and types files.

- Component: `src/ui/config-provider/ConfigProvider.vue`
- Context: `src/ui/config-provider/config.context.ts`
- Types: `src/ui/config-provider/config.types.ts`

## See Also

- [theme-provider](../theme-provider/SKILL.md) -- Controls appearance (light/dark) and named themes
