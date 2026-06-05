---
name: clickable-element
description: >
  Low-level wrapper that applies consistent focus-visible outline and cursor styles to any
  interactive element. Uses Reka UI Primitive with as-child for zero extra DOM nodes.
  Load this skill when building custom clickable primitives or understanding the focus ring system.
type: component
library: vue-core-design-system
category: infrastructure
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

## Source Files

For full API details, read the props file.

- Props: `src/ui/clickable-element/clickableElement.props.ts`
- Component: `src/ui/clickable-element/ClickableElement.vue`

## See Also

- [interactable](../interactable/SKILL.md) -- Alternative with different outline behavior
- [button](../button/SKILL.md) -- Fully styled action button built on this primitive
