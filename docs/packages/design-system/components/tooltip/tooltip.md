<!-- This file was automatically generated. Do not edit it manually -->
<script setup lang="ts">
import Preview from '@/ui/tooltip/stories/TooltipPlayground.vue'

</script>

# Tooltip

Small contextual disclosure for supplemental UI details.

<ClientOnly>
  <DesignSystemPreview>
    <Preview />
  </DesignSystemPreview>
</ClientOnly>

[Open in Storybook](https://wisemen-digital.github.io/wisemen-core/storybook/?path=/story/components-tooltip--default)

## Usage

Put the element to hover on in the `#trigger` slot and the tooltip text in the `#content` slot.

```vue
<script setup lang="ts">
import { UIButton, UITooltip } from '@wisemen/vue-core'
</script>

<template>
  <UITooltip>
    <template #trigger>
      <UIButton label="Hover me" />
    </template>

    <template #content>
      This action cannot be undone
    </template>
  </UITooltip>
</template>
```

## API

<!-- @include: ./tooltip-meta.md -->
