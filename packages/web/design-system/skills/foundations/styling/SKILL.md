---
name: styling
description: >
  Design token system and component styling for @wisemen/vue-core-design-system.
  Covers the custom tv() instance (Tailwind Variants with twMerge), design tokens
  (spacing, colors, typography, shadows, radii, z-index), semantic color system
  (fg/text/bg/border), light/dark theming, and data-attribute-driven styling.
  Load when customizing component styles or understanding the token system.
type: foundation
category: styling
library: vue-core-design-system
library_version: "0.8.0"
sources:
  - "packages/web/design-system/src/styles/tailwindVariants.lib.ts"
  - "packages/web/design-system/src/styles/core/tokens.css"
  - "packages/web/design-system/src/styles/core/colors.css"
  - "packages/web/design-system/src/styles/themes/default.css"
---

# Styling

Design tokens, Tailwind Variants, and theming system.

## Overview

All component styles use `tv()` (Tailwind Variants) with a custom configuration. Colors and spacing are defined as CSS custom properties (design tokens) with semantic naming. Themes (light/dark) swap token values via CSS classes.

## tv() — Custom Tailwind Variants Instance

```ts
// src/styles/tailwindVariants.lib.ts
import { createTV } from 'tailwind-variants'

export const tv = createTV({
  twMerge: true,
  twMergeConfig: {
    extend: {
      classGroups: {
        'font-size': [{ text: ['xxs'] }],
      },
      theme: {
        spacing: [
          'none', 'xxs', 'xs', 'sm', 'md', 'lg', 'xl',
          '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl', '10xl', '11xl',
        ],
      },
    },
  },
})
```

**Key points:**
- `twMerge: true` — later classes override earlier ones (e.g., `px-4 px-6` resolves to `px-6`)
- Custom spacing scale (`none` through `11xl`) is registered so twMerge understands them
- Custom font size `xxs` (11px) is registered

## Component Style Pattern

Every component defines a style factory using `tv()`:

```ts
// button.style.ts
import { tv } from '@/styles/tailwindVariants.lib'

export const createButtonStyle = tv({
  slots: {
    root: 'inline-flex items-center justify-center rounded-lg font-semibold',
    icon: 'size-5',
    loader: 'size-5',
  },
  variants: {
    variant: {
      primary: { root: 'bg-brand-solid text-primary-on-brand' },
      secondary: { root: 'bg-primary border border-primary text-secondary' },
      tertiary: { root: 'text-tertiary' },
    },
    size: {
      xs: { root: 'h-8 gap-xs px-lg text-xs', icon: 'size-4' },
      sm: { root: 'h-9 gap-xs px-lg text-sm' },
      md: { root: 'h-10 gap-xs px-xl text-sm' },
      lg: { root: 'h-11 gap-sm px-xl text-md' },
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})
```

**Usage in component:**

```vue
<script setup lang="ts">
const style = computed(() => createButtonStyle({
  variant: props.variant,
  size: props.size,
}))
</script>

<template>
  <button :class="style.root()">
    <component :is="iconLeft" :class="style.icon()" />
    <slot />
  </button>
</template>
```

### Slots

The `slots` object defines named CSS class groups — one per visual element in the component. Use `style.slotName()` to get the resolved classes.

### Variants

Each variant key maps to a set of slot overrides. When `createButtonStyle({ variant: 'primary', size: 'md' })` is called, it merges the base slot classes with the variant-specific classes.

### Data-Attribute Styling

Components use `data-*` attributes for state-driven styling instead of dynamic class binding:

```ts
// In the template
<div :data-disabled="isDisabled || undefined" :data-error="isError || undefined">

// In the style definition
root: 'border-primary data-disabled:border-disabled data-disabled:bg-disabled-subtle data-error:border-error'
```

Common data attributes: `data-disabled`, `data-error`, `data-interactive`, `data-loading`, `data-active`, `data-checked`, `data-variant`.

## Design Tokens

### Spacing Scale

| Token | Value | Pixels |
|-------|-------|--------|
| `--spacing-none` | 0rem | 0px |
| `--spacing-xxs` | 0.125rem | 2px |
| `--spacing-xs` | 0.25rem | 4px |
| `--spacing-sm` | 0.375rem | 6px |
| `--spacing-md` | 0.5rem | 8px |
| `--spacing-lg` | 0.75rem | 12px |
| `--spacing-xl` | 1rem | 16px |
| `--spacing-2xl` | 1.25rem | 20px |
| `--spacing-3xl` | 1.5rem | 24px |
| `--spacing-4xl` | 2rem | 32px |
| `--spacing-5xl` | 2.5rem | 40px |
| `--spacing-6xl` | 3rem | 48px |
| `--spacing-7xl` | 4rem | 64px |
| `--spacing-8xl` | 5rem | 80px |
| `--spacing-9xl` | 6rem | 96px |
| `--spacing-10xl` | 8rem | 128px |
| `--spacing-11xl` | 10rem | 160px |

In Tailwind classes, use directly: `p-md`, `gap-xl`, `m-3xl`.

### Typography Scale

| Token | Size | Line Height |
|-------|------|-------------|
| `text-xxs` | 11px | 18px |
| `text-xs` | 12px | 18px |
| `text-sm` | 14px | 20px |
| `text-md` | 16px | 24px |
| `text-lg` | 18px | 28px |
| `text-xl` | 20px | 32px |
| `text-2xl` | 24px | 32px |
| `text-3xl` | 30px | 38px |
| `text-4xl` | 36px | 44px |
| `text-5xl` | 48px | 60px |
| `text-6xl` | 60px | 72px |
| `text-7xl` | 72px | 90px |

Font weights: `font-regular` (400), `font-medium` (500), `font-semibold` (600), `font-bold` (700).

### Border Radius

| Token | Value |
|-------|-------|
| `rounded-none` | 0 |
| `rounded-xxs` | 2px |
| `rounded-xs` | 4px |
| `rounded-sm` | 6px |
| `rounded-md` | 8px |
| `rounded-lg` | 10px |
| `rounded-xl` | 12px |
| `rounded-2xl` | 16px |
| `rounded-3xl` | 20px |
| `rounded-4xl` | 24px |
| `rounded-full` | 1000px |

### Shadows

| Token | Usage |
|-------|-------|
| `shadow-xs` | Subtle elevation (inputs, cards) |
| `shadow-sm` | Low elevation (dropdowns) |
| `shadow` | Medium elevation (popovers) |
| `shadow-lg` | High elevation (modals) |

### Z-Index

| Token | Value | Usage |
|-------|-------|-------|
| `z-sticky` | 10 | Sticky headers |
| `z-overlay` | 30 | Overlays |
| `z-modal` | 40 | Modal dialogs |
| `z-tooltip` | 50 | Tooltips |

## Semantic Color System

Colors are organized in semantic layers. Use semantic tokens, not raw color values.

### Foreground (`fg-*`)

For icons and interactive indicators:
`fg-primary`, `fg-secondary`, `fg-tertiary`, `fg-quaternary`, `fg-disabled`, `fg-brand-primary`, `fg-error-primary`, `fg-warning-primary`, `fg-success-primary`

### Text (`text-*`)

For text content:
`text-primary`, `text-secondary`, `text-tertiary`, `text-quaternary`, `text-disabled`, `text-placeholder`, `text-brand-primary`, `text-error-primary`, `text-primary-on-brand`

### Background (`bg-*`)

For surfaces:
`bg-primary`, `bg-secondary`, `bg-tertiary`, `bg-active`, `bg-disabled`, `bg-disabled-subtle`, `bg-overlay`, `bg-brand-primary`, `bg-brand-solid`, `bg-error-primary`, `bg-success-primary`

### Border (`border-*`)

For borders:
`border-primary`, `border-secondary`, `border-tertiary`, `border-disabled`, `border-brand`, `border-error`

## Theming

Themes are applied via CSS classes on a wrapper element (typically `<body>` or a provider):

```css
.light {
  --fg-primary: var(--gray-900);
  --bg-primary: var(--white);
  --border-primary: var(--gray-300);
  /* ... */
}

.dark {
  --fg-primary: var(--gray-50);
  --bg-primary: var(--gray-950);
  --border-primary: var(--gray-700);
  /* ... */
}
```

Use `UIThemeProvider` to manage theme switching. See [theme-provider](../../components/theme-provider/SKILL.md).

## Color Palette

Raw colors available (each has shades 25-950):
`brand`, `error`, `warning`, `success`, `blue`, `pink`, `purple`, `gray`

Always prefer semantic tokens (`text-primary`, `bg-brand-solid`) over raw colors (`gray-900`, `brand-600`). Semantic tokens automatically adapt to light/dark themes.

## Common Mistakes

### CRITICAL: Using raw Tailwind colors instead of semantic tokens

Wrong:
```html
<div class="text-gray-900 bg-white border-gray-300">
```

Correct:
```html
<div class="text-primary bg-primary border-primary">
```

Raw colors don't switch in dark mode. Semantic tokens do.

### HIGH: Forgetting twMerge handles custom spacing

Wrong (thinking custom spacing conflicts):
```ts
// Manually removing classes before adding new ones
root: props.compact ? 'p-sm' : 'p-xl'
```

Correct (twMerge resolves it):
```ts
// Just merge — twMerge knows the custom scale
<div :class="style.root({ class: 'p-sm' })" />
```

The custom `tv()` instance registers the full spacing scale in twMerge.

### MEDIUM: Using inline styles for token values

Wrong:
```html
<div style="padding: 8px; color: #344054;">
```

Correct:
```html
<div class="p-md text-primary">
```

Always use Tailwind utility classes that reference the token system.

## See Also

- [Architecture](../architecture/SKILL.md) — How components use tv() in the parts pattern
- [Input System](../input-system/SKILL.md) — How input components apply styles
