---
name: column-layout
description: >
  Vertical flex container with configurable gap, alignment, and justification using
  design-token spacing. Renders as a customizable HTML element.
type: component
library: vue-core-design-system
category: layout
requires:
  - layout-system
exports:
  - UIColumnLayout
---

# UIColumnLayout

Vertical flex container with token-based gap, cross-axis alignment, and main-axis justification.

## When to Use

- Stacking form fields, cards, or sections vertically with consistent spacing
- Building page content areas or sidebar sections
- Any vertical arrangement where you need design-token spacing rather than raw Tailwind

**Use instead:** `UIRowLayout` for horizontal arrangement.

## Import

```ts
import { UIColumnLayout } from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import { UIColumnLayout } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UIColumnLayout gap="xl">
    <div class="rounded-lg border p-4">Section 1</div>
    <div class="rounded-lg border p-4">Section 2</div>
    <div class="rounded-lg border p-4">Section 3</div>
  </UIColumnLayout>
</template>
```

## Source Files

For full API details, read the props file. For usage examples, read the playground file.

- Props: `src/ui/column-layout/columnLayout.props.ts`
- Component: `src/ui/column-layout/ColumnLayout.vue`
- Playground: `src/ui/column-layout/stories/`

## See Also

- [row-layout](../row-layout/SKILL.md) -- Horizontal flex container with the same gap/align/justify API
