---
name: interactable
description: >
  Low-level renderless wrapper that applies focus-visible outline and cursor styles to
  interactive elements. Similar to UIClickableElement but with a different outline approach.
  Load this skill when building custom interactive primitives.
type: component
library: vue-core-design-system
category: infrastructure
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

## Source Files

For full API details, read the props file.

- Props: `src/ui/interactable/interactable.props.ts`
- Component: `src/ui/interactable/Interactable.vue`

## See Also

- [clickable-element](../clickable-element/SKILL.md) -- Alternative with different outline behavior
- [button](../button/SKILL.md) -- Fully styled action button
