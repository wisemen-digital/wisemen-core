---
name: scrollable
description: >
  Scrollable container that shows gradient fade indicators at the top/bottom when content
  overflows. Supports infinite scroll via an onNext callback. Load this skill when building
  scrollable lists, panels, or any container that needs visual scroll cues.
type: component
library: vue-core-design-system
category: layout
exports:
  - UIScrollable
---

# UIScrollable

A scrollable container that renders gradient overlays at the top and bottom edges when the user scrolls, providing visual cues that more content exists. Optionally triggers infinite-scroll loading via `onNext`.

## When to Use

- Wrapping a list or panel that may overflow its container and needs scroll-fade indicators
- Building an infinite-scroll list that fetches the next page when the user nears the bottom
- Any container where you want subtle visual cues that content extends beyond the visible area

**Use instead:** A plain `overflow-auto` div when you do not need gradient indicators or infinite scroll.

## Import

```ts
// UIScrollable is not yet part of the public exports — import from the source path within the design-system package
import { UIScrollable } from '@wisemen/vue-core-design-system/src/ui/scrollable'
```

> **Note:** `UIScrollable` is currently internal. Once it is added to the public exports, import from `@wisemen/vue-core-design-system` instead.

## Quick Start

```vue
<script setup lang="ts">
import { UIScrollable } from '@wisemen/vue-core-design-system/src/ui/scrollable'
</script>

<template>
  <UIScrollable>
    <div v-for="i in 100" :key="i">
      Item {{ i }}
    </div>
  </UIScrollable>
</template>
```

## Source Files

For full API details, read the component file.

- Component: `src/ui/scrollable/Scrollable.vue`

## See Also

- [page](../page/SKILL.md) -- Dashboard page layout that may contain scrollable areas
