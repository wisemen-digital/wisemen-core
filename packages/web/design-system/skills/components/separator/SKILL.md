---
name: separator
description: >
  A horizontal or vertical divider line built on Reka UI's Separator primitive.
  Supports horizontal and vertical orientations.
type: component
library: vue-core-design-system
category: display
exports:
  - UISeparator
---

# UISeparator

A thin line that visually separates content sections, available in horizontal or vertical orientation.

## When to Use

- Dividing sections within a card or panel
- Separating items in a horizontal toolbar or row
- Creating a visual break between content blocks

**Use instead:** A border class (e.g., `border-b border-secondary`) when you need a separator that is part of an element's styling rather than a standalone element.

## Import

```ts
import { UISeparator } from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import { UISeparator } from '@wisemen/vue-core-design-system'
</script>

<template>
     <UISeparator orientation="vertical" />
</template>
```

## Source Files

For full API details, read the props file. For usage examples, read the playground file.

- Props: `src/ui/separator/separator.props.ts`
- Component: `src/ui/separator/Separator.vue`
- Playground: `src/ui/separator/stories/`

## See Also

- [card](../card/SKILL.md) -- Common container where separators divide sections
- [row-layout](../row-layout/SKILL.md) -- Horizontal layout where vertical separators are used
