---
name: skeleton-item
description: >
  A loading placeholder element with optional shimmer animation. Renders as a
  rounded rectangle that mimics content layout while data loads. Load this skill
  when building skeleton loading screens or placeholder UIs.
type: component
library: vue-core-design-system
library_version: "0.8.0"
category: display
requires: []
exports:
  - UISkeletonItem
---

# UISkeletonItem

A rectangular placeholder with optional shimmer animation used to represent loading content.

## When to Use

- Building skeleton screens that mimic the layout of content while it loads
- Replacing text, images, or cards with placeholder shapes during data fetching
- Creating staggered loading animations with multiple skeleton items

**Use instead:** `UILoader` for a simple spinning indicator, or a custom loading state when the skeleton layout does not match the final content.

## Import

```ts
import { UISkeletonItem } from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import { UISkeletonItem } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UISkeletonItem class="h-4 w-48" :animate="true" />
</template>
```

## API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `animate` | `boolean` | `false` | Whether the skeleton item should display a shimmer animation. |
| `animationDelayInMs` | `number` | `0` | The animation delay in milliseconds before the shimmer starts. Useful for staggering multiple skeletons. |

### Slots

This component has no slots.

### Emits

This component has no custom events.

## Variants

This component has no built-in size or color variants. Control dimensions via CSS classes:

| Shape | Classes |
|-------|---------|
| Text line | `class="h-4 w-48"` |
| Short text | `class="h-4 w-24"` |
| Heading | `class="h-6 w-64"` |
| Avatar circle | `class="size-8 rounded-full"` |
| Card block | `class="h-32 w-full"` |
| Thumbnail | `class="size-16"` |

## Examples

### Single Skeleton Line

```vue
<script setup lang="ts">
import { UISkeletonItem } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UISkeletonItem class="h-4 w-48" :animate="true" />
</template>
```

### Skeleton Card Layout

```vue
<script setup lang="ts">
import { UISkeletonItem } from '@wisemen/vue-core-design-system'
</script>

<template>
  <div class="flex flex-col gap-md">
    <UISkeletonItem class="h-6 w-40" :animate="true" />
    <UISkeletonItem class="h-4 w-64" :animate="true" :animation-delay-in-ms="100" />
    <UISkeletonItem class="h-4 w-56" :animate="true" :animation-delay-in-ms="200" />
    <UISkeletonItem class="h-4 w-32" :animate="true" :animation-delay-in-ms="300" />
  </div>
</template>
```

### Skeleton with Avatar and Text

```vue
<script setup lang="ts">
import { UISkeletonItem } from '@wisemen/vue-core-design-system'
</script>

<template>
  <div class="flex items-center gap-md">
    <UISkeletonItem class="size-10 shrink-0 rounded-full" :animate="true" />
    <div class="flex flex-col gap-xs">
      <UISkeletonItem class="h-4 w-32" :animate="true" :animation-delay-in-ms="50" />
      <UISkeletonItem class="h-3 w-48" :animate="true" :animation-delay-in-ms="100" />
    </div>
  </div>
</template>
```

### Static Skeleton (No Animation)

```vue
<script setup lang="ts">
import { UISkeletonItem } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UISkeletonItem class="h-4 w-48" />
</template>
```

## Anatomy

```
UISkeletonItem
└── <div role="status" aria-busy="true" aria-live="polite">
    └── <div v-if="animate" class="shimmer">  (animated overlay)
```

## Styling

**Style file:** None (styles are scoped CSS in the component)
**tv() slots:** None
**Customization:** The outer container uses `rounded-md bg-tertiary` (light) / `bg-secondary` (dark) with `overflow-hidden`. Dimensions must be set via CSS classes on the component (e.g., `class="h-4 w-48"`). The shimmer effect is a CSS animation using a `linear-gradient` that translates horizontally over 1.5s. Override `rounded-md` with `rounded-full` for circular skeleton shapes.

## Common Mistakes

### HIGH: Not setting dimensions

Wrong:
```vue
<!-- Skeleton collapses to zero size -->
<UISkeletonItem :animate="true" />
```

Correct:
```vue
<UISkeletonItem class="h-4 w-48" :animate="true" />
```

UISkeletonItem has no intrinsic dimensions. You must always provide height and width via CSS classes.

### MEDIUM: Not staggering animation delays

Wrong:
```vue
<!-- All items shimmer in sync, looks unnatural -->
<UISkeletonItem class="h-4 w-48" :animate="true" />
<UISkeletonItem class="h-4 w-32" :animate="true" />
<UISkeletonItem class="h-4 w-56" :animate="true" />
```

Correct:
```vue
<!-- Staggered delays create a wave effect -->
<UISkeletonItem class="h-4 w-48" :animate="true" :animation-delay-in-ms="0" />
<UISkeletonItem class="h-4 w-32" :animate="true" :animation-delay-in-ms="100" />
<UISkeletonItem class="h-4 w-56" :animate="true" :animation-delay-in-ms="200" />
```

Staggering `animationDelayInMs` across multiple skeleton items creates a more natural wave-like shimmer effect.

## Accessibility

UISkeletonItem renders with `role="status"`, `aria-busy="true"`, and `aria-live="polite"`. This tells screen readers that the region is in a loading state and will announce content changes when loading completes. No keyboard interaction is needed.

## See Also

- [UILoader](../loader/SKILL.md) -- For a simple spinning loading indicator
- [UICard](../card/SKILL.md) -- Often wraps skeleton layouts during loading states
