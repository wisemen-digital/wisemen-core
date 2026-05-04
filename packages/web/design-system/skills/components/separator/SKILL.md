---
name: separator
description: >
  A horizontal or vertical divider line built on Reka UI's Separator primitive.
  Supports horizontal and vertical orientations. Load this skill when you need
  a visual divider between sections or inline elements.
type: component
library: vue-core-design-system
library_version: "0.8.0"
category: display
requires: []
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

## API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | The orientation of the separator. |
| `class` | `string` | `undefined` | Additional CSS classes to apply to the separator. |

### Slots

This component has no slots.

### Emits

This component has no custom events.

## Variants

### Orientation

| Orientation | CSS Classes | Description |
|-------------|-------------|-------------|
| `horizontal` | `h-px w-full` | Full-width horizontal line (default) |
| `vertical` | `h-full w-px` | Full-height vertical line |

## Examples

### Horizontal Separator

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

### Vertical Separator

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

### Inside a Card

```vue
<script setup lang="ts">
import { UICard } from '@wisemen/vue-core-design-system'
import { UISeparator } from '@wisemen/vue-core-design-system'
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

## Anatomy

```
UISeparator
└── <Separator>  (Reka UI primitive, role="presentation")
```

## Styling

**Style file:** `src/ui/separator/separator.style.ts`
**tv() slots:** `separator`
**Customization:** The base style is `bg-tertiary`. Orientation variants control dimensions: `h-px w-full` for horizontal, `h-full w-px` for vertical. Pass additional classes via the `class` prop to customize color or spacing (e.g., `class="my-lg"` for vertical margin).

## Common Mistakes

### MEDIUM: Vertical separator not visible without parent height

Wrong:
```vue
<!-- Vertical separator has h-full but parent has no height -->
<div class="flex items-center gap-sm">
  <span>Left</span>
  <UISeparator orientation="vertical" />
  <span>Right</span>
</div>
```

Correct:
```vue
<!-- Parent has a fixed height so the vertical separator is visible -->
<div class="flex h-6 items-center gap-sm">
  <span>Left</span>
  <UISeparator orientation="vertical" />
  <span>Right</span>
</div>
```

The vertical separator uses `h-full`, so it requires a parent with a defined height. Without it, the separator collapses to zero height and becomes invisible.

## Accessibility

UISeparator renders the Reka UI `<Separator>` primitive with `role="presentation"`, indicating it is purely decorative. It has no keyboard interaction and is ignored by screen readers. Use it only for visual separation; do not rely on it to convey structural meaning.

## See Also

- [UICard](../card/SKILL.md) -- Common container where separators divide sections
- [UIRowLayout](../row-layout/SKILL.md) -- Horizontal layout where vertical separators are used
