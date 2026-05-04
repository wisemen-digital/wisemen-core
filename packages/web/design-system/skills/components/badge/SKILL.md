---
name: badge
description: >
  Versatile badge component with support for labels, icons, dots, avatars, and separators.
  Includes BadgeGroup for wrapping collections and BadgeGroupTruncate for overflow handling.
  Load this skill when displaying status indicators, tags, or categorization labels.
type: component
library: vue-core-design-system
library_version: "0.8.0"
category: display
requires: []
exports:
  - UIBadge
  - UIBadgeProps
  - UIBadgeColor
  - UIBadgeAvatarConfig
  - UIBadgeDotConfig
  - UIBadgeDot
  - UIBadgeGroup
  - UIBadgeGroupTruncate
  - UIBadgeIcon
  - UIBadgeLabel
  - UIBadgeSeparator
---

# UIBadge

A versatile badge component for displaying status labels, tags, and categorization indicators. Supports text labels, icons, dots, and avatars. Use `UIBadgeGroup` to arrange multiple badges and `UIBadgeGroupTruncate` for overflow with a "+X" indicator.

## When to Use

- Showing status labels (e.g., "Active", "Pending", "Error")
- Displaying tags or categories on items
- Indicating a state with a colored dot, icon, or avatar alongside text
- Grouping multiple badges in a wrapping or truncated row

**Use instead:** `UINumberBadge` for numeric-only badges. `UIDot` for a standalone status dot without a label.

## Import

```ts
import {
  UIBadge,
  UIBadgeGroup,
  UIBadgeGroupTruncate,
  UIBadgeDot,
  UIBadgeIcon,
  UIBadgeLabel,
  UIBadgeSeparator,
} from '@wisemen/vue-core-design-system'

import type {
  UIBadgeProps,
  UIBadgeColor,
  UIBadgeAvatarConfig,
  UIBadgeDotConfig,
} from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import { UIBadge } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UIBadge label="Active" color="success" />
</template>
```

## API

### UIBadge Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `ariaLabel` | `string \| null` | `null` | Accessible label for screen readers. Use when the badge content alone is not descriptive enough. |
| `avatar` | `BadgeAvatarConfig \| null` | `null` | An avatar config object `{ name: string, src?: string \| null }`. When provided, renders a tiny (xxs) avatar inside the badge. |
| `color` | `BadgeColor` | `'gray'` | Background color theme. One of: `'blue'`, `'brand'`, `'error'`, `'gray'`, `'pink'`, `'purple'`, `'success'`, `'warning'`. |
| `dot` | `BadgeDotConfig \| null` | `null` | Dot config object. Pass `{}` for a dot that inherits the badge color, or `{ color: 'error' }` to override. |
| `icon` | `Component \| null` | `null` | A Vue icon component to display inside the badge. |
| `label` | `string \| null` | `null` | The text label displayed inside the badge. |
| `rounded` | `'default' \| 'full'` | `'default'` | Border radius. `'default'` = `rounded-sm`, `'full'` = `rounded-full` (pill). |
| `size` | `'lg' \| 'md' \| 'sm'` | `'md'` | Badge size controlling height, icon size, and font size. |
| `variant` | `'outline' \| 'solid' \| 'translucent'` | `'translucent'` | Visual style variant. |

### UIBadge Slots

| Slot | Description |
|------|-------------|
| `default` | Overrides the entire badge content (avatar, icon, label). When provided, the `avatar`, `icon`, and `label` props are ignored. Use sub-components (`UIBadgeIcon`, `UIBadgeLabel`, `UIBadgeDot`, `UIBadgeSeparator`) for custom layouts. |

### UIBadge Emits

This component has no custom events.

### UIBadgeGroup Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `noWrap` | `boolean` | `false` | When `true`, prevents badges from wrapping to the next line. |

### UIBadgeGroup Slots

| Slot | Description |
|------|-------------|
| `default` | `UIBadge` components to arrange in a row with `gap-xs`. |

### UIBadgeGroupTruncate Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `badges` | `BadgeData[]` | **(required)** | Array of badge data objects: `{ label: string, avatar?: { name, src? }, dot?: { color }, icon?: Component }`. |
| `color` | `BadgeColor` | **(required)** | Color applied to all badges in the group. |
| `maxVisibleCount` | `number \| null` | `null` | Maximum badges to show before truncating. When `null`, all badges are shown (adaptive overflow only). |
| `size` | `BadgeProps['size']` | **(required)** | Size applied to all badges. |
| `variant` | `BadgeProps['variant']` | **(required)** | Variant applied to all badges. |

### Sub-components

These are used inside UIBadge's default slot for custom content layouts. They automatically consume the badge context (color, size, variant).

| Component | Props | Description |
|-----------|-------|-------------|
| `UIBadgeIcon` | `icon: Component` | Renders an icon with badge-context styling. |
| `UIBadgeLabel` | `label: string` | Renders a text label with badge-context styling. |
| `UIBadgeDot` | *(none)* | Renders a dot indicator using the badge's effective dot color. |
| `UIBadgeSeparator` | *(none)* | Renders a vertical separator line between badge content sections. |

## Variants

### Sizes

| Size | Height | Icon size | Font size |
|------|--------|-----------|-----------|
| `sm` | `h-5` (20px) | `size-3` | `text-xxs` |
| `md` | `h-6` (24px) | `size-3` | `text-xxs` |
| `lg` | `h-7` (28px) | `size-4` | `text-xs` |

### Visual Variants

| Variant | Description |
|---------|-------------|
| `translucent` | Tinted background with colored border and text |
| `outline` | Transparent background with colored border and text |
| `solid` | Filled background with white text |

### Colors

All `BadgeColor` values: `gray`, `brand`, `blue`, `pink`, `error`, `success`, `warning`, `purple`.

## Examples

### Badge with Dot

```vue
<script setup lang="ts">
import { UIBadge } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UIBadge
    label="Online"
    color="success"
    :dot="{}"
  />
</template>
```

### Badge with Icon

```vue
<script setup lang="ts">
import { UIBadge } from '@wisemen/vue-core-design-system'
import { Settings01Icon } from '@wisemen/vue-core-icons'
</script>

<template>
  <UIBadge
    :icon="Settings01Icon"
    label="Settings"
    color="brand"
  />
</template>
```

### Badge with Avatar

```vue
<script setup lang="ts">
import { UIBadge } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UIBadge
    :avatar="{ name: 'John Doe', src: 'https://example.com/photo.jpg' }"
    label="John Doe"
    color="brand"
  />
</template>
```

### Badge Group

```vue
<script setup lang="ts">
import { UIBadge, UIBadgeGroup } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UIBadgeGroup>
    <UIBadge label="Vue" color="success" />
    <UIBadge label="TypeScript" color="blue" />
    <UIBadge label="Tailwind" color="purple" />
  </UIBadgeGroup>
</template>
```

### Truncated Badge Group

```vue
<script setup lang="ts">
import { UIBadgeGroupTruncate } from '@wisemen/vue-core-design-system'

const badges = [
  { label: 'Design' },
  { label: 'Engineering' },
  { label: 'Marketing' },
  { label: 'Sales' },
  { label: 'Support' },
]
</script>

<template>
  <UIBadgeGroupTruncate
    :badges="badges"
    :max-visible-count="3"
    color="gray"
    size="md"
    variant="translucent"
  />
</template>
```

### Custom Content with Sub-components

```vue
<script setup lang="ts">
import {
  UIBadge,
  UIBadgeIcon,
  UIBadgeLabel,
  UIBadgeSeparator,
} from '@wisemen/vue-core-design-system'
import { CheckCircleIcon } from '@wisemen/vue-core-icons'
</script>

<template>
  <UIBadge color="success">
    <UIBadgeIcon :icon="CheckCircleIcon" />
    <UIBadgeLabel label="Approved" />
    <UIBadgeSeparator />
    <UIBadgeLabel label="v2.1" />
  </UIBadge>
</template>
```

## Anatomy

```
UIBadge
  UIRowLayout.inline-flex.border  (base)
    BadgeDot?                      (when dot prop is set)
    <slot>                         (default content)
      BadgeAvatar?                 (when avatar prop is set)
      BadgeIcon?                   (when icon prop is set)
      BadgeLabel?                  (when label prop is set)
    </slot>

UIBadgeGroup
  UIRowLayout.flex-wrap.gap-xs
    <slot />                       (UIBadge children)

UIBadgeGroupTruncate
  AdaptiveContent
    BadgeGroup[no-wrap]
      AdaptiveContentBlock * N     (visible badges)
      ActionTooltip                (overflow "+X" badge with tooltip)
```

## Styling

**Style file:** `src/ui/badge/badge.style.ts`
**tv() slots:** `base`, `dot`, `icon`, `label`, `separator`

The `base` slot controls the badge container (height, padding, border, background). Color-variant combinations are defined as `compoundVariants` for all 8 colors x 3 variants. The `dot`, `icon`, `label`, and `separator` slots are styled per color/variant.

## Common Mistakes

### HIGH: Using the default slot AND prop-based content

Wrong:
```vue
<UIBadge label="Status" color="success">
  <UIBadgeLabel label="Override" />
</UIBadge>
```

Correct:
```vue
<UIBadge color="success">
  <UIBadgeLabel label="Override" />
</UIBadge>
```

When a default slot is provided, the `label`, `icon`, and `avatar` props are ignored (they are inside the fallback slot content). Use either props or slot content, not both.

### MEDIUM: Passing an empty object for dot color override

Wrong:
```vue
<UIBadge label="Status" :dot="{ color: undefined }" />
```

Correct:
```vue
<!-- Dot inherits badge color -->
<UIBadge label="Status" :dot="{}" />

<!-- Dot with explicit color override -->
<UIBadge label="Status" :dot="{ color: 'error' }" />
```

Pass `{}` to inherit the badge color, or provide an explicit `color` value. Do not pass `undefined` as the color.

### MEDIUM: Using UIBadgeSeparator outside of UIBadge

Wrong:
```vue
<UIBadgeSeparator />
```

Correct:
```vue
<UIBadge color="gray">
  <UIBadgeLabel label="Left" />
  <UIBadgeSeparator />
  <UIBadgeLabel label="Right" />
</UIBadge>
```

Sub-components (`UIBadgeIcon`, `UIBadgeLabel`, `UIBadgeDot`, `UIBadgeSeparator`) must be used inside a `UIBadge` because they inject the badge context for styling.

## Accessibility

- `UIBadge` renders with `role="status"` so screen readers announce changes.
- Accepts an `ariaLabel` prop for custom screen reader text.
- `UIBadgeGroupTruncate` shows a tooltip on the overflow badge listing the hidden badge labels.

## See Also

- [UINumberBadge](../number-badge/) -- Compact numeric-only badge
- [UIDot](../dot/) -- Standalone status dot indicator
- [UIAvatar](../avatar/) -- Full avatar component used inside badge avatars
