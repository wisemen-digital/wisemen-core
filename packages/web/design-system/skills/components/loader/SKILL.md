---
name: loader
description: >
  Animated SVG loading spinner that inherits size and color from its parent. Has no
  props -- sized via CSS classes and colored via currentColor.
type: component
library: vue-core-design-system
category: display
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

## Source Files

For usage examples, read the playground file.

- Component: `src/ui/loader/Loader.vue`
- Playground: `src/ui/loader/stories/`

## See Also

- [skeleton-item](../skeleton-item/SKILL.md) -- For content-shaped placeholder loading states
- [button](../button/SKILL.md) -- Has built-in loading state with an integrated loader
