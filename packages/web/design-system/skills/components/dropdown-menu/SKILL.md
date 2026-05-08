---
name: dropdown-menu
description: >
  UIDropdownMenu is a popover-based menu triggered by a button or custom element.
  Built on Reka UI's DropdownMenu primitives, it supports items with icons and
  keyboard shortcuts, groups, headers, separators, and radio groups for single-select
  options. Content is portalled to the body with configurable positioning.
type: component
library: vue-core-design-system
category: navigation
requires: []
exports:
  - UIDropdownMenu
  - UIDropdownMenuProps
  - UIDropdownMenuItem
  - UIDropdownMenuGroup
  - UIDropdownMenuHeader
  - UIDropdownMenuSeparator
  - UIDropdownMenuRadioGroup
  - UIDropdownMenuRadioItem
  - DropdownMenuItem
---

# UIDropdownMenu

A popover menu triggered by a button or custom element, with items, groups, radio selection, and keyboard navigation.

## When to Use

- Action menus triggered by a button (e.g. "More actions" dropdown).
- Context menus with grouped actions, keyboard shortcuts, and separators.
- Single-select radio groups inside a menu (e.g. sort order, view mode).

**Use instead:** For form-level selection with search, use `UISelect` or `UIAutocomplete`. For simple tooltips, use `UIActionTooltip`.

## Import

```ts
import {
  UIDropdownMenu,
  UIDropdownMenuItem,
  UIDropdownMenuGroup,
  UIDropdownMenuHeader,
  UIDropdownMenuSeparator,
  UIDropdownMenuRadioGroup,
  UIDropdownMenuRadioItem,
} from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import {
  UIDropdownMenu,
  UIDropdownMenuItem,
  UIDropdownMenuGroup,
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
        <UIDropdownMenuItem :icon="Trash01Icon" label="Delete" @select="onDelete" />
      </UIDropdownMenuGroup>
    </template>
  </UIDropdownMenu>
</template>
```

## API

### UIDropdownMenu Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `popoverSide` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'` | Which side the dropdown opens on. |
| `popoverSideOffset` | `number` | `4` | Distance in px between trigger and dropdown. |
| `popoverAlign` | `'center' \| 'start' \| 'end'` | `'center'` | Alignment relative to the trigger. |
| `popoverAlignOffset` | `number` | `0` | Offset in px from the alignment edge. |
| `popoverWidth` | `'anchor-width' \| 'available-width' \| null` | `null` | Width strategy. `null` = natural content width. |
| `popoverCollisionPadding` | `number` | `0` | Padding in px for collision detection with viewport edges. |
| `popoverContainerElement` | `HTMLElement \| null` | `null` | Collision boundary element. |
| `popoverAnimationName` | `string \| null` | `null` | Custom animation name. Defaults to `'dropdown-default'`. |
| `isPopoverArrowVisible` | `boolean` | `false` | Whether to show an arrow pointing at the trigger. |
| `popoverAnchorReferenceElement` | `ReferenceElement \| null` | `null` | Custom anchor element for positioning. |
| `disableUpdateOnLayoutShift` | `boolean` | `false` | Disables repositioning on layout shifts. |
| `prioritizePosition` | `boolean` | `false` | Constrain content to viewport even if it overlaps the trigger. |

### UIDropdownMenu Slots

| Slot | Description |
|------|-------------|
| `trigger` | The element that opens the menu. Rendered as child of Reka's DropdownMenuTrigger (`as-child`). |
| `content` | Menu content: groups, items, headers, separators, radio groups. |

### UIDropdownMenuItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | **(required)** | The item text. |
| `icon` | `Component` | `undefined` | Optional leading icon. |
| `keyboardShortcut` | `string \| null` | `null` | Visual keyboard shortcut badge (e.g. `'meta_k'`). |
| `disabledReason` | `string \| null` | `null` | When set, disables the item and shows a tooltip with the reason. |

### UIDropdownMenuItem Emits

| Event | Payload | Description |
|-------|---------|-------------|
| `select` | (none) | Fired when the item is selected (click or keyboard). |

### UIDropdownMenuHeader Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | **(required)** | Header text displayed above a group. |

### UIDropdownMenuGroup

No props. Wraps items in a Reka `DropdownMenuGroup` with `p-xs` padding.

### UIDropdownMenuSeparator

No props. Renders a horizontal separator line between groups.

### UIDropdownMenuRadioGroup Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | **(required, v-model)** | The currently selected radio value. |

### UIDropdownMenuRadioGroup Slots

| Slot | Description |
|------|-------------|
| `default` | `UIDropdownMenuRadioItem` children. |

### UIDropdownMenuRadioItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | **(required)** | The value this item represents. |
| `label` | `string` | **(required)** | Display text for the radio option. |
| `hint` | `string \| null` | `null` | Secondary hint text shown after the label. |

### UIDropdownMenuRadioItem Slots

| Slot | Description |
|------|-------------|
| `left` | Content rendered before the label text. |

### DropdownMenuItem Type (utility interface)

```ts
interface DropdownMenuItem {
  icon: Component
  label: string
  keyboardShortcut?: string
  onSelect: () => void
}
```

A convenience type for building arrays of menu items programmatically.

## Variants

No visual variant props on UIDropdownMenu. The dropdown content always renders with:
- `min-w-48` minimum width
- `rounded-md border border-secondary bg-primary shadow-lg`
- Animated entrance/exit per side (`dropdown-default` keyframes)

### Items

- Default: `rounded-sm px-md py-sm`, highlight on `data-highlighted` with `bg-secondary-hover`
- Disabled: `cursor-not-allowed`, no highlight
- Radio items: Show a `CheckIcon` indicator when selected, highlight with `bg-tertiary`

## Examples

### Grouped menu with header and separator

```vue
<script setup lang="ts">
import {
  UIDropdownMenu,
  UIDropdownMenuItem,
  UIDropdownMenuGroup,
  UIDropdownMenuHeader,
  UIDropdownMenuSeparator,
} from '@wisemen/vue-core-design-system'
import { UIIconButton } from '@wisemen/vue-core-design-system'
import { DotsVerticalIcon, Edit02Icon, CopyIcon, Trash01Icon } from '@wisemen/vue-core-icons'
</script>

<template>
  <UIDropdownMenu popover-side="bottom" popover-align="end">
    <template #trigger>
      <UIIconButton :icon="DotsVerticalIcon" label="Actions" variant="tertiary" />
    </template>
    <template #content>
      <UIDropdownMenuGroup>
        <UIDropdownMenuHeader title="Actions" />
        <UIDropdownMenuItem :icon="Edit02Icon" label="Edit" keyboard-shortcut="meta_e" @select="onEdit" />
        <UIDropdownMenuItem :icon="CopyIcon" label="Duplicate" @select="onDuplicate" />
      </UIDropdownMenuGroup>
      <UIDropdownMenuSeparator />
      <UIDropdownMenuGroup>
        <UIDropdownMenuItem
          :icon="Trash01Icon"
          label="Delete"
          keyboard-shortcut="meta_backspace"
          @select="onDelete"
        />
      </UIDropdownMenuGroup>
    </template>
  </UIDropdownMenu>
</template>
```

### Radio group for single-select

```vue
<script setup lang="ts">
import { ref } from 'vue'
import {
  UIDropdownMenu,
  UIDropdownMenuGroup,
  UIDropdownMenuRadioGroup,
  UIDropdownMenuRadioItem,
} from '@wisemen/vue-core-design-system'
import { UIButton } from '@wisemen/vue-core-design-system'

const sortOrder = ref<string>('newest')
</script>

<template>
  <UIDropdownMenu popover-side="bottom">
    <template #trigger>
      <UIButton label="Sort" variant="secondary" />
    </template>
    <template #content>
      <UIDropdownMenuGroup>
        <UIDropdownMenuRadioGroup v-model="sortOrder">
          <UIDropdownMenuRadioItem value="newest" label="Newest first" />
          <UIDropdownMenuRadioItem value="oldest" label="Oldest first" />
          <UIDropdownMenuRadioItem value="name" label="Alphabetical" />
        </UIDropdownMenuRadioGroup>
      </UIDropdownMenuGroup>
    </template>
  </UIDropdownMenu>
</template>
```

### Disabled item with reason

```vue
<template>
  <UIDropdownMenuItem
    :icon="Trash01Icon"
    label="Delete"
    disabled-reason="You do not have permission to delete this item."
    @select="onDelete"
  />
</template>
```

The item is visually disabled and shows a tooltip on hover with the disabled reason.

## Anatomy

```
UIDropdownMenu
  RekaDropdownMenuRoot
    RekaDropdownMenuTrigger (as-child)
      slot[trigger]
    RekaDropdownMenuPortal (to="body")
      ThemeProvider (as-child)
        RekaDropdownMenuContent (positioned, animated)
          <div> (rounded, bordered, shadowed container)
            slot[content]
              UIDropdownMenuGroup (RekaDropdownMenuGroup, p-xs)
                UIDropdownMenuHeader (<span> title)
                UIDropdownMenuItem (RekaDropdownMenuItem)
                  UIActionTooltip (for disabled reason)
                    UIRowLayout
                      Icon + UIText (label)
                      KeyboardShortcut (optional)
              UIDropdownMenuSeparator (Separator)
              UIDropdownMenuRadioGroup (DropdownMenuRadioGroup, v-model)
                UIDropdownMenuRadioItem (DropdownMenuRadioItem)
                  RowLayout
                    slot[left] + UIText (label) + UIText (hint)
                    DropdownMenuItemIndicator (CheckIcon)
          DropdownMenuArrow (optional, when isPopoverArrowVisible)
```

## Styling

**Style file:** No dedicated `.style.ts`. Styles are inline Tailwind classes.

**Content container:** `min-w-48 rounded-md border border-secondary bg-primary shadow-lg`

**Item classes:** `rounded-sm px-md py-sm` with `data-highlighted:bg-secondary-hover`

**Animation:** Built-in `dropdown-default` keyframes with side-aware slide + fade (100ms ease-in-out). Custom animations can be provided via `popoverAnimationName`.

**Arrow:** Rotated square element with matching border/background.

## Common Mistakes

### ERROR: Missing trigger slot

```vue
<!-- WRONG: no trigger, menu cannot open -->
<UIDropdownMenu>
  <template #content>
    <UIDropdownMenuItem label="Edit" />
  </template>
</UIDropdownMenu>

<!-- CORRECT -->
<UIDropdownMenu>
  <template #trigger>
    <UIIconButton :icon="DotsVerticalIcon" label="Menu" variant="tertiary" />
  </template>
  <template #content>
    <UIDropdownMenuGroup>
      <UIDropdownMenuItem label="Edit" @select="onEdit" />
    </UIDropdownMenuGroup>
  </template>
</UIDropdownMenu>
```

### WARNING: Items without a group wrapper

```vue
<!-- WRONG: items directly in content slot without group -->
<template #content>
  <UIDropdownMenuItem label="Edit" />
  <UIDropdownMenuItem label="Delete" />
</template>

<!-- CORRECT: wrap in a group for proper padding -->
<template #content>
  <UIDropdownMenuGroup>
    <UIDropdownMenuItem label="Edit" @select="onEdit" />
    <UIDropdownMenuItem label="Delete" @select="onDelete" />
  </UIDropdownMenuGroup>
</template>
```

`UIDropdownMenuGroup` provides the `p-xs` padding. Without it, items sit flush against the container edge.

### WARNING: Using @click instead of @select

```vue
<!-- WRONG: @click does not close the menu properly -->
<UIDropdownMenuItem label="Edit" @click="onEdit" />

<!-- CORRECT: @select integrates with Reka's menu lifecycle -->
<UIDropdownMenuItem label="Edit" @select="onEdit" />
```

Use the `@select` event which is emitted by the Reka DropdownMenuItem and properly handles menu closing.

## Accessibility

- Built on Reka UI's DropdownMenu primitives which implement the WAI-ARIA Menu pattern.
- **Keyboard:** Arrow keys navigate items, Enter/Space selects, Escape closes.
- **Focus management:** Focus is trapped within the open menu and returns to the trigger on close.
- **Disabled items:** Set via `disabledReason` which adds `data-disabled` and shows a tooltip.
- **Radio items:** Use `DropdownMenuRadioGroup` / `DropdownMenuRadioItem` for ARIA radio group semantics with `DropdownMenuItemIndicator` showing a check for the selected value.
- Content is portalled to `<body>` to avoid z-index and overflow clipping issues.

## See Also

- [button](../button/SKILL.md) -- Common trigger elements for dropdown menus
- [menu-item](../menu-item/SKILL.md) -- Rich content layout for menu items (used in select/autocomplete, not directly in dropdown-menu)
- [tabs](../tabs/SKILL.md) -- Adaptive tabs use a dropdown for overflow items
