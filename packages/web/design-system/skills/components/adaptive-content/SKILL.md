---
name: adaptive-content
description: >
  A container that conditionally renders child blocks based on available horizontal space
  and an explicit priority order. Lower-priority blocks are progressively hidden when the
  container overflows, exposing a hidden-block count for building overflow indicators.
type: component
library: vue-core-design-system
category: display
exports:
  - UIAdaptiveContent
  - UIAdaptiveContentBlock
---

# UIAdaptiveContent

A responsive container that measures its width and progressively hides lower-priority child blocks until the remaining content fits, exposing a count of hidden blocks for building overflow UIs.

## When to Use

- Displaying a row of items (tabs, badges, tags, toolbar actions) that must gracefully collapse when horizontal space is limited
- Building responsive tab bars where hidden tabs overflow into a dropdown menu
- Showing a badge group with a "+N" overflow indicator

**Use instead:** CSS `overflow: hidden` with `text-overflow: ellipsis` for single-line text truncation. Use a scroll container when all items should remain accessible via scrolling.

## Import

```ts
import { UIAdaptiveContent, UIAdaptiveContentBlock } from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import { UIAdaptiveContent, UIAdaptiveContentBlock } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UIAdaptiveContent v-slot="{ hiddenBlockCount }">
    <div style="display: flex; gap: 8px; overflow: hidden;">
      <UIAdaptiveContentBlock :priority="0">
        <span>Most important</span>
      </UIAdaptiveContentBlock>

      <UIAdaptiveContentBlock :priority="1">
        <span>Second</span>
      </UIAdaptiveContentBlock>

      <UIAdaptiveContentBlock :priority="2">
        <span>Third</span>
      </UIAdaptiveContentBlock>

      <span v-if="hiddenBlockCount > 0">+{{ hiddenBlockCount }} more</span>
    </div>
  </UIAdaptiveContent>
</template>
```

## Source Files

For full API details, read the props file.

- Props: `src/ui/adaptive-content/adaptiveContentBlock.props.ts`
- Components: `src/ui/adaptive-content/AdaptiveContent.vue`, `src/ui/adaptive-content/AdaptiveContentBlock.vue`
- Context: `src/ui/adaptive-content/adaptiveContent.context.ts`

## See Also

- [text](../text/SKILL.md) -- For single-line text truncation with tooltip
- [tabs](../tabs/SKILL.md) -- Tab bars that may use adaptive content for overflow
