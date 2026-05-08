---
name: number-badge
description: >
  Small pill-shaped badge that displays a numeric value with color and variant options.
  Useful for counts, notification indicators, and numeric status labels. Load this skill
  when you need to show a number inside a colored badge.
type: component
library: vue-core-design-system
category: display
requires: []
exports:
  - UINumberBadge
  - UINumberBadgeProps
---

# UINumberBadge

A compact, pill-shaped badge that displays a formatted numeric value. Supports multiple colors, sizes, and visual variants (translucent, outline, solid).

## When to Use

- Displaying notification counts (e.g., unread messages)
- Showing numeric status indicators (e.g., item counts, scores)
- Labeling quantities in tables, lists, or navigation items

**Use instead:** `UIBadge` when you need text labels, icons, dots, or avatars inside the badge. Use plain text for inline numbers that do not need visual emphasis.

## Import

```ts
import { UINumberBadge } from '@wisemen/vue-core-design-system'
import type { UINumberBadgeProps } from '@wisemen/vue-core-design-system'
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

## API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | **(required)** | The number to display. Always pass a pre-formatted string (e.g., `"1.400"`, `"4,5"`). |
| `ariaLabel` | `string \| null` | `null` | Accessible label for screen readers. When `null`, the badge value is used. |
| `color` | `UtilityColor` | `'gray'` | The color theme. One of: `'blue'`, `'brand'`, `'error'`, `'gray'`, `'pink'`, `'purple'`, `'success'`, `'warning'`. |
| `size` | `'lg' \| 'md'` | `'md'` | The size of the badge. `'md'` = 16px height, `'lg'` = 20px height. |
| `variant` | `'outline' \| 'solid' \| 'translucent'` | `'translucent'` | The visual style. `translucent` = tinted background, `outline` = border only, `solid` = filled background. |

### Slots

This component has no slots.

### Emits

This component has no custom events.

## Variants

### Sizes

| Size | Height | Font size |
|------|--------|-----------|
| `md` | `h-4` (16px) | `text-[0.625rem]` (10px) |
| `lg` | `h-5` (20px) | `text-xs` (12px) |

### Visual Variants

| Variant | Description |
|---------|-------------|
| `translucent` | Tinted background with colored text and subtle border |
| `outline` | Transparent background with colored border and text |
| `solid` | Filled background with white (or on-brand) text |

### Colors

All `UtilityColor` values: `gray`, `brand`, `blue`, `pink`, `error`, `success`, `warning`, `purple`.

## Examples

### Notification Count

```vue
<script setup lang="ts">
import { UINumberBadge } from '@wisemen/vue-core-design-system'
</script>

<template>
  <div class="flex items-center gap-2">
    <span>Messages</span>
    <UINumberBadge value="12" color="error" variant="solid" />
  </div>
</template>
```

### All Variants

```vue
<script setup lang="ts">
import { UINumberBadge } from '@wisemen/vue-core-design-system'
</script>

<template>
  <div class="flex items-center gap-3">
    <UINumberBadge value="5" color="brand" variant="translucent" />
    <UINumberBadge value="5" color="brand" variant="outline" />
    <UINumberBadge value="5" color="brand" variant="solid" />
  </div>
</template>
```

### Multi-digit Values

```vue
<script setup lang="ts">
import { UINumberBadge } from '@wisemen/vue-core-design-system'
</script>

<template>
  <div class="flex items-center gap-3">
    <UINumberBadge value="3" />
    <UINumberBadge value="42" />
    <UINumberBadge value="128" />
  </div>
</template>
```

## Anatomy

```
span.inline-flex.rounded-full.border  (base)
  UIText                               (label)
```

## Styling

**Style file:** `src/ui/number-badge/numberBadge.style.ts`
**tv() slots:** `base`, `label`

The `base` slot controls the pill container (height, padding, border, background). The `label` slot controls the text (font weight, color). Color-variant combinations are defined as `compoundVariants`.

## Common Mistakes

### HIGH: Passing a number instead of a string

Wrong:
```vue
<UINumberBadge :value="42" />
```

Correct:
```vue
<UINumberBadge value="42" />
```

The `value` prop is typed as `string`. Always pass a pre-formatted string. This ensures locale-specific formatting (e.g., `"1.400"` or `"4,5"`) is controlled by the consumer.

### LOW: Using UINumberBadge for text labels

Wrong:
```vue
<UINumberBadge value="New" />
```

Correct:
```vue
<UIBadge label="New" />
```

UINumberBadge is designed for numeric values. For text labels, use `UIBadge` instead.

## Accessibility

- Renders with `role="status"` so screen readers announce content changes.
- Accepts an `ariaLabel` prop for custom screen reader text. When omitted, the displayed `value` is read.

## See Also

- [UIBadge](../badge/) -- Full-featured badge with text labels, icons, dots, and avatars
