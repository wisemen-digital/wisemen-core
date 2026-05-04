---
name: text
description: >
  Typography component with automatic truncation detection and tooltip. Renders
  text that truncates with an ellipsis and shows a tooltip on hover when content
  overflows. Load this skill when displaying text that may overflow its container.
type: component
library: vue-core-design-system
library_version: "0.8.0"
category: display
requires: []
exports:
  - UIText
  - useIsTruncated
---

# UIText

Renders text with automatic truncation and a hover tooltip when the content overflows its container.

## When to Use

- Displaying text that may be too long for its container (names, titles, descriptions)
- Showing single-line truncated text with a tooltip fallback
- Rendering multi-line clamped text (2-6 lines)

**Use instead:** A plain `<span>` or `<p>` when text will never overflow, or `UIAdaptiveContent` for space-adaptive layout decisions.

## Import

```ts
import { UIText } from '@wisemen/vue-core-design-system'
// Optional: composable for custom truncation detection
import { useIsTruncated } from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import { UIText } from '@wisemen/vue-core-design-system'
</script>

<template>
  <div class="w-64">
    <UIText text="This text will truncate if it exceeds the container width" />
  </div>
</template>
```

## API

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | **(required)** | The text content to display. |
| `as` | `string` | `'span'` | The HTML element or component to render as the text container. |
| `class` | `string \| null` | `null` | Additional CSS classes to apply to the text element. |
| `disableTooltip` | `boolean` | `false` | If `true`, the tooltip will be disabled even if the text is truncated. |
| `truncate` | `boolean \| 2 \| 3 \| 4 \| 5 \| 6` | `true` | If `true`, single-line truncation. If a number (2-6), multi-line clamping. |

### Slots

This component has no slots. Content is set via the `text` prop.

### Emits

This component has no custom events.

## Variants

### Truncation Modes

| Value | Behavior |
|-------|----------|
| `true` | Single-line truncation with ellipsis (`truncate` CSS class) |
| `2` | Clamp to 2 lines (`line-clamp-2`) |
| `3` | Clamp to 3 lines (`line-clamp-3`) |
| `4` | Clamp to 4 lines (`line-clamp-4`) |
| `5` | Clamp to 5 lines (`line-clamp-5`) |
| `6` | Clamp to 6 lines (`line-clamp-6`) |

## Examples

### Single-Line Truncation (Default)

```vue
<script setup lang="ts">
import { UIText } from '@wisemen/vue-core-design-system'
</script>

<template>
  <div class="w-64">
    <UIText text="This is a long piece of text that will be truncated with an ellipsis" />
  </div>
</template>
```

### Multi-Line Clamp

```vue
<script setup lang="ts">
import { UIText } from '@wisemen/vue-core-design-system'
</script>

<template>
  <div class="w-64">
    <UIText
      :truncate="3"
      text="This is a long piece of text that will be clamped to three lines. Any content beyond the third line will be hidden with an ellipsis."
      as="p"
    />
  </div>
</template>
```

### As a Heading

```vue
<script setup lang="ts">
import { UIText } from '@wisemen/vue-core-design-system'
</script>

<template>
  <div class="w-64">
    <UIText
      as="h1"
      class="text-xl font-bold"
      text="Dashboard Overview"
    />
  </div>
</template>
```

### Disabled Tooltip

```vue
<script setup lang="ts">
import { UIText } from '@wisemen/vue-core-design-system'
</script>

<template>
  <div class="w-64">
    <UIText
      :disable-tooltip="true"
      text="This text truncates but will not show a tooltip on hover"
    />
  </div>
</template>
```

### Using the useIsTruncated Composable

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useIsTruncated } from '@wisemen/vue-core-design-system'

const textRef = ref<HTMLElement | null>(null)
const isTruncated = useIsTruncated(textRef)
</script>

<template>
  <div class="w-64">
    <span ref="textRef" class="truncate">
      Custom element with truncation detection
    </span>
    <span v-if="isTruncated" class="text-xs text-tertiary">
      (content is truncated)
    </span>
  </div>
</template>
```

## Anatomy

```
UIText
└── ActionTooltip  (shows full text on hover when truncated)
    └── <Component :is="as">  (dynamic element: span, p, h1, etc.)
            └── {{ text }}
```

## Styling

**Style file:** `src/ui/text/text.style.ts`
**tv() slots:** `text`
**Customization:** Pass a `class` prop to add custom CSS classes (e.g., `text-xl font-bold`). The component always applies `max-w-full` as a base class. Truncation classes are applied based on the `truncate` prop value.

## Common Mistakes

### HIGH: Not constraining the parent container width

Wrong:
```vue
<!-- No width constraint: text will never truncate -->
<UIText text="Some very long text..." />
```

Correct:
```vue
<!-- Parent has a width constraint -->
<div class="w-64">
  <UIText text="Some very long text..." />
</div>
```

The text only truncates when it overflows its container. Without a width constraint on a parent element, the text will expand to fit and never trigger truncation or the tooltip.

### MEDIUM: Using a slot instead of the text prop

Wrong:
```vue
<UIText>Some text content</UIText>
```

Correct:
```vue
<UIText text="Some text content" />
```

UIText does not use slots for content. The `text` prop is required because the same string is used both for rendering and for the tooltip content.

## Accessibility

UIText uses `ActionTooltip` internally to show the full text when truncated. The tooltip appears on hover and focus, providing keyboard-accessible access to the full content. The component uses a `ResizeObserver` to dynamically detect when text is truncated. The tooltip is only shown when content actually overflows, avoiding unnecessary tooltip noise.

## See Also

- [UIActionTooltip](../action-tooltip/SKILL.md) -- The tooltip component used internally
- [UIAdaptiveContent](../adaptive-content/SKILL.md) -- For showing/hiding content based on available space
