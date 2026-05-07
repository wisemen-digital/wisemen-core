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
  <UISeparator />
</template>
```

## Source Files

- Props: `src/ui/separator/separator.props.ts`
- Styles: `src/ui/separator/separator.style.ts`
- Component: `src/ui/separator/Separator.vue`

## Examples

### Horizontal separator

```vue
<script setup lang="ts">
import { UISeparator } from '@wisemen/vue-core-design-system'
</script>

<template>
  <div class="flex w-64 flex-col gap-sm">
    <span class="text-sm text-primary">Section above</span>
    <UISeparator />
    <span class="text-sm text-primary">Section below</span>
  </div>
</template>
```

### Vertical separator

```vue
<script setup lang="ts">
import { UISeparator } from '@wisemen/vue-core-design-system'
</script>

<template>
  <div class="flex h-6 items-center gap-sm">
    <span class="text-sm text-primary">Left</span>
    <UISeparator orientation="vertical" />
    <span class="text-sm text-primary">Right</span>
  </div>
</template>
```

### Inside a card

```vue
<script setup lang="ts">
import { UICard, UISeparator } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UICard>
    <div class="p-xl">
      <h3 class="text-lg font-semibold text-primary">Title</h3>
    </div>
    <UISeparator />
    <div class="p-xl">
      <p class="text-sm text-secondary">Content below the separator</p>
    </div>
  </UICard>
</template>
```

## See Also

- [card](../card/SKILL.md) -- Common container where separators divide sections
- [row-layout](../row-layout/SKILL.md) -- Horizontal layout where vertical separators are used
