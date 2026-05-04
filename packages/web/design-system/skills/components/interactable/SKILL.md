---
name: interactable
description: >
  Low-level renderless wrapper that applies focus-visible outline and cursor styles to
  interactive elements. Similar to UIClickableElement but with a different outline approach.
  Load this skill when building custom interactive primitives.
type: component
library: vue-core-design-system
library_version: "0.8.0"
category: infrastructure
requires: []
exports:
  - UIInteractable
---

# UIInteractable

A renderless wrapper that applies interactive styles (focus ring, pointer cursor, disabled cursor) to its child element using Reka UI's `Primitive` with `as-child`. Differs from `UIClickableElement` in outline behavior: the outline color is always set to the brand color, and the `outline-2` width only appears on `focus-visible`.

## When to Use

- Building a custom interactive element that needs consistent focus and cursor behavior
- Wrapping an element that should show a focus ring only on keyboard navigation
- When creating compound interactive components that need a shared interaction base

**Use instead:** `UIClickableElement` for similar behavior with an always-present (but transparent) 2px outline. `UIButton` or `UIIconButton` for complete button components.

## Import

```ts
import { UIInteractable } from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import { UIInteractable } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UIInteractable>
    <button>Click me</button>
  </UIInteractable>
</template>
```

## API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `class` | `string \| null` | `null` | Additional CSS classes merged onto the child element via `twMerge`. |

### Slots

| Slot | Description |
|------|-------------|
| `default` | A single interactive child element (button, anchor, div, etc.) that receives the merged styles. |

### Emits

This component has no custom events.

## Variants

This component has no size/variant/color options.

## Examples

### Interactive List Item

```vue
<script setup lang="ts">
import { UIInteractable } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UIInteractable>
    <li
      tabindex="0"
      role="option"
      class="rounded-md border p-3"
    >
      Focusable list item
    </li>
  </UIInteractable>
</template>
```

### With Custom Classes

```vue
<script setup lang="ts">
import { UIInteractable } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UIInteractable class="ring-2 ring-offset-2">
    <button class="rounded-md bg-primary p-2">
      Custom styled button
    </button>
  </UIInteractable>
</template>
```

## Anatomy

```
Primitive[as-child=true]   (no extra DOM node)
  <slot />                 (child receives merged classes)
```

Because `as-child` is `true`, `UIInteractable` does not render its own DOM element. It merges styles directly onto the child.

## Styling

**Style file:** This component uses inline Tailwind classes (no separate style file).

Applied classes:
- `cursor-pointer` -- Pointer cursor for interactive indication
- `rounded-sm` -- Border radius for focus ring shape
- `outline-fg-brand-primary` -- Brand-colored outline (always set as the outline color)
- `focus-visible:outline-2` -- 2px outline width only on keyboard focus
- `disabled:cursor-not-allowed` -- Disabled state cursor

### Difference from UIClickableElement

| Aspect | UIClickableElement | UIInteractable |
|--------|-------------------|----------------|
| Outline width | Always `outline-2`, color is transparent until focus | No outline width until focus-visible |
| Outline color | `transparent` by default, brand on focus | Brand color always, width 0 until focus |
| Cursor override | `isDefaultCursor` prop available | Always `cursor-pointer` |

## Common Mistakes

### HIGH: Passing multiple children

Wrong:
```vue
<UIInteractable>
  <button>One</button>
  <button>Two</button>
</UIInteractable>
```

Correct:
```vue
<UIInteractable>
  <button>One</button>
</UIInteractable>
```

`as-child` mode requires exactly one child element. Multiple children cause unexpected behavior.

## Accessibility

- Applies `focus-visible:outline-2` with `outline-fg-brand-primary` for keyboard-only focus indication.
- Sets `disabled:cursor-not-allowed` to visually indicate disabled state.
- Does not add any ARIA attributes -- the child element must provide its own `role`, `aria-label`, etc.

## See Also

- [UIClickableElement](../clickable-element/) -- Similar wrapper with different outline strategy and cursor override option
- [UIButton](../button/) -- Fully styled button for most action triggers
