---
name: loader
description: >
  Animated SVG loading spinner that inherits size and color from its parent. Has no
  props -- sized via CSS classes and colored via currentColor. Load this skill when
  you need a spinning loading indicator.
type: component
library: vue-core-design-system
category: display
requires: []
exports:
  - UILoader
---

# UILoader

An animated circular SVG spinner that inherits its size and color from the parent element.

## When to Use

- Showing a loading state while data is being fetched
- Indicating processing inside a button or container
- Displaying a full-page or inline loading indicator

**Use instead:** `UISkeletonItem` for placeholder loading states that mimic content layout.

## Import

```ts
import { UILoader } from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import { UILoader } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UILoader class="size-6 text-primary" />
</template>
```

## API

### Props

This component has no props. Size and color are controlled via CSS classes.

### Slots

This component has no slots.

### Emits

This component has no custom events.

## Variants

This component has no built-in variants. Control appearance through CSS classes:

| Need | Class Example |
|------|---------------|
| Small spinner | `class="size-4"` |
| Medium spinner | `class="size-6"` |
| Large spinner | `class="size-8"` |
| Brand color | `class="text-brand-500"` |
| Primary color | `class="text-primary"` |
| White (on dark bg) | `class="text-white"` |

## Examples

### Different Sizes

```vue
<script setup lang="ts">
import { UILoader } from '@wisemen/vue-core-design-system'
</script>

<template>
  <div class="flex items-center gap-8">
    <UILoader class="size-4 text-primary" />
    <UILoader class="size-6 text-primary" />
    <UILoader class="size-8 text-primary" />
  </div>
</template>
```

### Centered Full-Page Loader

```vue
<script setup lang="ts">
import { UILoader } from '@wisemen/vue-core-design-system'
</script>

<template>
  <div class="flex h-full items-center justify-center">
    <UILoader class="size-8 text-brand-500" />
  </div>
</template>
```

### Inline Loading State

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UILoader } from '@wisemen/vue-core-design-system'

const isLoading = ref(true)
</script>

<template>
  <div class="flex items-center gap-sm">
    <UILoader v-if="isLoading" class="size-4 text-secondary" />
    <span class="text-sm text-secondary">Loading results...</span>
  </div>
</template>
```

## Anatomy

```
UILoader
└── <svg viewBox="25 25 50 50" aria-hidden="true">
    └── <circle>  (animated stroke-dasharray spinner)
```

## Styling

**Style file:** None (styles are scoped CSS in the component)
**tv() slots:** None
**Customization:** Size is controlled via Tailwind `size-*` classes on the component root. Color is controlled via `text-*` classes, since the SVG stroke uses `currentColor`. The animation is defined in scoped `<style>` with two keyframes: a 2s rotation and a 1.5s dash animation.

## Common Mistakes

### HIGH: Not setting a size class

Wrong:
```vue
<!-- SVG will be unsized and may not display correctly -->
<UILoader />
```

Correct:
```vue
<UILoader class="size-6 text-primary" />
```

UILoader is a raw SVG with no default dimensions. You must provide a size class (e.g., `size-4`, `size-6`, `size-8`) for it to render at the intended size.

### MEDIUM: Using fill-based color classes

Wrong:
```vue
<!-- fill classes won't work; the spinner uses stroke -->
<UILoader class="size-6 fill-brand-500" />
```

Correct:
```vue
<UILoader class="size-6 text-brand-500" />
```

The spinner SVG uses `stroke="currentColor"`, so it inherits color from the CSS `color` property. Use `text-*` utility classes to set the color.

## Accessibility

The SVG element has `aria-hidden="true"` since it is a decorative loading indicator. When using UILoader, pair it with visible text (e.g., "Loading...") or use `aria-live="polite"` on a parent container along with a screen-reader-only message to announce the loading state.

## See Also

- [UISkeletonItem](../skeleton-item/SKILL.md) -- For content-shaped placeholder loading states
- [UIButton](../button/SKILL.md) -- Has built-in loading state with an integrated loader
