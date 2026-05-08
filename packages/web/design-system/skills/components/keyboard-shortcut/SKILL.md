---
name: keyboard-shortcut
description: >
  Renders a keyboard shortcut as styled key badges. Parses a shortcut string
  (e.g., "meta_k", "g-d") into individual keys with platform-aware symbols
  (macOS vs Windows).
type: component
library: vue-core-design-system
category: display
exports:
  - UIKeyboardShortcut
---

# UIKeyboardShortcut

Displays a keyboard shortcut as a row of styled key badges, automatically converting modifier names to platform-specific symbols.

## When to Use

- Showing keyboard shortcuts in tooltips or action tooltips
- Displaying shortcut hints in dropdown menu items
- Building a keyboard shortcuts help panel or reference

**Use instead:** A plain `<kbd>` element for simple one-key displays without platform awareness.

## Import

```ts
import { UIKeyboardShortcut } from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import { UIKeyboardShortcut } from '@wisemen/vue-core-design-system'
</script>

<template>
  <!-- Use _ for combinations (pressed together), - for sequences (pressed in order) -->
  <UIKeyboardShortcut keyboard-shortcut="meta_k" />
</template>
```

## Source Files

For full API details, read the props file.

- Props: `src/ui/keyboard-shortcut/keyboardShortcut.props.ts`
- Component: `src/ui/keyboard-shortcut/KeyboardShortcut.vue`

## See Also

- [action-tooltip](../action-tooltip/SKILL.md) -- Often wraps content with a tooltip that includes a keyboard shortcut
- [dropdown-menu](../dropdown-menu/SKILL.md) -- Menu items commonly display keyboard shortcuts
