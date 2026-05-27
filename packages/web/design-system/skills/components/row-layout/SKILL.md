---
name: row-layout
description: >
  Horizontal flex container with configurable gap, alignment, and justification using
  design-token spacing. Renders as a customizable HTML element and provides a default
  slot for child content. Use for any horizontal arrangement of elements.
type: component
library: vue-core-design-system
category: layout
requires:
  - layout-system
exports:
  - UIRowLayout
---

# UIRowLayout

Horizontal flex container with token-based gap, cross-axis alignment, and main-axis justification.

## When to Use

- Placing buttons, badges, or controls side by side with consistent spacing
- Building action bars, toolbars, or inline form layouts
- Any horizontal arrangement where you need design-token spacing rather than raw Tailwind

**Use instead:** `UIColumnLayout` for vertical stacking. A plain `div` with `flex` when you need wrapping or non-standard flex behavior.

## Import

```ts
import { UIRowLayout } from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import { UIRowLayout, UIButton } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UIRowLayout gap="lg" align="center" justify="between">
    <UIButton label="Cancel" variant="secondary" />
    <UIButton label="Save" />
  </UIRowLayout>
</template>
```

## API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `align` | `'baseline' \| 'center' \| 'end' \| 'start'` | `'center'` | Cross-axis (vertical) alignment of items. |
| `as` | `string` | `'div'` | The HTML element to render as the container. |
| `gap` | `LayoutGap` | `'md'` | Spacing between items. See gap scale below. |
| `justify` | `'between' \| 'center' \| 'end' \| 'start'` | `'start'` | Main-axis (horizontal) distribution of items. |

**`LayoutGap` values:** `'none'` | `'xxs'` | `'xs'` | `'sm'` | `'md'` | `'lg'` | `'xl'` | `'2xl'` | `'3xl'` | `'4xl'` | `'5xl'` | `'6xl'` | `'7xl'` | `'8xl'` | `'9xl'` | `'10xl'` | `'11xl'`

### Slots

| Slot | Description |
|------|-------------|
| `default` | Child elements arranged horizontally. |

### Emits

No custom events.

## Variants

This component has no visual variants. All appearance is controlled via props (`gap`, `align`, `justify`).

## Examples

### Space Between with Large Gap

```vue
<script setup lang="ts">
import { UIRowLayout, UIButton } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UIRowLayout gap="lg" justify="between" class="w-full">
    <UIButton label="Hello" />
    <UIButton label="Hi there" variant="secondary" />
    <UIButton label="Morning" variant="tertiary" />
  </UIRowLayout>
</template>
```

### Center Justified

```vue
<script setup lang="ts">
import { UIRowLayout, UIButton } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UIRowLayout gap="md" justify="center" class="w-full">
    <UIButton label="Ping" />
    <UIButton label="Pong" variant="secondary" />
  </UIRowLayout>
</template>
```

### Rendered as a Section Element

```vue
<script setup lang="ts">
import { UIRowLayout } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UIRowLayout as="section" gap="xl" align="start">
    <div>Block A</div>
    <div>Block B</div>
  </UIRowLayout>
</template>
```

## Anatomy

```
Component[as] .flex.flex-row .[alignClass] .[justifyClass] .[gapClass]
  <slot />
```

## Styling

**Style file:** No separate style file. Uses inline Tailwind classes mapped from props.
**CSS classes:** `flex flex-row` is always applied. Alignment, justification, and gap classes are computed from props (e.g., `items-center`, `justify-between`, `gap-lg`).

## Common Mistakes

### MEDIUM: Using raw Tailwind flex instead of UIRowLayout

Wrong:
```html
<div class="flex flex-row items-center gap-4">
  <button>A</button>
  <button>B</button>
</div>
```

Correct:
```vue
<UIRowLayout gap="xl" align="center">
  <UIButton label="A" />
  <UIButton label="B" />
</UIRowLayout>
```

UIRowLayout uses design-token spacing (`gap-md`, `gap-lg`, etc.) to ensure consistency across the application.

### LOW: Expecting wrap behavior

UIRowLayout does not wrap by default and has no `wrap` prop. If you need flex-wrap, use a raw `div` with Tailwind classes or extend the component.

## Accessibility

- Renders a semantic HTML element (default `div`, customizable via `as`).
- No ARIA attributes are added; rely on the semantic meaning of `as` (e.g., `nav`, `section`) when appropriate.
- Keyboard navigation depends on the child elements, not the layout container.

## See Also

- [UIColumnLayout](../column-layout/) -- Vertical flex container with the same gap/align/justify API
- [Layout System](../../foundations/layout-system/) -- Foundation overview of all layout primitives
