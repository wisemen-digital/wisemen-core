---
name: timeline
description: >
  Vertical timeline component with indicator dots, connector lines, and content slots.
  UITimeline wraps UITimelineItem children with shared size/variant context. Load this
  skill when displaying chronological event sequences or activity feeds.
type: component
library: vue-core-design-system
category: display
requires: []
exports:
  - UITimeline
  - UITimelineItem
  - UITimelineProps
  - UITimelineItemProps
---

# UITimeline

A vertical timeline that renders a sequence of events with indicator dots, connector lines, and content areas. `UITimeline` provides shared context (size, variant) to its `UITimelineItem` children.

## When to Use

- Displaying a chronological sequence of events (activity feeds, audit logs)
- Showing step-by-step progress indicators
- Rendering change history or version timelines

**Use instead:** A plain ordered list when you do not need visual indicators or connectors. `UIBadge` for standalone status labels.

## Import

```ts
import { UITimeline, UITimelineItem } from '@wisemen/vue-core-design-system'
import type { UITimelineProps, UITimelineItemProps } from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import { UITimeline, UITimelineItem } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UITimeline>
    <UITimelineItem>
      <p>First event</p>
    </UITimelineItem>
    <UITimelineItem>
      <p>Second event</p>
    </UITimelineItem>
    <UITimelineItem :is-last="true">
      <p>Latest event</p>
    </UITimelineItem>
  </UITimeline>
</template>
```

## API

### UITimeline Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'md' \| 'sm'` | `'md'` | Controls the indicator size, connector width, gap, and content padding for all items. |
| `variant` | `'outline' \| 'solid' \| 'subtle'` | `'solid'` | Visual style of the indicator dots for all items. |

### UITimeline Slots

| Slot | Description |
|------|-------------|
| `default` | `UITimelineItem` components representing each event in the timeline. |

### UITimeline Emits

This component has no custom events.

### UITimelineItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isLast` | `boolean` | `false` | When `true`, hides the connector line below this item and removes bottom padding. Set on the final item. |
| `icon` | `Component` | `undefined` | An optional icon component displayed inside the indicator circle. Rendered at `size-4`. |

### UITimelineItem Slots

| Slot | Description |
|------|-------------|
| `default` | The event content displayed to the right of the indicator and connector. |
| `indicator` | Overrides the indicator content. When not provided and `icon` is set, the icon is rendered. When neither is provided, an empty indicator circle is shown. |

### UITimelineItem Emits

This component has no custom events.

## Variants

### Sizes

| Size | Indicator | Gap | Content padding |
|------|-----------|-----|-----------------|
| `md` | `size-8` (32px) | `gap-md` | `pb-lg` |
| `sm` | `size-6` (24px) | `gap-sm` | `pb-md` |

### Visual Variants

| Variant | Indicator style |
|---------|----------------|
| `solid` | `bg-brand-primary-alt` with `text-fg-brand-primary-alt` |
| `outline` | `border border-secondary bg-primary` (hollow circle) |
| `subtle` | `bg-tertiary text-secondary` |

## Examples

### Timeline with Icons

```vue
<script setup lang="ts">
import { UITimeline, UITimelineItem } from '@wisemen/vue-core-design-system'
import {
  CheckCircleIcon,
  MessageSquare01Icon,
  User01Icon,
} from '@wisemen/vue-core-icons'
</script>

<template>
  <UITimeline size="md" variant="solid">
    <UITimelineItem :icon="CheckCircleIcon">
      <p class="text-xs font-medium">Task completed</p>
      <p class="text-xs text-tertiary">The setup has been completed.</p>
    </UITimelineItem>

    <UITimelineItem :icon="MessageSquare01Icon">
      <p class="text-xs font-medium">Comment added</p>
      <p class="text-xs text-tertiary">Phoenix Baker left a comment.</p>
    </UITimelineItem>

    <UITimelineItem :icon="User01Icon" :is-last="true">
      <p class="text-xs font-medium">User joined</p>
      <p class="text-xs text-tertiary">A new member joined the project.</p>
    </UITimelineItem>
  </UITimeline>
</template>
```

### Small Outline Timeline

```vue
<script setup lang="ts">
import { UITimeline, UITimelineItem } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UITimeline size="sm" variant="outline">
    <UITimelineItem>
      <p class="text-xs">Step one</p>
    </UITimelineItem>
    <UITimelineItem>
      <p class="text-xs">Step two</p>
    </UITimelineItem>
    <UITimelineItem :is-last="true">
      <p class="text-xs">Step three</p>
    </UITimelineItem>
  </UITimeline>
</template>
```

### Custom Indicator Slot

```vue
<script setup lang="ts">
import { UITimeline, UITimelineItem } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UITimeline variant="outline">
    <UITimelineItem>
      <template #indicator>
        <span class="text-xs font-bold">1</span>
      </template>
      <p>First step</p>
    </UITimelineItem>
    <UITimelineItem :is-last="true">
      <template #indicator>
        <span class="text-xs font-bold">2</span>
      </template>
      <p>Second step</p>
    </UITimelineItem>
  </UITimeline>
</template>
```

## Anatomy

```
UITimeline
  div.flex.flex-col                   (root)
    UITimelineItem * N
      div.flex                        (item)
        div.flex.flex-col.items-center (itemTrack)
          div.rounded-full            (indicator)
            <slot name="indicator">
              <icon />?
            </slot>
          div.bg-quaternary           (connector line, hidden when isLast)
        div.flex.flex-col             (content)
          <slot />
```

## Styling

**Style file:** `src/ui/timeline/timeline.style.ts`
**tv() slots:** `connector`, `content`, `indicator`, `item`, `itemTrack`, `root`

The `connector` is a 1px-wide vertical line (`bg-quaternary`) that stretches between indicators. When `isLast` is `true`, the connector is set to `invisible` and content padding is removed.

## Common Mistakes

### HIGH: Forgetting isLast on the final item

Wrong:
```vue
<UITimeline>
  <UITimelineItem>First</UITimelineItem>
  <UITimelineItem>Last</UITimelineItem>
</UITimeline>
```

Correct:
```vue
<UITimeline>
  <UITimelineItem>First</UITimelineItem>
  <UITimelineItem :is-last="true">Last</UITimelineItem>
</UITimeline>
```

Without `isLast`, the final item renders a dangling connector line below its indicator with extra bottom padding. Always set `:is-last="true"` on the last `UITimelineItem`.

### MEDIUM: Nesting UITimelineItem outside UITimeline

Wrong:
```vue
<UITimelineItem>Standalone event</UITimelineItem>
```

Correct:
```vue
<UITimeline>
  <UITimelineItem :is-last="true">Standalone event</UITimelineItem>
</UITimeline>
```

`UITimelineItem` injects context from `UITimeline` (size, variant). Using it without a parent `UITimeline` will throw a context injection error.

## Accessibility

- The timeline renders as plain `div` elements. For semantic meaning, consider wrapping it in an `<ol>` or adding `role="list"` with `role="listitem"` on items.
- Icons inside indicators are purely decorative. Meaningful event information should be in the content slot.
- The connector line is visual only and does not affect screen reader output.

## See Also

- [UIBadge](../badge/) -- For standalone status labels that can accompany timeline content
