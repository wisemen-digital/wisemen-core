---
name: menu-item
description: >
  UIMenuItem is a flexible content layout component for items in dropdown menus,
  lists, and selectable options. It supports icons, avatars, dots, descriptions,
  right-side content (text, icons, keyboard shortcuts), and a right slot. Used as
  the content layer inside UIDropdownMenuItem and select/autocomplete items.
type: component
library: vue-core-design-system
library_version: "0.8.0"
category: display
requires: []
exports:
  - UIMenuItem
  - UIMenuItemProps
  - UIMenuItemConfig
  - UIMenuItemAvatarConfig
  - UIMenuItemDotConfig
  - UIMenuItemRightConfig
---

# UIMenuItem

A flexible content layout component for rendering items in menus, dropdowns, and lists.

## When to Use

- Inside `UIDropdownMenuItem` or select/autocomplete item slots for rich content layout.
- Any list where items need icon/avatar + label + description + right-side content.
- When you need a consistent item layout with configurable left and right content.

**Use instead:** For the interactive dropdown menu item wrapper itself, use `UIDropdownMenuItem`. UIMenuItem is the content layout, not the interactive container.

## Import

```ts
import { UIMenuItem } from '@wisemen/vue-core-design-system'
import type { UIMenuItemConfig } from '@wisemen/vue-core-design-system'
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

## API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string \| null` | `null` | The label text. Falls back to `config.label` when not provided. |
| `config` | `MenuItemConfig \| null` | `null` | Configuration object for advanced content layout. |
| `size` | `'md' \| 'sm'` | `'md'` | The size of the menu item. |

### MenuItemConfig

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `label` | `string \| null` | `null` | Override label shown in the item. |
| `icon` | `Component \| null` | `null` | Icon displayed to the left. Cannot combine with `avatar` or `dot`. |
| `avatar` | `MenuItemAvatarConfig \| null` | `null` | Avatar to the left. Cannot combine with `icon` or `dot`. |
| `dot` | `MenuItemDotConfig \| null` | `null` | Colored dot to the left. Cannot combine with `icon` or `avatar`. |
| `description` | `string \| null` | `null` | Secondary text below (or inline with) the label. |
| `descriptionLayout` | `'block' \| 'inline'` | `'block'` | `'block'`: description on its own line. `'inline'`: same line, truncates. |
| `right` | `MenuItemRightConfig \| null` | `null` | Trailing content to the right of the label. |

### MenuItemAvatarConfig

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `name` | `string` | **(required)** | Name used for fallback initials. |
| `src` | `string \| null` | `null` | Image source URL. |
| `imageAlt` | `string \| null` | `null` | Alt text for the avatar image. |

### MenuItemDotConfig

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `color` | `DotColor` | `'gray'` | The color of the dot (e.g. `'success'`, `'error'`, `'gray'`). |

### MenuItemRightConfig (discriminated union on `type`)

| Type | Fields | Description |
|------|--------|-------------|
| `'text'` | `text: string` | Plain text on the right. |
| `'icon'` | `icon: Component` | Single icon on the right. |
| `'icon-text'` | `icon: Component, text: string` | Icon followed by text. |
| `'shortcut'` | `keys: string` | Keyboard shortcut badge (e.g. `'meta_k'`). |

### Slots

| Slot | Description |
|------|-------------|
| `right` | Custom content rendered after the right config content. |

### Emits

No custom events.

## Variants

### Sizes

| Size | Min height | Padding |
|------|------------|---------|
| `md` | `min-h-8` | Vertical `py-sm`, horizontal depends on left/right content (`pl-md`/`pl-lg`, `pr-md`/`pr-lg`) |
| `sm` | `min-h-7` | `px-sm py-xs` |

### Left content (mutually exclusive)

Only one of `icon`, `avatar`, or `dot` can be used at a time:
- **icon**: Renders at `size-3.5 text-tertiary`
- **avatar**: Renders `UIAvatar` at size `'xs'` (or `'sm'` when a description is present)
- **dot**: Renders `UIDot` with the specified color

## Examples

### With icon and description

```vue
<script setup lang="ts">
import { UIMenuItem } from '@wisemen/vue-core-design-system'
import { User02Icon } from '@wisemen/vue-core-icons'
</script>

<template>
  <UIMenuItem
    :config="{
      icon: User02Icon,
      label: 'Alice Johnson',
      description: 'alice@example.com',
    }"
  />
</template>
```

### With avatar and right text

```vue
<script setup lang="ts">
import { UIMenuItem } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UIMenuItem
    :config="{
      avatar: { name: 'Alice Johnson', src: 'https://i.pravatar.cc/150?u=alice' },
      label: 'Alice Johnson',
      right: { type: 'text', text: 'Admin' },
    }"
  />
</template>
```

### With keyboard shortcut

```vue
<script setup lang="ts">
import { UIMenuItem } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UIMenuItem
    :config="{
      right: { type: 'shortcut', keys: 'meta_k' },
    }"
    label="Search"
  />
</template>
```

### With right slot (custom check icon)

```vue
<script setup lang="ts">
import { UIMenuItem } from '@wisemen/vue-core-design-system'
import { CheckIcon } from '@wisemen/vue-core-icons'
</script>

<template>
  <UIMenuItem label="Selected item">
    <template #right>
      <CheckIcon class="size-3.5 text-tertiary" />
    </template>
  </UIMenuItem>
</template>
```

### Inline description with truncation

```vue
<script setup lang="ts">
import { UIMenuItem } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UIMenuItem
    :config="{
      label: 'Alice Johnson',
      description: 'this-is-a-very-long-email@example.com',
      descriptionLayout: 'inline',
    }"
  />
</template>
```

### Dot indicator

```vue
<script setup lang="ts">
import { UIMenuItem } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UIMenuItem
    :config="{ dot: { color: 'success' } }"
    label="Active"
  />
</template>
```

## Anatomy

```
UIMenuItem (UIRowLayout justify="between")
  Left section (UIRowLayout align="center" gap="lg")
    UIAvatar | Icon | UIDot (mutually exclusive, optional)
    Inline layout (UIRowLayout) -- when descriptionLayout='inline'
      UIText (label)
      UIText (description, truncated)
    Block layout (UIColumnLayout) -- when descriptionLayout='block' or no description
      UIText (label)
      UIText (description, optional)
  Right section (UIRowLayout align="center" gap="sm")
    Right config content (text | icon | icon-text | shortcut)
    slot[right]
```

## Styling

**Style file:** `src/ui/menu-item/menuItem.style.ts`

**tv() slots:** `base`, `iconWrapper`, `dotWrapper`

**Variant axes:** `size` (`md` | `sm`), `hasLeftContent` (boolean), `hasRightContent` (boolean)

Compound variants adjust horizontal padding: items with left/right content get extra padding (`pl-lg`/`pr-lg` at `md` size).

## Common Mistakes

### ERROR: Combining icon, avatar, and dot

```vue
<!-- WRONG: only one left-content type is rendered -->
<UIMenuItem
  :config="{
    icon: User02Icon,
    avatar: { name: 'Alice' },
    dot: { color: 'success' },
  }"
  label="Item"
/>

<!-- CORRECT: pick one -->
<UIMenuItem
  :config="{ icon: User02Icon }"
  label="Item"
/>
```

The template renders `avatar`, `icon`, and `dot` with `v-if` / `v-else-if` priority: avatar > icon > dot. Only the first match renders.

### WARNING: Using config.label and prop label together

```vue
<!-- Both are set; config.label is never shown because prop label takes precedence via ?? -->
<UIMenuItem
  :config="{ label: 'Config label' }"
  label="Prop label"
/>
```

The resolved label uses `config.label ?? props.label`. If both are non-null, `config.label` wins. Set only one to avoid confusion.

## Accessibility

- UIMenuItem is a layout component, not an interactive element. Accessibility roles come from the parent (e.g. `UIDropdownMenuItem` adds `role="menuitem"`).
- Text uses `select-none` to prevent accidental text selection during interaction.

## See Also

- [dropdown-menu](../dropdown-menu/SKILL.md) -- Uses UIMenuItem as content inside dropdown items
- [button](../button/SKILL.md) -- For action triggers instead of list items
