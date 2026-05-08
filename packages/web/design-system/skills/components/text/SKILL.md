---
name: text
description: >
  Typography component with automatic truncation detection and tooltip. Renders text that truncates with an ellipsis and shows a tooltip on hover when content overflows.
type: component
library: vue-core-design-system
category: display
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

**Use instead:** A plain `<span>` or `<p>` when text will never overflow.

## Import

```ts
import { UIText } from '@wisemen/vue-core-design-system'
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

## Source Files

For full API details, read the props file. For usage examples, read the playground files.

- Props: `src/ui/text/text.props.ts`
- Component: `src/ui/text/Text.vue`
- Composable: `src/ui/text/isTruncated.composable.ts`
- Playground: `src/ui/text/stories/`

## See Also

- [adaptive-content](../adaptive-content/SKILL.md) -- For space-adaptive layout decisions
