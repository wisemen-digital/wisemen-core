---
name: popover
description: >
  A floating content panel anchored to a trigger element. Built on Reka UI PopoverRoot
  with configurable alignment, side, collision handling, and animated open/close transitions.
  Load this skill when you need interactive floating panels that appear on click.
type: component
library: vue-core-design-system
library_version: "0.8.0"
category: overlay
requires:
  - overlay-system
exports:
  - UIPopover
  - UIPopoverProps
---

# UIPopover

A floating content panel that appears anchored to a trigger element when clicked.

## When to Use

- Displaying interactive content (forms, actions, filters) attached to a trigger button
- Building custom dropdown-like panels with arbitrary content
- Showing contextual information that requires user interaction (not just hover)

**Use instead:** `UITooltip` for hover-only informational text, `UIDropdownMenu` for menu item lists, `UIDialog` for large or blocking content.

## Import

```ts
import { UIPopover } from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import { UIPopover, UIButton } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UIPopover>
    <template #trigger>
      <UIButton label="Open popover" />
    </template>
    <template #content>
      <div class="p-md">
        <p class="text-sm text-secondary">Popover content here</p>
      </div>
    </template>
  </UIPopover>
</template>
```

## API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | `false` | Controls the open state (v-model). |
| `isPopoverArrowVisible` | `boolean` | `false` | Shows an arrow pointing to the trigger. |
| `popoverAlign` | `'center' \| 'start' \| 'end'` | `'center'` | Alignment of the popover relative to the trigger. |
| `popoverAlignOffset` | `number` | `0` | Offset in pixels from the alignment edge. |
| `popoverAnchorReferenceElement` | `ReferenceElement \| null` | `null` | Custom anchor element. If null, uses the trigger. |
| `popoverAnimationName` | `string \| null` | `null` | Custom animation name. Falls back to `'popover-default'`. |
| `popoverCollisionPadding` | `number` | `0` | Padding in pixels for collision detection. |
| `popoverContainerElement` | `HTMLElement \| null` | `null` | Boundary element for collision detection. |
| `popoverSide` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'` | Which side of the trigger the popover appears on. |
| `popoverSideOffset` | `number` | `0` | Distance in pixels between the popover and the trigger. |
| `popoverWidth` | `'anchor-width' \| 'available-width' \| null` | `null` | Width behavior: match trigger width, fill available space, or use natural width. |
| `disableSideFlip` | `boolean` | `false` | Disables flipping to the opposite side when insufficient space. |
| `disableUpdateOnLayoutShift` | `boolean` | `false` | Disables repositioning on layout shifts. |
| `prioritizePosition` | `boolean` | `false` | Constrains the content to remain within the viewport, even if it overlaps the trigger. |

### Slots

| Slot | Description |
|------|-------------|
| `trigger` | The element that toggles the popover. Must be a single root element. |
| `content` | The content rendered inside the popover panel. |

### Emits

| Event | Payload | Description |
|-------|---------|-------------|
| `update:isOpen` | `boolean` | Fired when the open state changes. |
| `escapeKeyDown` | `KeyboardEvent` | Fired when Escape is pressed while open. |
| `focusOutside` | `CustomEvent` | Fired when focus moves outside the popover. |
| `interactOutside` | `CustomEvent` | Fired when an interaction occurs outside the popover. |
| `autoFocusOnClose` | `Event` | Fired when auto-focus triggers on close. Call `event.preventDefault()` to prevent. |

## Variants

This component has no size/variant options. Appearance is controlled through content styling and positioning props.

## Examples

### Controlled Open State

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { UIPopover, UIButton } from '@wisemen/vue-core-design-system'

const isOpen = ref(false)
</script>

<template>
  <UIPopover v-model:is-open="isOpen" popover-side="bottom" :popover-side-offset="4">
    <template #trigger>
      <UIButton label="Toggle" />
    </template>
    <template #content>
      <div class="p-md">
        <p class="text-sm text-secondary">Controlled popover</p>
      </div>
    </template>
  </UIPopover>
</template>
```

### With Arrow and Custom Alignment

```vue
<script setup lang="ts">
import { UIPopover, UIButton } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UIPopover
    :is-popover-arrow-visible="true"
    popover-side="bottom"
    popover-align="start"
    :popover-side-offset="4"
  >
    <template #trigger>
      <UIButton label="With arrow" />
    </template>
    <template #content>
      <div class="p-md">
        <p class="text-sm text-secondary">Arrow points to the trigger</p>
      </div>
    </template>
  </UIPopover>
</template>
```

### Matching Trigger Width

```vue
<UIPopover popover-width="anchor-width" popover-side="bottom">
  <template #trigger>
    <UIButton label="Full width popover" />
  </template>
  <template #content>
    <div class="p-md">
      <p class="text-sm text-secondary">This popover matches the trigger width</p>
    </div>
  </template>
</UIPopover>
```

## Anatomy

```
UIPopover
├── RekaPopoverRoot (v-model:open)
│   ├── RekaPopoverAnchor
│   │   └── RekaPopoverTrigger (as-child)
│   │       └── <slot name="trigger" />
│   └── RekaPopoverPortal (to="body")
│       └── ThemeProvider
│           └── RekaPopoverContent (positioned, animated)
│               ├── <div> (border, bg, shadow container)
│               │   └── <slot name="content" />
│               └── PopoverArrow (if isPopoverArrowVisible)
```

## Styling

**Style file:** No separate style file. Styles are inline Tailwind classes in `Popover.vue`.
**Content container:** `rounded-md border border-secondary bg-primary shadow-lg`
**Animations:** CSS keyframes `popoverFadeIn*` / `popoverFadeOut*` with direction-aware transitions (top/right/bottom/left). Duration: 100ms ease-in-out.
**Z-index:** `z-40` on the content wrapper.

## Common Mistakes

### MEDIUM: Forgetting as-child behavior on the trigger

Wrong:
```vue
<template #trigger>
  <div>
    <UIButton label="Open" />
  </div>
</template>
```

The trigger slot uses `as-child`, so it expects a single root element that receives the click handler. Wrapping in a div breaks the trigger behavior.

Correct:
```vue
<template #trigger>
  <UIButton label="Open" />
</template>
```

### LOW: Not setting popoverSideOffset

Without an offset, the popover sits flush against the trigger. Add a small offset for visual breathing room:

```vue
<UIPopover :popover-side-offset="4" popover-side="bottom">
```

## Accessibility

- Built on Reka UI Popover primitives which handle ARIA attributes automatically.
- Escape key closes the popover.
- Focus is trapped within the popover content while open.
- Focus returns to the trigger on close (controllable via `autoFocusOnClose` event).
- The trigger receives appropriate `aria-expanded` and `aria-haspopup` attributes.

## See Also

- [tooltip](../tooltip/SKILL.md) -- For hover-only informational content
- [dropdown-menu](../dropdown-menu/SKILL.md) -- For menu item lists
- [overlay-system](../../foundations/overlay-system/SKILL.md) -- useOverlay API for imperative overlays
