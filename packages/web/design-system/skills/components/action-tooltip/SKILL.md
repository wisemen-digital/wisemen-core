---
name: action-tooltip
description: >
  A pre-built tooltip that displays a text label and an optional keyboard shortcut badge.
  Wraps UITooltip with UITooltipText and UIKeyboardShortcut in a row layout. Load this
  skill when you need a standardized tooltip for buttons or actions with shortcut hints.
type: component
library: vue-core-design-system
category: overlay
exports:
  - UIActionTooltip
---

# UIActionTooltip

A pre-built tooltip that displays a text label and an optional keyboard shortcut indicator, designed for action buttons and toolbar items.

## When to Use

- Adding a tooltip with a keyboard shortcut hint to an icon button
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
  <UIActionTooltip label="Search" keyboard-shortcut="meta_k">
    <UIIconButton :icon="SearchMdIcon" label="Search" />
  </UIActionTooltip>
</template>
```

## Source Files

For full API details, read the props file.

- Props: `src/ui/action-tooltip/actionTooltip.props.ts`
- Component: `src/ui/action-tooltip/ActionTooltip.vue`

## See Also

- [tooltip](../tooltip/SKILL.md) -- For fully custom tooltip content
- [keyboard-shortcut](../keyboard-shortcut/SKILL.md) -- Standalone keyboard shortcut display
