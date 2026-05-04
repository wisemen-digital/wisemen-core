---
name: column-layout
description: >
  Vertical flex container with configurable gap, alignment, and justification using
  design-token spacing. Renders as a customizable HTML element and provides a default
  slot for child content. Use for any vertical stacking of elements.
type: component
library: vue-core-design-system
library_version: "0.8.0"
category: layout
requires:
  - layout-system
exports:
  - UIColumnLayout
---

# UIColumnLayout

Vertical flex container with token-based gap, cross-axis alignment, and main-axis justification.

## When to Use

- Stacking form fields, cards, or sections vertically with consistent spacing
- Building page content areas or sidebar sections
- Any vertical arrangement where you need design-token spacing rather than raw Tailwind

**Use instead:** `UIRowLayout` for horizontal arrangement. A plain `div` with `flex-col` when you need non-standard flex behavior.

## Import

```ts
import { UIColumnLayout } from '@wisemen/vue-core-design-system'
```

The `LayoutGap` type is defined in `columnLayout.props.ts` and shared with `UIRowLayout`. It is not directly exported from the package, but the gap values are documented below for reference.

## Quick Start

```vue
<script setup lang="ts">
import { UIColumnLayout } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UIColumnLayout gap="xl">
    <div class="rounded-lg border p-4">Section 1</div>
    <div class="rounded-lg border p-4">Section 2</div>
    <div class="rounded-lg border p-4">Section 3</div>
  </UIColumnLayout>
</template>
```

## API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `align` | `'center' \| 'end' \| 'start'` | `'start'` | Cross-axis (horizontal) alignment of items. |
| `as` | `string` | `'div'` | The HTML element to render as the container. |
| `gap` | `LayoutGap` | `'md'` | Spacing between items. See gap scale below. |
| `justify` | `'between' \| 'center' \| 'end' \| 'start'` | `'start'` | Main-axis (vertical) distribution of items. |

**`LayoutGap` values:** `'none'` | `'xxs'` | `'xs'` | `'sm'` | `'md'` | `'lg'` | `'xl'` | `'2xl'` | `'3xl'` | `'4xl'` | `'5xl'` | `'6xl'` | `'7xl'` | `'8xl'` | `'9xl'` | `'10xl'` | `'11xl'`

### Slots

| Slot | Description |
|------|-------------|
| `default` | Child elements stacked vertically. |

### Emits

No custom events.

## Variants

This component has no visual variants. All appearance is controlled via props (`gap`, `align`, `justify`).

## Examples

### Form Fields with Large Gap

```vue
<script setup lang="ts">
import { UIColumnLayout, UITextField } from '@wisemen/vue-core-design-system'
import { ref } from 'vue'

const name = ref<string>('')
const email = ref<string>('')
</script>

<template>
  <UIColumnLayout gap="xl">
    <UITextField v-model="name" label="Name" />
    <UITextField v-model="email" label="Email" type="email" />
  </UIColumnLayout>
</template>
```

### Centered Content

```vue
<script setup lang="ts">
import { UIColumnLayout } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UIColumnLayout gap="lg" align="center" justify="center" class="h-full">
    <h2>Centered Title</h2>
    <p>Centered description text.</p>
  </UIColumnLayout>
</template>
```

### Rendered as a Navigation Element

```vue
<script setup lang="ts">
import { UIColumnLayout } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UIColumnLayout as="nav" gap="xs">
    <a href="/home">Home</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
  </UIColumnLayout>
</template>
```

## Anatomy

```
Component[as] .flex.flex-col .[alignClass] .[justifyClass] .[gapClass]
  <slot />
```

## Styling

**Style file:** No separate style file. Uses inline Tailwind classes mapped from props.
**CSS classes:** `flex flex-col` is always applied. Alignment, justification, and gap classes are computed from props (e.g., `items-start`, `justify-center`, `gap-xl`).

## Common Mistakes

### MEDIUM: Using raw Tailwind flex-col instead of UIColumnLayout

Wrong:
```html
<div class="flex flex-col gap-4">
  <div>Section 1</div>
  <div>Section 2</div>
</div>
```

Correct:
```vue
<UIColumnLayout gap="xl">
  <div>Section 1</div>
  <div>Section 2</div>
</UIColumnLayout>
```

UIColumnLayout uses design-token spacing to ensure consistency across the application.

### LOW: Confusing align in column vs row context

In UIColumnLayout, `align` controls the **horizontal** (cross-axis) alignment, while in UIRowLayout, `align` controls the **vertical** (cross-axis) alignment. The prop name is the same, but the axis flips.

## Accessibility

- Renders a semantic HTML element (default `div`, customizable via `as`).
- No ARIA attributes are added; rely on the semantic meaning of `as` (e.g., `nav`, `section`, `form`) when appropriate.
- Keyboard navigation depends on the child elements, not the layout container.

## See Also

- [UIRowLayout](../row-layout/) -- Horizontal flex container with the same gap/align/justify API
- [Layout System](../../foundations/layout-system/) -- Foundation overview of all layout primitives
