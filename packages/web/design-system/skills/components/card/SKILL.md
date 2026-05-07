---
name: card
description: >
  Simple bordered container with rounded corners for grouping related content.
  Has no props -- content goes in the default slot.
type: component
library: vue-core-design-system
category: display
exports:
  - UICard
---

# UICard

A minimal bordered container with rounded corners for visually grouping related content.

## When to Use

- Wrapping a section of content in a visual card (e.g., settings panel, detail section)
- Creating bordered containers for dashboard widgets or info blocks
- Grouping form fields or related items into a distinct visual area

**Use instead:** A plain `<div>` with custom border classes for non-standard card designs, or `UIDialog` for modal content.

## Import

```ts
import { UICard } from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import { UICard } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UICard>
    <div class="p-xl">
      <p>Card content goes here</p>
    </div>
  </UICard>
</template>
```

## Source Files

- Component: `src/ui/card/Card.vue`

## Examples

### Card with title and content

```vue
<script setup lang="ts">
import { UICard } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UICard>
    <div class="p-xl">
      <h3 class="text-lg font-semibold text-primary">Card Title</h3>
      <p class="mt-sm text-sm text-secondary">
        This is some descriptive content inside a card.
      </p>
    </div>
  </UICard>
</template>
```

### Card with sections separated by dividers

```vue
<script setup lang="ts">
import { UICard, UISeparator } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UICard>
    <div class="p-xl">
      <h3 class="text-lg font-semibold text-primary">Header</h3>
    </div>
    <UISeparator />
    <div class="p-xl">
      <p class="text-sm text-secondary">Body content</p>
    </div>
    <UISeparator />
    <div class="flex justify-end p-xl">
      <span class="text-sm text-tertiary">Footer</span>
    </div>
  </UICard>
</template>
```

## See Also

- [separator](../separator/SKILL.md) -- For dividing sections within a card
- [column-layout](../column-layout/SKILL.md) -- For stacking content vertically inside a card
