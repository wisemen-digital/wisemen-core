---
name: dot
description: >
  Small colored circle used as a status indicator. Supports 8 color variants
  and 3 sizes. Load this skill when you need a visual status dot, online/offline
  indicator, or colored bullet point.
type: component
library: vue-core-design-system
category: display
exports:
  - UIDot
---

# UIDot

A small colored circle that visually communicates status or category.

## When to Use

- Indicating online/offline or active/inactive status next to a label
- Color-coding items in a list (e.g., priority, category)
- Showing a simple presence or availability indicator

**Use instead:** `UIBadge` for labeled status tags, `UINumberBadge` for numeric counts.

## Import

```ts
import { UIDot } from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import { UIDot } from '@wisemen/vue-core-design-system'
</script>

<template>
  <div class="flex items-center gap-xs">
    <UIDot color="success" size="md" />
    <span class="text-sm text-primary">Online</span>
  </div>
</template>
```

## Source Files

For full API details, read the props file.

- Props: `src/ui/dot/dot.props.ts`
- Component: `src/ui/dot/Dot.vue`

## See Also

- [badge](../badge/SKILL.md) -- For labeled status tags with text
- [number-badge](../number-badge/SKILL.md) -- For numeric count indicators
