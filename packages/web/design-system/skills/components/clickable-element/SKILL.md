---
name: clickable-element
description: >
  Low-level wrapper that applies consistent focus-visible outline and cursor styles to any
  interactive element. Uses Reka UI Primitive with as-child for zero extra DOM nodes.
  Load this skill when building custom clickable primitives or understanding the focus ring system.
type: component
library: vue-core-design-system
category: infrastructure
requires: []
exports:
  - UIClickableElement
---

# UIClickableElement

A renderless wrapper that applies consistent interactive styles (focus ring, pointer cursor, disabled cursor) to its child element using Reka UI's `Primitive` with `as-child`.

## When to Use

- Building a custom interactive component that needs a consistent focus ring and cursor behavior
- Wrapping a native element (button, anchor, etc.) that should follow the design system's focus-visible pattern
- When you need a lightweight base for clickable areas without adding extra DOM nodes

**Use instead:** `UIInteractable` for an alternative with slightly different outline behavior. `UIButton` or `UIIconButton` for fully styled action buttons.

## Import

```ts
import { UIClickableElement } from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import { UIClickableElement } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UIClickableElement>
    <button>Click me</button>
  </UIClickableElement>
</template>
```

## API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isDefaultCursor` | `boolean` | `false` | When `true`, uses the default cursor instead of `cursor-pointer`. Useful for elements that are interactive but should not visually suggest a click action. |
| `class` | `string` | `''` | Additional CSS classes merged onto the child element via `twMerge`. |

### Slots

| Slot | Description |
|------|-------------|
| `default` | A single interactive child element (button, anchor, div, etc.) that receives the merged styles. |

### Emits

This component has no custom events.

## Variants

This component has no size/variant/color options.

## Examples

### Custom Card Link

```vue
<script setup lang="ts">
import { UIClickableElement } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UIClickableElement>
    <a href="/details" class="block rounded-md border p-4">
      <h3>Card Title</h3>
      <p>Card description text</p>
    </a>
  </UIClickableElement>
</template>
```

### Non-pointer Interactive Element

```vue
<script setup lang="ts">
import { UIClickableElement } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UIClickableElement :is-default-cursor="true">
    <div tabindex="0" role="option">
      Selectable item with default cursor
    </div>
  </UIClickableElement>
</template>
```

## Anatomy

```
Primitive[as-child=true]   (no extra DOM node)
  <slot />                 (child receives merged classes)
```

Because `as-child` is `true`, `UIClickableElement` does not render its own DOM element. It merges styles directly onto the child element.

## Styling

**Style file:** This component uses inline Tailwind classes (no separate style file).

Applied classes:
- `rounded-sm` -- Subtle border radius for the focus ring shape
- `outline-2 outline-transparent` -- Invisible outline by default
- `focus-visible:outline-fg-brand-primary` -- Brand-colored focus ring on keyboard focus
- `disabled:cursor-not-allowed` -- Disabled state cursor
- `cursor-pointer` -- Pointer cursor (unless `isDefaultCursor` is `true`)

Classes are merged with any `class` prop value using `twMerge`.

## Common Mistakes

### HIGH: Passing multiple children

Wrong:
```vue
<UIClickableElement>
  <button>One</button>
  <button>Two</button>
</UIClickableElement>
```

Correct:
```vue
<UIClickableElement>
  <button>One</button>
</UIClickableElement>
<UIClickableElement>
  <button>Two</button>
</UIClickableElement>
```

`as-child` mode from Reka UI merges props into a single child. Multiple children will cause unexpected behavior.

### MEDIUM: Wrapping a non-interactive element without tabindex

Wrong:
```vue
<UIClickableElement>
  <div>Not focusable</div>
</UIClickableElement>
```

Correct:
```vue
<UIClickableElement>
  <div tabindex="0" role="button">Now focusable</div>
</UIClickableElement>
```

The focus-visible outline only activates on elements that can receive focus. Non-interactive elements need `tabindex="0"` and an appropriate `role`.

## Accessibility

- Applies `focus-visible:outline-fg-brand-primary` for keyboard navigation -- the focus ring only appears on keyboard focus, not mouse clicks.
- Sets `disabled:cursor-not-allowed` to visually indicate disabled state.
- Does not add any ARIA attributes -- the child element must provide its own `role`, `aria-label`, etc.

## See Also

- [UIInteractable](../interactable/) -- Similar low-level wrapper with a slightly different outline approach
- [UIButton](../button/) -- Fully styled button component for most action triggers
