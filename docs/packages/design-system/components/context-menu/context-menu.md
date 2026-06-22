<!-- This file was automatically generated. Do not edit it manually -->
<script setup lang="ts">
import Preview from '@/ui/context-menu/stories/ContextMenuPlayground.vue'

</script>

# Context Menu

Contextual action menu for right-click or long-press workflows.

<ClientOnly>
  <DesignSystemPreview>
    <Preview />
  </DesignSystemPreview>
</ClientOnly>

[Open in Storybook](https://wisemen-digital.github.io/wisemen-core/storybook/?path=/story/components-contextmenu--default)

## Usage

Identical structure to `UIDropdownMenu` but activated by right-click. Wrap the target element in the `#trigger` slot.

```vue
<script setup lang="ts">
import { Settings01Icon, Trash01Icon } from '@wisemen/vue-core-icons'
import {
  UIContextMenu,
  UIContextMenuGroup,
  UIContextMenuItem,
  UIContextMenuSeparator,
} from '@wisemen/vue-core'
</script>

<template>
  <UIContextMenu>
    <template #trigger>
      <div class="p-4 border border-dashed rounded">Right-click here</div>
    </template>

    <template #content>
      <UIContextMenuGroup>
        <UIContextMenuItem
          :config="{ left: { type: 'icon', icon: Settings01Icon } }"
          label="Settings"
          @select="() => {}"
        />
      </UIContextMenuGroup>

      <UIContextMenuSeparator />

      <UIContextMenuGroup>
        <UIContextMenuItem
          :config="{ left: { type: 'icon', icon: Trash01Icon } }"
          label="Delete"
          @select="() => {}"
        />
      </UIContextMenuGroup>
    </template>
  </UIContextMenu>
</template>
```

## API

<!-- @include: ./context-menu-meta.md -->
