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

For full API details, read the props file.

- Props: `src/ui/skeleton-item/skeletonItem.props.ts`
- Component: `src/ui/skeleton-item/SkeletonItem.vue`

## See Also

- [loader](../loader/SKILL.md) -- For a simple spinning loading indicator
- [card](../card/SKILL.md) -- Often wraps skeleton layouts during loading states
