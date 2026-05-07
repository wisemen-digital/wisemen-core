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

- Props: `src/ui/keyboard-shortcut/keyboardShortcut.props.ts`
- Component: `src/ui/keyboard-shortcut/KeyboardShortcut.vue`

## Examples

### Multi-key combination

```vue
<script setup lang="ts">
import { UIKeyboardShortcut } from '@wisemen/vue-core-design-system'
</script>

<template>
  <!-- Renders: [Cmd] [Shift] [P] on macOS, [Ctrl] [Shift] [P] on Windows -->
  <UIKeyboardShortcut keyboard-shortcut="meta_shift_p" />
</template>
```

### Sequence shortcut

```vue
<script setup lang="ts">
import { UIKeyboardShortcut } from '@wisemen/vue-core-design-system'
</script>

<template>
  <!-- Renders: [G] then [D] -->
  <UIKeyboardShortcut keyboard-shortcut="g-d" />
</template>
```

### Shortcut in a menu item context

```vue
<script setup lang="ts">
import { UIKeyboardShortcut } from '@wisemen/vue-core-design-system'
</script>

<template>
  <div class="flex items-center justify-between gap-xl">
    <span class="text-sm text-primary">Search</span>
    <UIKeyboardShortcut keyboard-shortcut="meta_k" />
  </div>
</template>
```

## See Also

- [action-tooltip](../action-tooltip/SKILL.md) -- Often wraps content with a tooltip that includes a keyboard shortcut
- [dropdown-menu](../dropdown-menu/SKILL.md) -- Menu items commonly display keyboard shortcuts
