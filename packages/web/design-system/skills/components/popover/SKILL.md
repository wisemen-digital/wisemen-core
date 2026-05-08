---
name: popover
description: >
  A floating content panel anchored to a trigger element. Built on Reka UI PopoverRoot with configurable alignment, side, collision handling, and animated open/close transitions.
type: component
library: vue-core-design-system
category: overlay
requires:
  - overlay-system
exports:
  - UIPopover
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

## Source Files

For full API details, read the props file.

- Props: `src/ui/popover/popover.props.ts`
- Component: `src/ui/popover/Popover.vue`

## See Also

- [tooltip](../tooltip/SKILL.md) -- For hover-only informational text
- [dropdown-menu](../dropdown-menu/SKILL.md) -- For menu item lists
- [dialog](../dialog/SKILL.md) -- For large or blocking content
