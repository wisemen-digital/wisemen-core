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

- Component: `src/ui/loader/Loader.vue`

## Examples

### Different sizes

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

### Centered full-page loader

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

### Inline loading state

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

## See Also

- [skeleton-item](../skeleton-item/SKILL.md) -- For content-shaped placeholder loading states
- [button](../button/SKILL.md) -- Has built-in loading state with an integrated loader
