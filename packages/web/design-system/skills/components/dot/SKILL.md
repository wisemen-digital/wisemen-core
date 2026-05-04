---
name: dot
description: >
  Small colored circle used as a status indicator. Supports 8 color variants
  and 3 sizes. Load this skill when you need a visual status dot, online/offline
  indicator, or colored bullet point.
type: component
library: vue-core-design-system
library_version: "0.8.0"
category: display
requires: []
exports:
  - UIDot
  - UIDotProps
  - UIDotColor
  - UIDotSize
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
  <UIDot color="success" size="md" />
</template>
```

## API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `'blue' \| 'brand' \| 'error' \| 'gray' \| 'pink' \| 'purple' \| 'success' \| 'warning'` | `'gray'` | The color of the dot. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | The size of the dot. |

### Slots

This component has no slots.

### Emits

This component has no custom events.

## Variants

### Size

| Size | CSS Class | Approximate Pixels |
|------|-----------|-------------------|
| `sm` | `size-1` | 4px |
| `md` | `size-1.5` | 6px |
| `lg` | `size-2` | 8px |

### Color

| Color | CSS Class |
|-------|-----------|
| `blue` | `bg-blue-500` |
| `brand` | `bg-brand-500` |
| `error` | `bg-error-500` |
| `gray` | `bg-gray-400` |
| `pink` | `bg-pink-500` |
| `purple` | `bg-purple-500` |
| `success` | `bg-success-500` |
| `warning` | `bg-warning-500` |

## Examples

### Status Indicator Next to a Label

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

### Multiple Status Dots

```vue
<script setup lang="ts">
import { UIDot } from '@wisemen/vue-core-design-system'
</script>

<template>
  <div class="flex flex-col gap-sm">
    <div class="flex items-center gap-xs">
      <UIDot color="success" />
      <span class="text-sm text-primary">Active</span>
    </div>
    <div class="flex items-center gap-xs">
      <UIDot color="warning" />
      <span class="text-sm text-primary">Pending</span>
    </div>
    <div class="flex items-center gap-xs">
      <UIDot color="error" />
      <span class="text-sm text-primary">Failed</span>
    </div>
  </div>
</template>
```

## Anatomy

```
UIDot
└── <div>  (rounded-full colored circle)
```

## Styling

**Style file:** `src/ui/dot/dot.style.ts`
**tv() slots:** None (single-element, uses `tv()` with `base` only)
**Customization:** Pass a `class` attribute to override or extend the default styles. The dot uses `shrink-0 rounded-full` as its base classes, with color and size applied via variants.

## Common Mistakes

### LOW: Forgetting the dot is purely decorative

Wrong:
```vue
<UIDot color="error" />
<!-- Screen reader gets no context -->
```

Correct:
```vue
<div class="flex items-center gap-xs">
  <UIDot color="error" />
  <span class="text-sm text-primary">Error</span>
</div>
```

The dot is a visual-only element with no semantic meaning. Always pair it with a text label so the status is communicated to screen readers.

## Accessibility

UIDot renders a plain `<div>` with no ARIA attributes. It is purely decorative and should always be accompanied by visible text or an `aria-label` on a parent element that conveys the status meaning. The dot itself has no keyboard interaction.

## See Also

- [UIBadge](../badge/SKILL.md) -- For labeled status tags with text
- [UINumberBadge](../number-badge/SKILL.md) -- For numeric count indicators
