---
name: button
description: >
  UIButton, UIIconButton, and UILink -- the three action trigger variants.
  UIButton renders a labeled button, UIIconButton renders an icon-only button
  with an accessible label, and UILink renders a navigation element styled
  like a button using either Vue Router or a plain anchor.
type: component
library: vue-core-design-system
library_version: "0.8.0"
category: button
requires: []
exports:
  - UIButton
  - UIButtonProps
  - UIIconButton
  - UIIconButtonProps
  - UILink
  - UILinkProps
---

# UIButton / UIIconButton / UILink

Three variants of the button primitive: labeled button, icon-only button, and navigation link styled as a button.

## When to Use

- **UIButton** -- Primary action trigger with a visible text label (forms, dialogs, toolbars).
- **UIIconButton** -- Compact icon-only action (toolbar buttons, close buttons, inline actions).
- **UILink** -- Navigation that should look like a button (external links, router links).

**Use instead:** Use `UILink` over a raw `<a>` or `<RouterLink>` when you want button styling. Use `UIIconButton` instead of `UIButton` when space is tight and the icon is universally understood.

## Import

```ts
import { UIButton, UIIconButton, UILink } from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import { UIButton, UIIconButton, UILink } from '@wisemen/vue-core-design-system'
import { Settings01Icon } from '@wisemen/vue-core-icons'
</script>

<template>
  <UIButton label="Save" variant="primary" @click="onSave" />

  <UIIconButton :icon="Settings01Icon" label="Settings" variant="secondary" />

  <UILink label="Learn More" :link="{ href: 'https://example.com', target: '_blank' }" />
</template>
```

## API

### UIButton Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | **(required)** | Text label displayed inside the button. |
| `variant` | `'primary' \| 'secondary' \| 'tertiary' \| 'destructive-primary' \| 'destructive-secondary' \| 'destructive-tertiary' \| 'minimal-color'` | `'primary'` | Visual style variant. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Controls the button size. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Native button type attribute. |
| `isDisabled` | `boolean` | `false` | Disables the button, preventing interaction. |
| `disabledReason` | `string \| null` | `null` | Tooltip text explaining why the button is disabled. |
| `isLoading` | `boolean` | `false` | Shows a loading spinner and disables interaction. |
| `iconLeft` | `Component \| null` | `null` | Icon displayed before the label. |
| `iconRight` | `Component \| null` | `null` | Icon displayed after the label. |
| `tooltipLabel` | `string \| null` | `null` | Tooltip text shown on hover or focus. |
| `tooltipSide` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Position of the tooltip relative to the button. |
| `keyboardShortcut` | `string \| null` | `null` | Visual keyboard shortcut badge (e.g. "meta_k"). Presentational only. |
| `form` | `string \| null` | `null` | Associates button with a form by ID. |

### UIButton Slots

| Slot | Description |
|------|-------------|
| `left` | Content rendered before the left icon position. |

### UIButton Emits

| Event | Payload | Description |
|-------|---------|-------------|
| `click` | `MouseEvent` | Fired on click. Suppressed when `isLoading` is true. |

---

### UIIconButton Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `Component` | **(required)** | Icon displayed inside the button. |
| `label` | `string` | **(required)** | Accessible label (used as `aria-label` and tooltip text). |
| `variant` | `'primary' \| 'secondary' \| 'tertiary' \| 'destructive-primary' \| 'destructive-tertiary'` | `'primary'` | Visual style variant. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Controls the button size. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Native button type attribute. |
| `isDisabled` | `boolean` | `false` | Disables the button, preventing interaction. |
| `disabledReason` | `string \| null` | `null` | Tooltip text explaining why the button is disabled. |
| `isLoading` | `boolean` | `false` | Shows a loading spinner and disables interaction. |
| `isTooltipDisabled` | `boolean` | `false` | Disables tooltip display. |
| `tooltipLabel` | `string \| null` | `null` | Custom tooltip text (overrides `label`). |
| `keyboardShortcut` | `string \| null` | `null` | Visual keyboard shortcut badge. Presentational only. |
| `form` | `string \| null` | `null` | Associates button with a form by ID. |

### UIIconButton Slots

No slots.

### UIIconButton Emits

| Event | Payload | Description |
|-------|---------|-------------|
| `click` | `MouseEvent` | Fired on click. Suppressed when `isLoading` is true. |

---

### UILink Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | **(required)** | Text label displayed inside the link. |
| `to` | `RouteLocationRaw \| null` | `null` | Vue Router destination. Renders a `<RouterLink>`. |
| `link` | `{ href: string; target?: '_blank' \| '_self' \| '_parent' \| '_top'; rel?: string } \| null` | `null` | Native anchor attributes. Renders an `<a>` tag. |
| `variant` | `'primary' \| 'secondary' \| 'tertiary' \| 'destructive-primary' \| 'destructive-tertiary'` | `'primary'` | Visual style variant. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Controls the link size. |
| `iconLeft` | `Component \| null` | `null` | Icon displayed before the label. |
| `iconRight` | `Component \| null` | `null` | Icon displayed after the label. |
| `tooltipLabel` | `string \| null` | `null` | Tooltip text shown on hover or focus. |
| `tooltipSide` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Position of the tooltip. |
| `keyboardShortcut` | `string \| null` | `null` | Visual keyboard shortcut badge. Presentational only. |

### UILink Slots

No slots.

### UILink Emits

No custom events.

## Variants

### Visual variants

| Variant | UIButton | UIIconButton | UILink | Description |
|---------|----------|--------------|--------|-------------|
| `primary` | Yes | Yes | Yes | Filled brand-colored background. Dark mode uses glassy effect. |
| `secondary` | Yes | Yes | Yes | Bordered with subtle background. |
| `tertiary` | Yes | Yes | Yes | Borderless, hover reveals background. |
| `destructive-primary` | Yes | Yes | Yes | Filled red background for dangerous actions. |
| `destructive-secondary` | Yes | No | No | Bordered red variant. UIButton only. |
| `destructive-tertiary` | Yes | Yes | Yes | Borderless red text. |
| `minimal-color` | Yes | No | No | Borderless brand-colored text. UIButton only. |

### Sizes

| Size | Button height | Icon size | Text |
|------|---------------|-----------|------|
| `xs` | `h-5.5` | `size-3.5` | `text-xs` |
| `sm` | `h-6` | `size-3.5` | `text-xs` |
| `md` | `h-7` | `size-3.5` | `text-xs` |
| `lg` | `h-8` | `size-4` | `text-sm` |

UIIconButton uses square dimensions (`size-5.5` through `size-8`).

## Examples

### Button with icons

```vue
<script setup lang="ts">
import { UIButton } from '@wisemen/vue-core-design-system'
import { PlusIcon, ArrowRightIcon } from '@wisemen/vue-core-icons'
</script>

<template>
  <UIButton
    :icon-left="PlusIcon"
    label="Add Item"
    variant="primary"
  />

  <UIButton
    :icon-right="ArrowRightIcon"
    label="Next Step"
    variant="secondary"
  />
</template>
```

### Loading and disabled states

```vue
<script setup lang="ts">
import { UIButton } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UIButton
    :is-loading="true"
    label="Saving..."
    variant="primary"
  />

  <UIButton
    :is-disabled="true"
    disabled-reason="You do not have permission."
    label="Delete"
    variant="destructive-primary"
  />
</template>
```

### Icon button with custom tooltip

```vue
<script setup lang="ts">
import { UIIconButton } from '@wisemen/vue-core-design-system'
import { Settings01Icon } from '@wisemen/vue-core-icons'
</script>

<template>
  <UIIconButton
    :icon="Settings01Icon"
    label="Open settings"
    tooltip-label="Project settings"
    keyboard-shortcut="meta_comma"
    variant="tertiary"
    size="sm"
  />
</template>
```

### Link with Vue Router

```vue
<script setup lang="ts">
import { UILink } from '@wisemen/vue-core-design-system'
import { ExternalLinkIcon } from '@wisemen/vue-core-icons'
</script>

<template>
  <!-- Vue Router link -->
  <UILink
    label="Go to Dashboard"
    :to="{ name: 'dashboard' }"
    variant="primary"
  />

  <!-- External anchor link -->
  <UILink
    label="Documentation"
    :icon-right="ExternalLinkIcon"
    :link="{ href: 'https://docs.example.com', target: '_blank', rel: 'noopener' }"
    variant="tertiary"
  />
</template>
```

## Anatomy

```
UIButton
  ActionTooltip
    <button>
      container (grid stack)
        Loader (grid area: stack, visible when isLoading)
        RowLayout (grid area: stack, hidden when isLoading)
          slot[left]
          ButtonIcon (iconLeft)
          <span> label
          ButtonIcon (iconRight)

UIIconButton
  ActionTooltip
    <button aria-label="...">
      container (grid stack)
        Loader (grid area: stack, visible when isLoading)
        RowLayout (grid area: stack, hidden when isLoading)
          IconButtonIcon (icon)

UILink
  ActionTooltip
    <RouterLink|a>
      container (grid stack)
        RowLayout (grid area: stack)
          LinkIcon (iconLeft)
          <span> label
          LinkIcon (iconRight)
```

## Styling

**Style files:**
- `src/ui/button/button/button.style.ts` -- UIButton
- `src/ui/button/icon/iconButton.style.ts` -- UIIconButton
- `src/ui/button/link/link.style.ts` -- UILink

**tv() slots (UIButton):** `root`, `container`, `rowLayout`, `label`, `icon`, `loader`

**tv() slots (UIIconButton):** `root`, `container`, `rowLayout`, `icon`, `loader`

**tv() slots (UILink):** `root`, `container`, `rowLayout`, `label`, `icon`

Dark mode: The `primary` variant uses a `glassy` / `glassy-inner-content` utility for a glass-morphism effect. Compound variants adjust border-radius and padding per size.

## Common Mistakes

### ERROR: UILink without `to` or `link`

```vue
<!-- WRONG: throws at runtime -->
<UILink label="Click me" />

<!-- CORRECT: provide either `to` or `link` -->
<UILink label="Click me" :link="{ href: '/page' }" />
<UILink label="Click me" :to="{ name: 'page' }" />
```

UILink requires exactly one of `to` (Vue Router) or `link` (native anchor). Omitting both throws: `"Either 'link' or 'to' must be provided."`

### WARNING: Using UIButton for navigation

```vue
<!-- WRONG -->
<UIButton label="Go to page" @click="router.push({ name: 'page' })" />

<!-- CORRECT -->
<UILink label="Go to page" :to="{ name: 'page' }" />
```

Use `UILink` for navigation so the rendered element is a proper `<a>` or `<RouterLink>`, enabling right-click, middle-click, and accessibility.

### WARNING: IconButton without descriptive label

```vue
<!-- WRONG: label="X" is not descriptive -->
<UIIconButton :icon="XCloseIcon" label="X" />

<!-- CORRECT -->
<UIIconButton :icon="XCloseIcon" label="Close dialog" />
```

The `label` prop is used as `aria-label` and tooltip text. It must describe the action, not the icon.

## Accessibility

- **UIButton**: Renders a native `<button>` with `disabled`, `aria-disabled` (when loading), and `aria-busy` (when loading).
- **UIIconButton**: Renders a native `<button>` with `aria-label` set to the `label` prop. Tooltip displays by default with the label text.
- **UILink**: Renders either a `<RouterLink>` or `<a>` tag for proper link semantics.
- All three variants support keyboard navigation (Tab to focus, Enter/Space to activate).
- Disabled buttons show a `disabledReason` tooltip on hover when the reason is provided.
- The `data-interactive` attribute is set only when the button is both enabled and not loading, preventing pointer events on non-interactive states.

## See Also

- [dropdown-menu](../dropdown-menu/SKILL.md) -- Often triggered by a button
- [menu-item](../menu-item/SKILL.md) -- Content layout inside dropdown menus
- [tabs](../tabs/SKILL.md) -- Tab triggers share similar styling patterns
