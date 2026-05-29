---
name: tooltip
description: >
  A hover/focus-triggered floating label built on Reka UI TooltipRoot. Supports configurable delay, side positioning, arrow visibility, and custom content via slots.
type: component
library: vue-core-design-system
category: overlay
exports:
  - UITooltip
  - UITooltipContent
  - UITooltipProvider
  - UITooltipText
---

# UITooltip

A floating label that appears on hover or keyboard focus, providing brief informational text about a trigger element.

## When to Use

- Adding descriptive text to icon-only buttons
- Explaining the purpose of a UI element on hover
- Showing supplementary info that does not require interaction

**Use instead:** `UIActionTooltip` for tooltips with a keyboard shortcut badge, `UIPopover` for interactive floating content.

## Import

```ts
import { UITooltip } from '@wisemen/vue-core-design-system'
```

## Quick Start

```vue
<script setup lang="ts">
import { UITooltip, UIButton } from '@wisemen/vue-core-design-system'
</script>

<template>
  <UITooltip>
    <template #trigger>
      <UIButton label="Hover me" />
    </template>
    <template #content>
      <div class="flex px-sm py-xs">
        <p class="text-xs text-secondary">Tooltip text</p>
      </div>
    </template>
  </UITooltip>
</template>
```

## Source Files

For full API details, read the props file. For usage examples, read the playground files.

- Props: `src/ui/tooltip/tooltip.props.ts`
- Components: `src/ui/tooltip/Tooltip.vue`, `src/ui/tooltip/TooltipProvider.vue`, `src/ui/tooltip/TooltipContent.vue`, `src/ui/tooltip/TooltipText.vue`
- Playground: `src/ui/tooltip/stories/`

## See Also

- [action-tooltip](../action-tooltip/SKILL.md) -- For tooltips with keyboard shortcut badges
- [popover](../popover/SKILL.md) -- For interactive floating content
