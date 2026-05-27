---
name: breadcrumbs
description: >
  UIBreadcrumbs is a composite navigation component built from UIBreadcrumbRoot,
  UIBreadcrumbItems, UIBreadcrumbItem, and UIBreadcrumbSeparator parts. It renders
  a horizontal breadcrumb trail with optional icons, router links, and accessible
  label-hiding for icon-only items.
type: component
library: vue-core-design-system
category: navigation
requires: []
exports:
  - UIBreadcrumbRoot
  - UIBreadcrumbItems
  - UIBreadcrumbItem
  - UIBreadcrumbItemProps
  - UIBreadcrumbSeparator
  - UIBreadcrumbSelect
  - UIBreadcrumbDateSelect
---

# UIBreadcrumbs

A multi-part breadcrumb navigation component for showing hierarchical page location.

## When to Use

- Display the user's current location within a page hierarchy.
- Provide navigable links back to parent pages.
- Show icon-only breadcrumb segments with accessible hidden labels.

**Use instead:** For tab-based navigation within a page, use `UITabs`. For primary app navigation, use `UISidebar`.

## Import

```ts
import {
  UIBreadcrumbRoot,
  UIBreadcrumbItems,
  UIBreadcrumbItem,
  UIBreadcrumbSeparator,
} from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import {
  UIBreadcrumbRoot,
  UIBreadcrumbItems,
  UIBreadcrumbItem,
  UIBreadcrumbSeparator,
} from '@wisemen/vue-core-design-system'
import { Users01Icon } from '@wisemen/vue-core-icons'
</script>

<template>
  <UIBreadcrumbRoot>
    <UIBreadcrumbItems>
      <UIBreadcrumbItem :icon="Users01Icon" label="Users" to="/" />
      <UIBreadcrumbSeparator />
      <UIBreadcrumbItem label="Jeroen" to="/users/jeroen" />
      <UIBreadcrumbSeparator />
      <UIBreadcrumbItem label="Projects" />
    </UIBreadcrumbItems>
  </UIBreadcrumbRoot>
</template>
```

## API

### UIBreadcrumbItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | **(required)** | The text label for the breadcrumb item. |
| `to` | `RouteLocationRaw` | `undefined` | Route to navigate to on click. When omitted, renders as plain text (current page). |
| `icon` | `Component` | `undefined` | Optional icon displayed before the label. |
| `isLabelHidden` | `boolean` | `false` | Visually hides the label (sr-only) while keeping it accessible. Useful for icon-only items. |

### UIBreadcrumbRoot Props

No props. Renderless wrapper that passes through its default slot content.

### UIBreadcrumbItems Props

No props. Wraps children in a `<nav>` element containing a horizontal `RowLayout`.

### UIBreadcrumbSeparator Props

No props. Renders a `ChevronRightIcon` separator.

### UIBreadcrumbSelect / UIBreadcrumbDateSelect

Placeholder components (currently render empty `<div>`). Reserved for future use with dropdown or date-picker breadcrumb segments.

### Slots

| Component | Slot | Description |
|-----------|------|-------------|
| `UIBreadcrumbRoot` | `default` | Content -- typically `UIBreadcrumbItems`. |
| `UIBreadcrumbItems` | `default` | Breadcrumb items and separators. |

### Emits

No custom events.

## Variants

No variant props. Styling is fixed: items use `text-xs text-quaternary`, icons are `size-4 text-quaternary`, and linked items show `text-primary` + underline on hover.

## Examples

### With icon-only breadcrumb segment

```vue
<script setup lang="ts">
import {
  UIBreadcrumbRoot,
  UIBreadcrumbItems,
  UIBreadcrumbItem,
  UIBreadcrumbSeparator,
} from '@wisemen/vue-core-design-system'
import { NotificationMessageIcon, Users01Icon, User01Icon } from '@wisemen/vue-core-icons'
</script>

<template>
  <UIBreadcrumbRoot>
    <UIBreadcrumbItems>
      <UIBreadcrumbItem :icon="Users01Icon" label="Users" to="/" />
      <UIBreadcrumbSeparator />
      <UIBreadcrumbItem
        :icon="NotificationMessageIcon"
        :is-label-hidden="true"
        label="Messages"
        to="/messages"
      />
      <UIBreadcrumbSeparator />
      <UIBreadcrumbItem :icon="User01Icon" label="Jeroen" to="/users/jeroen" />
      <UIBreadcrumbSeparator />
      <UIBreadcrumbItem label="Projects" />
    </UIBreadcrumbItems>
  </UIBreadcrumbRoot>
</template>
```

### Non-navigable current page

```vue
<template>
  <UIBreadcrumbRoot>
    <UIBreadcrumbItems>
      <UIBreadcrumbItem label="Home" to="/" />
      <UIBreadcrumbSeparator />
      <UIBreadcrumbItem label="Current Page" />
    </UIBreadcrumbItems>
  </UIBreadcrumbRoot>
</template>
```

The last item omits `to`, rendering it as plain text to indicate the current page.

## Anatomy

```
UIBreadcrumbRoot (<slot /> passthrough)
  UIBreadcrumbItems (<nav> + RowLayout)
    UIBreadcrumbItem (ClickableElement > RouterLink | <span>)
      RowLayout
        ActionTooltip (for icon-only items)
          Icon (optional)
        UIText (label, may be sr-only)
    UIBreadcrumbSeparator (ChevronRightIcon)
    UIBreadcrumbItem ...
```

## Styling

**Style file:** No dedicated `.style.ts` file. Styles are inline Tailwind classes in the Vue templates.

**Key classes:**
- Item label: `text-xs text-quaternary` (hover: `text-primary` + `underline` when linked)
- Icon: `size-4 shrink-0 text-quaternary` (hover: `text-primary` when linked)
- Separator: `size-4 shrink-0 text-fg-quaternary`
- BreadcrumbItems nav has `min-w-0` for truncation support

## Common Mistakes

### WARNING: Forgetting separators between items

```vue
<!-- WRONG: no separators -->
<UIBreadcrumbItems>
  <UIBreadcrumbItem label="Home" to="/" />
  <UIBreadcrumbItem label="Page" />
</UIBreadcrumbItems>

<!-- CORRECT -->
<UIBreadcrumbItems>
  <UIBreadcrumbItem label="Home" to="/" />
  <UIBreadcrumbSeparator />
  <UIBreadcrumbItem label="Page" />
</UIBreadcrumbItems>
```

Separators are explicit components, not auto-inserted.

### WARNING: Icon-only item without isLabelHidden

```vue
<!-- WRONG: renders both icon and label, looks cluttered when only the icon is desired -->
<UIBreadcrumbItem :icon="NotificationMessageIcon" label="Messages" to="/" />

<!-- CORRECT: hides label visually, shows tooltip on icon hover -->
<UIBreadcrumbItem
  :icon="NotificationMessageIcon"
  :is-label-hidden="true"
  label="Messages"
  to="/"
/>
```

When you want an icon-only breadcrumb, set `isLabelHidden` to `true`. The label remains accessible to screen readers and appears in a tooltip on hover.

## Accessibility

- `UIBreadcrumbItems` renders a `<nav>` element for landmark navigation.
- Linked items render as `<RouterLink>` (proper `<a>` elements) for keyboard navigation and right-click support.
- Non-linked items render as `<span>` to indicate the current (non-navigable) page.
- When `isLabelHidden` is true, the label gets the `sr-only` class and a tooltip appears on the icon for sighted users.

## See Also

- [tabs](../tabs/SKILL.md) -- For in-page navigation between sibling content panels
- [dropdown-menu](../dropdown-menu/SKILL.md) -- Can be combined for breadcrumb overflow patterns
