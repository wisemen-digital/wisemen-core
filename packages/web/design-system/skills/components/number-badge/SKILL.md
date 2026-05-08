---
name: number-badge
description: >
  Small pill-shaped badge that displays a numeric value with color and variant options.
  Useful for counts, notification indicators, and numeric status labels.
type: component
library: vue-core-design-system
category: display
exports:
  - UINumberBadge
---

# UINumberBadge

A compact, pill-shaped badge that displays a formatted numeric value. Supports multiple colors, sizes, and visual variants (translucent, outline, solid).

## When to Use

- Displaying notification counts (e.g., unread messages)
- Showing numeric status indicators (e.g., item counts, scores)
- Labeling quantities in tables, lists, or navigation items

**Use instead:** `UIBadge` when you need text labels, icons, dots, or avatars inside the badge.

## Import

```ts
import { UINumberBadge } from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import { UINumberBadge } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UINumberBadge value="5" />
</template>
```

## Source Files

For full API details, read the props file. For usage examples, read the playground files.

- Props: `src/ui/number-badge/numberBadge.props.ts`
- Component: `src/ui/number-badge/NumberBadge.vue`
- Playground: `src/ui/number-badge/stories/`

## See Also

- [badge](../badge/SKILL.md) -- For labeled status tags with text, icons, or dots
- [dot](../dot/SKILL.md) -- For simple colored status circles
