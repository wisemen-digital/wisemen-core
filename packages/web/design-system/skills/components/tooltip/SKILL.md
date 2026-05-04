---
name: tooltip
description: >
  A hover/focus-triggered floating label built on Reka UI TooltipRoot. Supports
  configurable delay, side positioning, arrow visibility, and custom content via slots.
  Also exports UITooltipProvider, UITooltipContent, and UITooltipText helpers.
  Load this skill for informational hover hints on buttons, icons, or interactive elements.
type: component
library: vue-core-design-system
library_version: "0.8.0"
category: overlay
requires: []
exports:
  - UITooltip
  - UITooltipProps
  - UITooltipContent
  - UITooltipProvider
  - UITooltipText
---

# UITooltip

A floating label that appears on hover or keyboard focus, providing brief informational text about a trigger element.

## When to Use

- Adding descriptive text to icon-only buttons
- Explaining the purpose of a UI element on hover
- Showing supplementary info that does not require interaction

**Use instead:** `UIActionTooltip` for tooltips with a keyboard shortcut badge, `UIPopover` for interactive floating content, `UIDialog` for complex content that requires user action.

## Import

```ts
import { UITooltip, UITooltipContent, UITooltipProvider, UITooltipText } from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import { UITooltip, UIButton } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UITooltip :popover-side-offset="4">
    <template #trigger>
      <UIButton label="Hover me" />
    </template>
    <template #content>
      <div class="flex px-sm py-xs">
        <p class="text-xs text-secondary">Tooltip text</p>
      </div>
    </template>
  </UITooltip>
</template>
```

## API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | `false` | Controls the open state (v-model). |
| `isDisabled` | `boolean` | `false` | When true, the tooltip is hidden and will not appear. |
| `delayDuration` | `number` | `300` | Milliseconds to wait before showing the tooltip on hover. |
| `disableCloseOnTriggerClick` | `boolean` | `false` | When true, clicking the trigger will not close the tooltip. |
| `disableHoverableContent` | `boolean` | `false` | When true, hovering the tooltip content closes it as the pointer leaves the trigger. |
| `isPopoverArrowVisible` | `boolean` | `false` | Shows an arrow pointing to the trigger. |
| `popoverAlign` | `'center' \| 'start' \| 'end'` | `'center'` | Alignment relative to the trigger. |
| `popoverAlignOffset` | `number` | `0` | Offset in pixels from the alignment edge. |
| `popoverAnchorReferenceElement` | `ReferenceElement \| null` | `null` | Custom anchor element. |
| `popoverAnimationName` | `string \| null` | `null` | Custom animation name. Falls back to `'tooltip-default'`. |
| `popoverCollisionPadding` | `number` | `0` | Padding for collision detection. |
| `popoverContainerElement` | `HTMLElement \| null` | `null` | Boundary element for collision detection. |
| `popoverSide` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'` | Which side the tooltip appears on. |
| `popoverSideOffset` | `number` | `0` | Distance in pixels between the tooltip and the trigger. |
| `popoverWidth` | `'anchor-width' \| 'available-width' \| null` | `null` | Width behavior of the tooltip content. |

### Slots

| Slot | Description |
|------|-------------|
| `trigger` | The element that activates the tooltip on hover/focus. Must be a single root element. |
| `content` | The content rendered inside the tooltip panel. |

### Emits

| Event | Payload | Description |
|-------|---------|-------------|
| `update:isOpen` | `boolean` | Fired when the open state changes. |

## Sub-Components

### UITooltipProvider

Wraps the app (or a section) to share tooltip delay behavior across nested tooltips. Built on Reka UI `TooltipProvider`.

```vue
<UITooltipProvider>
  <slot />
</UITooltipProvider>
```

No props. Place at the app root or around a group of tooltips.

### UITooltipContent

A pre-styled content wrapper for simple tooltip text. Applies `flex px-sm py-xs` padding.

```vue
<template #content>
  <UITooltipContent>
    Your text here
  </UITooltipContent>
</template>
```

No props. Has a default slot.

### UITooltipText

A text component for tooltip labels. Renders centered, truncation-disabled text at `text-xs text-secondary` with `max-w-xs`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | -- (required) | The text to display. |

## Variants

This component has no size/variant options. Styling is controlled via the `tv()` style file.

**popoverWidth variants:**
| Value | Effect |
|-------|--------|
| `'anchor-width'` | Matches the trigger element width. |
| `'available-width'` | Expands to available viewport width. |
| `null` | Uses natural content width. |

## Examples

### Simple Text Tooltip

```vue
<script setup lang="ts">
import { UITooltip, UITooltipContent, UITooltipText, UIButton } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UITooltip :popover-side-offset="4" popover-side="top">
    <template #trigger>
      <UIButton label="Hover me" />
    </template>
    <template #content>
      <UITooltipContent>
        <UITooltipText text="Helpful information" />
      </UITooltipContent>
    </template>
  </UITooltip>
</template>
```

### With Arrow

```vue
<UITooltip :is-popover-arrow-visible="true" :popover-side-offset="4">
  <template #trigger>
    <UIButton label="Hover me" />
  </template>
  <template #content>
    <div class="flex px-sm py-xs">
      <p class="text-xs text-secondary">Tooltip with arrow</p>
    </div>
  </template>
</UITooltip>
```

### Disabled Tooltip

```vue
<UITooltip :is-disabled="true">
  <template #trigger>
    <UIButton label="No tooltip here" />
  </template>
  <template #content>
    <div class="flex px-sm py-xs">
      <p class="text-xs text-secondary">You will not see this</p>
    </div>
  </template>
</UITooltip>
```

### Rich Content

```vue
<UITooltip :popover-side-offset="4">
  <template #trigger>
    <UIButton label="Hover me" />
  </template>
  <template #content>
    <div class="p-sm">
      <p class="flex max-w-xs text-center text-xs font-medium text-secondary">
        Tooltip title
      </p>
      <p class="mt-xs max-w-xs text-xs text-tertiary">
        Additional description with more detail about this element.
      </p>
    </div>
  </template>
</UITooltip>
```

### All Sides

```vue
<UITooltip popover-side="top" :popover-side-offset="4">...</UITooltip>
<UITooltip popover-side="right" :popover-side-offset="4">...</UITooltip>
<UITooltip popover-side="bottom" :popover-side-offset="4">...</UITooltip>
<UITooltip popover-side="left" :popover-side-offset="4">...</UITooltip>
```

## Anatomy

```
UITooltip
├── RekaTooltipRoot (v-model:open, delay, disabled)
│   ├── RekaTooltipTrigger (as-child)
│   │   └── <slot name="trigger" />
│   └── RekaTooltipPortal (to="body")
│       └── ThemeProvider
│           └── RekaTooltipContent (positioned, animated)
│               ├── <div> (border, bg, shadow container)
│               │   └── <slot name="content" />
│               └── TooltipArrow (if isPopoverArrowVisible)
```

## Styling

**Style file:** `src/ui/tooltip/tooltip.style.ts`
**tv() slots:**
- `content` -- `rounded-sm border border-secondary bg-primary shadow-lg`
- `contentWrapper` -- `z-tooltip will-change-[transform,filter,opacity]`

**Animations:** CSS keyframes `tooltipFadeIn` / `tooltipFadeOut` with blur effect. Duration: 150ms ease-in-out.

## Common Mistakes

### MEDIUM: Missing popoverSideOffset

Without an offset, the tooltip overlaps the trigger:

```vue
<!-- Wrong -->
<UITooltip popover-side="bottom">

<!-- Correct -->
<UITooltip popover-side="bottom" :popover-side-offset="4">
```

### LOW: Not wrapping with UITooltipProvider for shared delay

When using many tooltips, wrapping with `UITooltipProvider` at the app root gives a smoother experience -- once one tooltip opens, others in the group open immediately without waiting for the delay.

## Accessibility

- Built on Reka UI Tooltip primitives with proper ARIA attributes.
- Shows on keyboard focus (`ignoreNonKeyboardFocus` is true -- only keyboard focus triggers the tooltip, not programmatic focus).
- Dismissed with Escape key.
- Content is associated with the trigger via `aria-describedby`.
- The tooltip is a non-interactive overlay; use `UIPopover` for interactive content.

## See Also

- [action-tooltip](../action-tooltip/SKILL.md) -- Pre-built tooltip with label and keyboard shortcut
- [popover](../popover/SKILL.md) -- For interactive floating content triggered by click
