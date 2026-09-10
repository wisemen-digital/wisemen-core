---
name: menu-item
description: >
  UIMenuItem is a flexible content layout component for items in dropdown menus,
  lists, and selectable options. It supports icons, avatars, dots, descriptions,
  right-side content, and a right slot.
type: component
library: vue-core-design-system
category: display
exports:
  - UIMenuItem
---

# UIMenuItem

A flexible content layout component for rendering items in menus, dropdowns, and lists.

## When to Use

- Inside `UIDropdownMenuItem` or select/autocomplete item slots for rich content layout
- Any list where items need icon/avatar + label + description + right-side content
- When you need a consistent item layout with configurable left and right content

**Use instead:** For the interactive dropdown menu item wrapper itself, use `UIDropdownMenuItem`. UIMenuItem is the content layout, not the interactive container.

## Import

```ts
import { UIMenuItem } from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import { UIMenuItem } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UIMenuItem label="Apple" />
</template>
```

## Source Files

For full API details, read the props file. For usage examples, read the playground files.

- Props: `src/ui/menu-item/menuItem.props.ts`
- Component: `src/ui/menu-item/MenuItem.vue`
- Playground: `src/ui/menu-item/stories/`

## See Also

- [dropdown-menu](../dropdown-menu/SKILL.md) -- Interactive menu that uses UIMenuItem for content layout
- [select](../select/SKILL.md) -- Select dropdown options use UIMenuItem internally
