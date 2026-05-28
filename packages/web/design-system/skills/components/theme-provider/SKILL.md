---
name: theme-provider
description: >
  Provides appearance (light, dark, system) and theme (named theme class) to all
  descendant components. Applies the theme and appearance as CSS classes on a
  wrapper element. Supports nesting for scoped theme overrides.
type: component
library: vue-core-design-system
category: infrastructure
exports:
  - UIThemeProvider
---

# UIThemeProvider

Provides appearance (light/dark/system) and a named theme class to all descendant components. Applies both as CSS classes on a wrapper element, enabling scoped theme switching and nesting.

## When to Use

- At the application root to set the global appearance (light/dark/system) and theme
- Nested inside the tree to override the theme or appearance for a specific section (e.g., a dark sidebar within a light app)
- To wrap portalled content (dropdowns, modals) so they inherit the correct theme

**Use instead:** Nothing -- this is the only mechanism for controlling appearance and theme in the design system.

## Import

```ts
import { UIThemeProvider } from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import { UIConfigProvider, UIThemeProvider } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UIConfigProvider locale="en-US">
    <UIThemeProvider appearance="system">
      <RouterView />
    </UIThemeProvider>
  </UIConfigProvider>
</template>
```

## Source Files

For full API details, read the props and context files.

- Props: `src/ui/theme-provider/themeProvider.props.ts`
- Component: `src/ui/theme-provider/ThemeProvider.vue`
- Context: `src/ui/theme-provider/themeProvider.context.ts`

## See Also

- [config-provider](../config-provider/SKILL.md) -- App-level config (locale, maps key, teleport)
