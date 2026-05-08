---
name: action-tooltip
description: >
  A pre-built tooltip that displays a text label and an optional keyboard shortcut badge.
  Wraps UITooltip with UITooltipText and UIKeyboardShortcut in a row layout. Load this
  skill when you need a standardized tooltip for buttons or actions with shortcut hints.
type: component
library: vue-core-design-system
category: overlay
requires: []
exports:
  - UIActionTooltip
---

# UIActionTooltip

A pre-built tooltip that displays a text label and an optional keyboard shortcut indicator, designed for action buttons and toolbar items.

## When to Use

- Adding a tooltip with a keyboard shortcut hint to an icon button (e.g., "Save" with shortcut badge)
- Providing a standardized label tooltip for any interactive element
- Showing a tooltip on toolbar buttons with both a description and shortcut key

**Use instead:** `UITooltip` for fully custom tooltip content, `UIPopover` for interactive floating panels.

## Import

```ts
import { UIActionTooltip } from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import { UIActionTooltip, UIIconButton } from '@wisemen/vue-core-design-system'
import { SearchMdIcon } from '@wisemen/vue-core-icons'
</script>

<template>
  <UIActionTooltip label="Search" keyboard-shortcut="⌘K">
    <UIIconButton :icon="SearchMdIcon" label="Search" />
  </UIActionTooltip>
</template>
```

## API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string \| null` | `null` | The text displayed in the tooltip. |
| `keyboardShortcut` | `string \| null` | `null` | Visual keyboard shortcut text (e.g., "⌘K", "Ctrl+S"). |
| `isDisabled` | `boolean` | `false` | When true, the tooltip is hidden. |
| `disableCloseOnTriggerClick` | `boolean` | `false` | When true, clicking the trigger will not close the tooltip. |
| `popoverAlign` | `'center' \| 'start' \| 'end'` | `'center'` | Alignment relative to the trigger. |
| `popoverSide` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'` | Which side the tooltip appears on. |

### Slots

| Slot | Description |
|------|-------------|
| `default` | The trigger element that activates the tooltip on hover/focus. Must be a single root element. |

### Emits

This component has no custom events.

## Variants

This component has no size/variant options. It always renders with a fixed side offset of 4px and `disableHoverableContent` set to true.

## Examples

### Label Only

```vue
<script setup lang="ts">
import { UIActionTooltip, UIIconButton } from '@wisemen/vue-core-design-system'
import { Trash01Icon } from '@wisemen/vue-core-icons'
</script>

<template>
  <UIActionTooltip label="Delete">
    <UIIconButton :icon="Trash01Icon" label="Delete" />
  </UIActionTooltip>
</template>
```

### With Keyboard Shortcut

```vue
<UIActionTooltip label="Save" keyboard-shortcut="⌘S">
  <UIIconButton :icon="SaveIcon" label="Save" />
</UIActionTooltip>
```

### Shortcut Only

```vue
<UIActionTooltip keyboard-shortcut="���Z">
  <UIButton label="Undo" />
</UIActionTooltip>
```

### Bottom Placement

```vue
<UIActionTooltip label="Settings" popover-side="bottom">
  <UIIconButton :icon="SettingsIcon" label="Settings" />
</UIActionTooltip>
```

### Disabled

```vue
<UIActionTooltip label="Not shown" :is-disabled="true">
  <UIButton label="No tooltip" />
</UIActionTooltip>
```

## Anatomy

```
UIActionTooltip
└── UITooltip (disableHoverableContent, popoverSideOffset=4)
    ├── #trigger
    │   └── <slot /> (default slot)
    └── #content
        └── UITooltipContent
            └── UIRowLayout (gap="sm")
                ├── UITooltipText (if label is not null)
                └── UIKeyboardShortcut (if keyboardShortcut is not null)
```

## Styling

**Style file:** No separate style file. Uses UITooltipContent and UITooltipText for styling.
The tooltip content renders in a row layout with `gap="sm"` between the label and the keyboard shortcut badge.

## Common Mistakes

### LOW: Providing neither label nor keyboardShortcut

If both `label` and `keyboardShortcut` are null, the tooltip renders an empty panel. Always provide at least one.

### LOW: Using for interactive content

UIActionTooltip is non-interactive (`disableHoverableContent` is forced to true). Use `UIPopover` for content that the user needs to interact with.

## Accessibility

- Inherits all accessibility features from UITooltip (ARIA attributes, keyboard focus activation, Escape to dismiss).
- The label text is exposed to screen readers via `aria-describedby`.
- Keyboard shortcuts shown in the tooltip are purely visual hints and do not register actual keyboard bindings.

## See Also

- [tooltip](../tooltip/SKILL.md) -- For fully custom tooltip content
- [popover](../popover/SKILL.md) -- For interactive floating content
- [keyboard-shortcut](../keyboard-shortcut/SKILL.md) -- The keyboard shortcut badge component used internally
