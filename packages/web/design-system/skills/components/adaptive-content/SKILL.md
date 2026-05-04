---
name: adaptive-content
description: >
  A container that conditionally renders child blocks based on available horizontal space
  and an explicit priority order. Lower-priority blocks are progressively hidden when the
  container overflows, exposing a hidden-block count for building overflow indicators.
type: component
category: display
library: vue-core-design-system
library_version: "0.8.0"
requires: []
exports:
  - UIAdaptiveContent
  - UIAdaptiveContentBlock
---

# UIAdaptiveContent

A responsive container that measures its width and progressively hides lower-priority child blocks until the remaining content fits, exposing a count of hidden blocks for building overflow UIs.

## When to Use

- Displaying a row of items (tabs, badges, tags, toolbar actions) that must gracefully collapse when horizontal space is limited
- Building responsive tab bars where hidden tabs overflow into a dropdown menu
- Showing a badge group with a "+N" overflow indicator

**Use instead:** CSS `overflow: hidden` with `text-overflow: ellipsis` for single-line text truncation. Use a scroll container when all items should remain accessible via scrolling.

## Import

```ts
import { UIAdaptiveContent, UIAdaptiveContentBlock } from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import { UIAdaptiveContent, UIAdaptiveContentBlock } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UIAdaptiveContent v-slot="{ hiddenBlockCount }">
    <div style="display: flex; gap: 8px; overflow: hidden;">
      <UIAdaptiveContentBlock :priority="0">
        <span>Most important</span>
      </UIAdaptiveContentBlock>

      <UIAdaptiveContentBlock :priority="1">
        <span>Second</span>
      </UIAdaptiveContentBlock>

      <UIAdaptiveContentBlock :priority="2">
        <span>Third</span>
      </UIAdaptiveContentBlock>

      <span v-if="hiddenBlockCount > 0">+{{ hiddenBlockCount }} more</span>
    </div>
  </UIAdaptiveContent>
</template>
```

## API

### UIAdaptiveContent

#### Props

This component has no props. It renders as a Reka UI `Primitive` with `as-child` set to true, meaning it does not produce a wrapper DOM element -- it delegates to the single root element in its default slot.

#### Slots

| Slot | Slot Props | Description |
|------|------------|-------------|
| `default` | `{ hiddenBlockCount: number }` | The container content. Must contain a single root element. `hiddenBlockCount` is the number of blocks currently hidden due to overflow. |

#### Emits

This component has no custom events.

### UIAdaptiveContentBlock

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `priority` | `number` | **required** | Display priority. **Lower values = higher priority** (shown first when space is limited). Blocks sharing the same priority are shown or hidden as a group. |

#### Slots

| Slot | Slot Props | Description |
|------|------------|-------------|
| `default` | -- | The block content. Must be a single root element (rendered via `as-child`). |
| `fallback` | -- | Rendered when this block is hidden due to overflow. Useful for providing an alternative compact representation. |

#### Emits

This component has no custom events.

## Variants

These components have no visual variant or size options. They are purely behavioral -- they control visibility, not appearance.

## Examples

### Badge Group with Overflow Count

```vue
<script setup lang="ts">
import { UIAdaptiveContent, UIAdaptiveContentBlock } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UIAdaptiveContent v-slot="{ hiddenBlockCount }">
    <div class="flex gap-1 overflow-hidden">
      <UIAdaptiveContentBlock
        v-for="(badge, index) in badges"
        :key="badge.label"
        :priority="index"
      >
        <Badge :label="badge.label" />
      </UIAdaptiveContentBlock>

      <Badge v-if="hiddenBlockCount > 0" :label="`+${hiddenBlockCount}`" />
    </div>
  </UIAdaptiveContent>
</template>
```

### Equal Priority Groups

Blocks with the same priority are shown or hidden as a group. If a priority group causes overflow, the entire group is removed.

```vue
<template>
  <UIAdaptiveContent v-slot="{ hiddenBlockCount }">
    <div class="flex gap-2 overflow-hidden">
      <!-- These two always appear or disappear together -->
      <UIAdaptiveContentBlock :priority="0">
        <span>Primary A</span>
      </UIAdaptiveContentBlock>
      <UIAdaptiveContentBlock :priority="0">
        <span>Primary B</span>
      </UIAdaptiveContentBlock>

      <!-- Lower priority, hidden first -->
      <UIAdaptiveContentBlock :priority="1">
        <span>Secondary</span>
      </UIAdaptiveContentBlock>

      <span v-if="hiddenBlockCount > 0">{{ hiddenBlockCount }} hidden</span>
    </div>
  </UIAdaptiveContent>
</template>
```

### Using the Fallback Slot

```vue
<template>
  <UIAdaptiveContent>
    <div class="flex gap-2 overflow-hidden">
      <UIAdaptiveContentBlock :priority="0">
        <span>Full label text</span>

        <template #fallback>
          <span>FL</span>
        </template>
      </UIAdaptiveContentBlock>
    </div>
  </UIAdaptiveContent>
</template>
```

### Tabs Integration (Internal Pattern)

The tabs component uses `UIAdaptiveContent` internally to collapse tabs into a dropdown on non-touch devices:

```vue
<UIAdaptiveContent>
  <template #default="{ hiddenBlockCount }">
    <div>
      <TabsList>
        <!-- Each TabsItem wraps itself in UIAdaptiveContentBlock -->
        <TabsItem label="Tab 1" value="tab1" />
        <TabsItem label="Tab 2" value="tab2" />
        <TabsItem label="Tab 3" value="tab3" />

        <OverflowDropdown v-if="hiddenBlockCount > 0" />
      </TabsList>
    </div>
  </template>
</UIAdaptiveContent>
```

## Anatomy

```
UIAdaptiveContent (Primitive as-child, no wrapper element)
├── ResizeObserver (watches container width)
└── <slot> (single root element required)
    ├── UIAdaptiveContentBlock (Primitive as-child, v-show toggled)
    │   └── <slot /> (default — the block content)
    │   └── <slot name="fallback" /> (shown when block is hidden)
    ├── UIAdaptiveContentBlock ...
    └── overflow indicator (consumer-provided, uses hiddenBlockCount)
```

## Styling

**Style file:** None. These components are purely behavioral and produce no wrapper DOM elements (`as-child` is always true). All visual styling is the consumer's responsibility via the slot content.

The container element (provided by the consumer in the default slot) should typically have:
- `display: flex` (or similar horizontal layout)
- `overflow: hidden` (so `scrollWidth > clientWidth` can be detected)
- No `flex-wrap` (wrapping defeats the overflow measurement)

## Common Mistakes

### HIGH: Omitting overflow:hidden on the container element

The layout algorithm compares `scrollWidth` against `clientWidth` on the slot's root element. If the container does not have `overflow: hidden`, scrollWidth will never exceed clientWidth and no blocks will be hidden.

```vue
<!-- Wrong: no overflow hidden -->
<UIAdaptiveContent v-slot="{ hiddenBlockCount }">
  <div class="flex gap-2">...</div>
</UIAdaptiveContent>

<!-- Correct -->
<UIAdaptiveContent v-slot="{ hiddenBlockCount }">
  <div class="flex gap-2 overflow-hidden">...</div>
</UIAdaptiveContent>
```

### HIGH: Providing multiple root elements in the slot

Both `UIAdaptiveContent` and `UIAdaptiveContentBlock` use Reka UI `Primitive` with `as-child`, which requires exactly one root element in the slot. Multiple roots will cause unexpected behavior.

### MEDIUM: Using flex-wrap on the container

If the container wraps items to a second line, items never overflow horizontally, so the algorithm never hides anything. Use `flex-nowrap` (or omit `flex-wrap`).

### LOW: Confusing priority direction

Lower numbers mean **higher** priority (shown first). A block with `priority="0"` is kept visible longer than `priority="5"`.

## Accessibility

- Blocks hidden by the adaptive layout use `v-show` (CSS `display: none`), so hidden content is removed from the accessibility tree.
- The `fallback` slot on `UIAdaptiveContentBlock` allows providing an accessible alternative when the full content is hidden.
- Consumers are responsible for making the overflow indicator (e.g., "+3 more" badge, dropdown menu) keyboard-accessible and screen-reader friendly.
- The tabs component's built-in integration provides a fully accessible dropdown menu for hidden tabs.

## See Also

- [badge](../badge/SKILL.md) -- BadgeGroupTruncate uses UIAdaptiveContent internally for badge overflow
- [tabs](../tabs/SKILL.md) -- TabsList uses UIAdaptiveContent internally to collapse tabs into an overflow dropdown
