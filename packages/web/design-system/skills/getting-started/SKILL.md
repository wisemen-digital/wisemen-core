---
name: getting-started
description: >
  Import @wisemen/vue-core-design-system/style.css, wrap app in
  UIThemeProvider with appearance (light/dark/system) and theme props,
  integrate design-system locales into vue-i18n, use semantic color tokens
  (bg-primary, text-secondary, border-brand) and spacing tokens (p-xl,
  gap-md) instead of raw Tailwind values. Customize tokens via source.css
  and @theme inline. Use when setting up a Vue 3 project with this
  design system.
type: lifecycle
library: vue-core-design-system
library_version: "0.5.0"
sources:
  - "wisemen-digital/wisemen-core:packages/web/design-system/src/ui/theme-provider/ThemeProvider.vue"
  - "wisemen-digital/wisemen-core:packages/web/design-system/src/ui/theme-provider/themeProvider.context.ts"
  - "wisemen-digital/wisemen-core:packages/web/design-system/src/styles/core/tokens.css"
  - "wisemen-digital/wisemen-core:packages/web/design-system/src/styles/themes/default.css"
  - "wisemen-digital/wisemen-core:packages/web/design-system/src/plugins/i18n.plugin.ts"
---

# @wisemen/vue-core-design-system — Getting Started

## Setup

```typescript
// main.ts
import '@wisemen/vue-core-design-system/style.css'

import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import { locales } from '@wisemen/vue-core-design-system/locales'
import App from './App.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: { ...locales.en, ...yourMessages.en },
    nl: { ...locales.nl, ...yourMessages.nl },
  },
})

const app = createApp(App)
app.use(i18n)
app.mount('#app')
```

```vue
<!-- App.vue -->
<script setup lang="ts">
import { UIThemeProvider } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UIThemeProvider appearance="system" theme="default">
    <RouterView />
  </UIThemeProvider>
</template>
```

UIThemeProvider renders a root `<div>` with CSS classes `default` and `light`/`dark` (or auto-switches via `@media (prefers-color-scheme)` when `appearance="system"`). These classes activate the semantic color tokens defined in the theme CSS. Without this wrapper, tokens like `bg-primary` and `text-secondary` don't resolve.

Peer dependencies: `reka-ui`, `motion-v`, `formango`, `vue-i18n`, `vue-router`, `@vueuse/core`, `@vueuse/router`.

## Core Patterns

### Use semantic tokens instead of raw Tailwind values

The design system defines a custom spacing scale and semantic color tokens. Use them instead of Tailwind defaults:

```vue
<template>
  <!-- Spacing tokens: none, xxs(2), xs(4), sm(6), md(8), lg(12), xl(16), 2xl(20), 3xl(24), 4xl(32), 5xl(40)... -->
  <div class="p-xl gap-md mb-3xl">
    <!-- Semantic color tokens — adapt to light/dark theme automatically -->
    <p class="text-primary">Main text</p>
    <p class="text-secondary">Supporting text</p>
    <p class="text-tertiary">Subtle text</p>
    <span class="text-error-primary">Error</span>

    <div class="bg-primary border border-primary rounded-md shadow-sm">
      Card with semantic background and border
    </div>

    <div class="bg-brand-solid text-primary-on-brand p-lg rounded-lg">
      Brand-colored section
    </div>
  </div>
</template>
```

### Customize tokens for your project

Import `source.css` and override tokens with `@theme inline`:

```css
/* src/styles/main.css */
@import '@wisemen/vue-core-design-system/source.css';

@theme inline {
  --color-brand-500: #3b82f6;
  --color-brand-600: #2563eb;
  --spacing-xl: 18px;
  --radius-md: 6px;
}
```

### Switch appearance dynamically

```vue
<script setup lang="ts">
import { UIThemeProvider } from '@wisemen/vue-core-design-system'
import { ref } from 'vue'
import type { Appearance } from '@wisemen/vue-core-design-system'

const appearance = ref<Appearance>('system')
</script>

<template>
  <UIThemeProvider :appearance="appearance" theme="default">
    <button @click="appearance = appearance === 'light' ? 'dark' : 'light'">
      Toggle theme
    </button>
    <RouterView />
  </UIThemeProvider>
</template>
```

The provider reactively toggles CSS classes — all semantic tokens update instantly.

## Common Mistakes

### CRITICAL: Not importing style.css

```typescript
// All components render as unstyled HTML — no tokens, no layout, no colors
import { UIButton } from '@wisemen/vue-core-design-system'
```

```typescript
import '@wisemen/vue-core-design-system/style.css'
import { UIButton } from '@wisemen/vue-core-design-system'
```

The CSS export (`/style.css`) is a separate entry point from the JS export. It contains all design tokens, component styles, and theme definitions. Without it, nothing is styled.

### CRITICAL: Missing UIThemeProvider

```vue
<!-- bg-primary, text-secondary etc. resolve to nothing — theme classes aren't applied -->
<template>
  <RouterView />
</template>
```

```vue
<template>
  <UIThemeProvider appearance="system" theme="default">
    <RouterView />
  </UIThemeProvider>
</template>
```

UIThemeProvider applies CSS classes (`default`, `light`/`dark`) that scope the semantic token definitions. Without them, tokens like `--color-bg-primary` have no value. The provider also injects context that child components read for appearance-aware behaviour.

Source: `src/ui/theme-provider/ThemeProvider.vue` — renders Primitive with theme and appearance as CSS classes.

### HIGH: Using raw Tailwind spacing instead of token scale

```vue
<!-- p-4 = 16px (Tailwind default), but p-xl = 16px (design token) -->
<!-- Both happen to be 16px today, but they diverge when tokens are customized -->
<div class="p-4 gap-2 m-8">...</div>
```

```vue
<div class="p-xl gap-xs m-4xl">...</div>
```

The design system's spacing scale (`none`, `xxs`–`11xl`) is independent of Tailwind's numeric scale (`1`–`96`). Using numeric values bypasses token customization and breaks consistency with design-system components.

Source: `src/styles/core/tokens.css` — custom spacing tokens registered via `@theme inline`.

## See Also

- [select-usage](../select-usage/SKILL.md) — UISelect with search modes and multi-select
- [dialog-usage](../dialog-usage/SKILL.md) — UIDialog compound pattern and useOverlay
