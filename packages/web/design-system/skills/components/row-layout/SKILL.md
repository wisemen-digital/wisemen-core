---
name: row-layout
description: >
  Horizontal flex container with configurable gap, alignment, and justification using
  design-token spacing. Renders as a customizable HTML element.
type: component
library: vue-core-design-system
category: layout
requires:
  - layout-system
exports:
  - UIRowLayout
---

# UIRowLayout

Horizontal flex container with token-based gap, cross-axis alignment, and main-axis justification.

## When to Use

- Placing buttons, badges, or controls side by side with consistent spacing
- Building action bars, toolbars, or inline form layouts
- Any horizontal arrangement where you need design-token spacing rather than raw Tailwind

**Use instead:** `UIColumnLayout` for vertical stacking.

## Import

```ts
import { UIRowLayout } from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import { UIRowLayout, UIButton } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UIRowLayout gap="lg" align="center" justify="between">
    <UIButton label="Cancel" variant="secondary" />
    <UIButton label="Save" />
  </UIRowLayout>
</template>
```

## Source Files

For full API details, read the props file. For usage examples, read the playground file.

- Props: `src/ui/row-layout/rowLayout.props.ts`
- Component: `src/ui/row-layout/RowLayout.vue`
- Playground: `src/ui/row-layout/stories/`

## See Also

- [column-layout](../column-layout/SKILL.md) -- Vertical flex container with the same gap/align/justify API
