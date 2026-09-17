---
name: dropdown-menu
description: >
  UIDropdownMenu is a popover-based menu triggered by a button or custom element.
  Built on Reka UI's DropdownMenu primitives, it supports items with icons and
  keyboard shortcuts, groups, headers, separators, and radio groups for single-select options.
type: component
library: vue-core-design-system
category: navigation
exports:
  - UIDropdownMenu
  - UIDropdownMenuItem
  - UIDropdownMenuGroup
  - UIDropdownMenuHeader
  - UIDropdownMenuSeparator
  - UIDropdownMenuRadioGroup
  - UIDropdownMenuRadioItem
---

# UIDropdownMenu

A popover menu triggered by a button or custom element, with items, groups, radio selection, and keyboard navigation.

## When to Use

- Action menus triggered by a button (e.g. "More actions" dropdown)
- Context menus with grouped actions, keyboard shortcuts, and separators
- Single-select radio groups inside a menu (e.g. sort order, view mode)

**Use instead:** For form-level selection with search, use `UISelect` or `UIAutocomplete`. For simple tooltips, use `UIActionTooltip`.

## Import

```ts
import {
  UIDropdownMenu, UIDropdownMenuItem, UIDropdownMenuGroup,
  UIDropdownMenuHeader, UIDropdownMenuSeparator,
  UIDropdownMenuRadioGroup, UIDropdownMenuRadioItem,
} from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import {
  UIDropdownMenu, UIDropdownMenuItem, UIDropdownMenuGroup,
} from '@wisemen/vue-core-design-system'
import { UIIconButton } from '@wisemen/vue-core-design-system'
import { DotsVerticalIcon, Edit02Icon, Trash01Icon } from '@wisemen/vue-core-icons'
</script>

<template>
  <UIDropdownMenu>
    <template #trigger>
      <UIIconButton :icon="DotsVerticalIcon" label="Actions" variant="tertiary" />
    </template>
    <template #content>
      <UIDropdownMenuGroup>
        <UIDropdownMenuItem :icon="Edit02Icon" label="Edit" @select="onEdit" />
        <UIDropdownMenuItem :icon="Trash01Icon" label="Delete" variant="destructive" @select="onDelete" />
      </UIDropdownMenuGroup>
    </template>
  </UIDropdownMenu>
</template>
```

## Source Files

For full API details, read the props files.

- Props: `src/ui/dropdown-menu/dropdownMenu.props.ts`
- Components: `src/ui/dropdown-menu/DropdownMenu.vue`, `src/ui/dropdown-menu/DropdownMenuItem.vue`, `src/ui/dropdown-menu/DropdownMenuGroup.vue`

## See Also

- [menu-item](../menu-item/SKILL.md) -- Content layout inside dropdown menu items
- [button](../button/SKILL.md) -- Often used as the dropdown trigger
- [popover](../popover/SKILL.md) -- For custom floating panels
