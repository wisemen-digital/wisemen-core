---
name: skeleton-item
description: >
  A loading placeholder element with optional shimmer animation. Renders as a
  rounded rectangle that mimics content layout while data loads.
type: component
library: vue-core-design-system
category: display
exports:
  - UISkeletonItem
---

# UISkeletonItem

A rectangular placeholder with optional shimmer animation used to represent loading content.

## When to Use

- Building skeleton screens that mimic the layout of content while it loads
- Replacing text, images, or cards with placeholder shapes during data fetching
- Creating staggered loading animations with multiple skeleton items

**Use instead:** `UILoader` for a simple spinning indicator.

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

## Source Files

- Props: `src/ui/skeleton-item/skeletonItem.props.ts`
- Component: `src/ui/skeleton-item/SkeletonItem.vue`

## Examples

### Skeleton card layout

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

### Skeleton with avatar and text

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

## See Also

- [loader](../loader/SKILL.md) -- For a simple spinning loading indicator
- [card](../card/SKILL.md) -- Often wraps skeleton layouts during loading states
