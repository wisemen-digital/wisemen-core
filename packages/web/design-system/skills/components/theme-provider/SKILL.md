---
name: theme-provider
description: >
  Provides appearance (light, dark, system) and theme (named theme class) to all
  descendant components. Applies the theme and appearance as CSS classes on a
  wrapper element. Supports nesting for scoped theme overrides.
type: component
library: vue-core-design-system
category: infrastructure
requires: []
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

## API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `appearance` | `'light' \| 'dark' \| 'system' \| null` | `null` | Controls the color scheme. When `null`, inherits from the parent `UIThemeProvider`. Falls back to `'light'` if no parent provides a value. |
| `theme` | `string \| 'default' \| null` | `null` | The named theme applied as a CSS class. When `null`, inherits from the parent `UIThemeProvider`. Falls back to `'default'` if no parent provides a value. |
| `asChild` | `boolean` | `false` | When `true`, does not render its own wrapper element -- instead applies the theme/appearance classes to the immediate child element (uses Reka UI's `Primitive` with `as-child`). |

### Slots

| Slot | Description |
|------|-------------|
| `default` | Application content that receives the theme and appearance. |

### Emits

This component has no events.

## Variants

### Appearance

| Value | Description |
|-------|-------------|
| `'light'` | Light color scheme. |
| `'dark'` | Dark color scheme. |
| `'system'` | Follows the user's OS/browser preference (`prefers-color-scheme`). |

### Theme

Themes are project-specific named CSS classes (e.g., `'default'`, `'brand-a'`, `'brand-b'`). The value is applied directly as a CSS class on the wrapper element.

## Examples

### Application Root Setup

```vue
<script setup lang="ts">
import { UIConfigProvider, UIThemeProvider } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UIConfigProvider locale="en-US">
    <UIThemeProvider appearance="light" theme="default">
      <RouterView />
    </UIThemeProvider>
  </UIConfigProvider>
</template>
```

### Dark Mode Toggle

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UIThemeProvider, UIButton } from '@wisemen/vue-core-design-system'
import type { Appearance } from '@wisemen/vue-core-design-system'

const appearance = ref<Appearance>('light')

function toggleAppearance(): void {
  appearance.value = appearance.value === 'light' ? 'dark' : 'light'
}
</script>

<template>
  <UIThemeProvider :appearance="appearance">
    <UIButton label="Toggle theme" @click="toggleAppearance" />
    <RouterView />
  </UIThemeProvider>
</template>
```

### Nested Theme Override (Dark Sidebar)

```vue
<script setup lang="ts">
import { UIThemeProvider } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UIThemeProvider appearance="light">
    <div class="flex">
      <!-- Force dark appearance on the sidebar only -->
      <UIThemeProvider appearance="dark" :as-child="true">
        <aside class="w-64 bg-primary text-primary">
          Sidebar content
        </aside>
      </UIThemeProvider>

      <main class="flex-1">
        Main content (light)
      </main>
    </div>
  </UIThemeProvider>
</template>
```

### Using asChild to Avoid Extra Wrapper

```vue
<script setup lang="ts">
import { UIThemeProvider } from '@wisemen/vue-core-design-system'
</script>

<template>
  <!-- No extra wrapper div; classes applied directly to the section -->
  <UIThemeProvider appearance="dark" :as-child="true">
    <section class="p-4">
      Dark-themed section
    </section>
  </UIThemeProvider>
</template>
```

## Anatomy

```
UIThemeProvider
  Primitive (div or as-child, with class="[theme] [appearance]")
    <slot />
```

When `asChild` is `false` (default), the component renders a `<div>` with the theme and appearance as CSS classes. When `asChild` is `true`, it applies those classes to the direct child element instead.

## Styling

This component has no visual styles of its own. It applies two CSS classes to its wrapper element:

1. **Theme class** -- The `theme` prop value (e.g., `default`, `brand-a`). Used by your CSS to scope design tokens.
2. **Appearance class** -- The resolved appearance (`light` or `dark`). Used by Tailwind's `dark:` variant and CSS custom properties.

The component itself has no style file.

## Common Mistakes

### HIGH: Not wrapping portalled content

Wrong:
```vue
<!-- Modal content renders outside the ThemeProvider via teleport -->
<!-- It will not inherit the correct theme/appearance -->
```

The design system's dropdown and popover components already handle this internally -- `AutocompleteContent` and other portalled components wrap themselves in a `ThemeProvider`. You typically do not need to worry about this for built-in components.

### MEDIUM: Using appearance="system" without understanding inheritance

When nested, a child `UIThemeProvider` with `appearance="system"` will resolve based on the OS preference, not the parent's resolved appearance. If the parent is forced to `'dark'` and the child uses `'system'`, the child may render as light on a system with light preference.

### LOW: Forgetting asChild when nesting inside flex/grid layouts

Wrong:
```vue
<div class="flex">
  <UIThemeProvider appearance="dark">
    <!-- Adds an extra div wrapper that breaks the flex layout -->
    <aside>Sidebar</aside>
  </UIThemeProvider>
</div>
```

Correct:
```vue
<div class="flex">
  <UIThemeProvider appearance="dark" :as-child="true">
    <aside>Sidebar</aside>
  </UIThemeProvider>
</div>
```

Without `asChild`, the component renders an extra `<div>` that may break CSS layouts. Use `:as-child="true"` when the wrapper element would interfere.

## Accessibility

- This component has no direct accessibility impact. It is a theming wrapper.
- The `appearance` prop affects color contrast: ensure that both light and dark themes meet WCAG contrast requirements.
- The `'system'` appearance respects the user's OS preference (`prefers-color-scheme`), which is the recommended default for accessibility.

## See Also

- [UIConfigProvider](../config-provider/) -- For locale, number formatting, and other application-wide configuration
