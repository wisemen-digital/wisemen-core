---
name: keyboard-shortcut
description: >
  Renders a keyboard shortcut as styled key badges. Parses a shortcut string
  (e.g., "meta_k", "g-d") into individual keys with platform-aware symbols
  (macOS vs Windows). Load this skill when displaying keyboard shortcuts in
  tooltips, menus, or help panels.
type: component
library: vue-core-design-system
category: display
requires: []
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
  <UIKeyboardShortcut keyboard-shortcut="meta_k" />
</template>
```

## API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `keyboardShortcut` | `string` | **(required)** | The keyboard shortcut string. Use `_` to separate keys in a combination (e.g., `"meta_k"`) and `-` to separate keys in a sequence (e.g., `"g-d"`). |

### Slots

This component has no slots.

### Emits

This component has no custom events.

## Variants

This component has no visual variants. Display adapts automatically based on platform.

### Shortcut String Format

| Separator | Meaning | Example | Renders As (macOS) |
|-----------|---------|---------|-------------------|
| `_` | Combination (pressed together) | `"meta_k"` | `[Cmd]` `[K]` |
| `-` | Sequence (pressed one after another) | `"g-d"` | `[G]` then `[D]` |

### Platform-Aware Key Mappings

| Key Name | macOS | Windows/Linux |
|----------|-------|---------------|
| `meta` | `Cmd` | `Ctrl` |
| `ctrl` | `Control` | `Ctrl` |
| `alt` | `Option` | `Alt` |
| `shift` | `Shift` | `Shift` |
| `enter` | `Return` | `Return` |
| `escape` | `Esc` | `Esc` |
| `backspace` | `Delete` | `Delete` |
| `arrowup` | `Up` | `Up` |
| `arrowdown` | `Down` | `Down` |
| `arrowleft` | `Left` | `Left` |
| `arrowright` | `Right` | `Right` |
| `tab` | `Tab` | `Tab` |

Any unrecognized key name is rendered as-is (capitalized).

## Examples

### Single Combination Shortcut

```vue
<script setup lang="ts">
import { UIKeyboardShortcut } from '@wisemen/vue-core-design-system'
</script>

<template>
  <!-- Renders: [Cmd] [K] on macOS, [Ctrl] [K] on Windows -->
  <UIKeyboardShortcut keyboard-shortcut="meta_k" />
</template>
```

### Sequence Shortcut

```vue
<script setup lang="ts">
import { UIKeyboardShortcut } from '@wisemen/vue-core-design-system'
</script>

<template>
  <!-- Renders: [G] then [D] -->
  <UIKeyboardShortcut keyboard-shortcut="g-d" />
</template>
```

### Multi-Key Combination

```vue
<script setup lang="ts">
import { UIKeyboardShortcut } from '@wisemen/vue-core-design-system'
</script>

<template>
  <!-- Renders: [Cmd] [Shift] [P] on macOS -->
  <UIKeyboardShortcut keyboard-shortcut="meta_shift_p" />
</template>
```

### Shortcut in a Menu Item Context

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

## Anatomy

```
UIKeyboardShortcut
└── UIRowLayout (gap="xs")
    ├── <kbd>  (key badge for each key part)
    └── <span>  (sequence separator label, "then", between sequences)
```

## Styling

**Style file:** None (styles are inline Tailwind classes)
**tv() slots:** None
**Customization:** Each `<kbd>` element is styled with `h-4 min-w-4 rounded-xs border border-secondary px-xxs text-[0.6187rem] text-tertiary capitalize`. In dark mode, keys get `dark:bg-secondary`. The sequence separator text ("then") is styled as `text-xxs text-tertiary` and is localized via `vue-i18n` with the key `component.keyboard_shortcut.sequence_label`.

## Common Mistakes

### HIGH: Using wrong separator characters

Wrong:
```vue
<!-- Using + or space instead of _ for combinations -->
<UIKeyboardShortcut keyboard-shortcut="meta+k" />
<UIKeyboardShortcut keyboard-shortcut="meta k" />
```

Correct:
```vue
<!-- Use _ for combinations, - for sequences -->
<UIKeyboardShortcut keyboard-shortcut="meta_k" />
```

The component parses `_` as combination separator and `-` as sequence separator. Other separators will not be parsed correctly.

### MEDIUM: Mixing up combination and sequence separators

Wrong:
```vue
<!-- This means "meta then k" (sequence), not "meta + k" (combination) -->
<UIKeyboardShortcut keyboard-shortcut="meta-k" />
```

Correct:
```vue
<!-- Combination: meta and k pressed together -->
<UIKeyboardShortcut keyboard-shortcut="meta_k" />

<!-- Sequence: g pressed, then d pressed -->
<UIKeyboardShortcut keyboard-shortcut="g-d" />
```

`_` means keys pressed simultaneously (combination). `-` means keys pressed in order (sequence). Using the wrong separator changes the meaning entirely.

## Accessibility

The component renders each key as a `<kbd>` element, which is the semantic HTML element for keyboard input. The `<kbd>` elements are presented visually in a row. Sequence separators use a localized "then" label between key groups. The component relies on `vue-i18n` for the sequence label translation (`component.keyboard_shortcut.sequence_label`).

## See Also

- [UIActionTooltip](../action-tooltip/SKILL.md) -- Often wraps content with a tooltip that includes a keyboard shortcut
- [UIDropdownMenu](../dropdown-menu/SKILL.md) -- Menu items commonly display keyboard shortcuts
