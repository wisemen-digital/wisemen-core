---
name: scrollable
description: >
  Scrollable container that shows gradient fade indicators at the top/bottom when content
  overflows. Supports infinite scroll via an onNext callback. Load this skill when building
  scrollable lists, panels, or any container that needs visual scroll cues.
type: component
library: vue-core-design-system
category: layout
requires: []
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
import { UIScrollable } from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import { UIScrollable } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UIScrollable>
    <div v-for="i in 100" :key="i">
      Item {{ i }}
    </div>
  </UIScrollable>
</template>
```

## API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `string \| Component` | `'div'` | The HTML element or Vue component used for the scrollable inner container. |
| `distance` | `number` | `250` | Pixel distance from the bottom at which `onNext` is triggered (infinite scroll threshold). |
| `onNext` | `() => Promise<void> \| void` | `undefined` | Callback invoked when the user scrolls within `distance` pixels of the bottom. Use for pagination / infinite scroll. |

### Slots

| Slot | Description |
|------|-------------|
| `default` | Content rendered inside the scrollable area. |

### Emits

This component has no custom events.

## Variants

This component has no size/variant/color options.

## Examples

### Infinite Scroll

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UIScrollable } from '@wisemen/vue-core-design-system'

const items = ref<string[]>(Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`))

async function loadMore(): Promise<void> {
  const start = items.value.length
  const next = Array.from({ length: 20 }, (_, i) => `Item ${start + i + 1}`)
  items.value.push(...next)
}
</script>

<template>
  <div class="h-64">
    <UIScrollable :on-next="loadMore" :distance="200">
      <div v-for="item in items" :key="item" class="p-2">
        {{ item }}
      </div>
    </UIScrollable>
  </div>
</template>
```

### Custom Element Type

```vue
<script setup lang="ts">
import { UIScrollable } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UIScrollable as="ul">
    <li v-for="i in 50" :key="i">
      List item {{ i }}
    </li>
  </UIScrollable>
</template>
```

## Anatomy

```
div.relative.flex.size-full.flex-col.overflow-hidden
  div (top gradient, shown when scrolled from top)
  div (bottom gradient, shown when scrolled from bottom)
  Primitive[as] .overflow-auto  (scrollable content)
    <slot />
```

## Styling

**Style file:** This component uses inline Tailwind classes (no separate style file).
**Gradient overlays:** `from-primary to-transparent`, height `h-8`, positioned absolute at top/bottom with `z-1`.

The gradients use `bg-linear-to-b` (top) and `bg-linear-to-t` (bottom) with the `from-primary` color token, so they blend with the page background.

## Common Mistakes

### MEDIUM: Forgetting to set a fixed height on the parent

Wrong:
```vue
<UIScrollable>
  <!-- Content will never overflow because the container grows unbounded -->
  <div v-for="i in 100" :key="i">{{ i }}</div>
</UIScrollable>
```

Correct:
```vue
<div class="h-64">
  <UIScrollable>
    <div v-for="i in 100" :key="i">{{ i }}</div>
  </UIScrollable>
</div>
```

UIScrollable uses `size-full` on its root, so it fills its parent. The parent must have a constrained height for overflow to occur and gradients to appear.

### LOW: Passing an async onNext without handling errors

Wrong:
```vue
<UIScrollable :on-next="fetchNextPage" />
```

Correct:
```vue
<UIScrollable :on-next="handleLoadMore" />
```

```ts
async function handleLoadMore(): Promise<void> {
  try {
    await fetchNextPage()
  } catch (error) {
    // handle error gracefully
  }
}
```

Unhandled promise rejections in `onNext` can silently break infinite scroll. Wrap async logic in try/catch.

## Accessibility

- The scrollable area is a plain `div` (or custom `as` element) with native browser scrolling.
- Gradient overlays are `pointer-events-none`, so they do not block interaction with content beneath them.
- The component relies on native scroll behavior, which is keyboard-accessible by default (arrow keys, Page Up/Down, Home/End).

## See Also

- [UIColumnLayout](../column-layout/) -- For stacking content vertically with consistent gap spacing
