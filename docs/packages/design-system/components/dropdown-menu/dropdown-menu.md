<!-- This file was automatically generated. Do not edit it manually -->
<script setup lang="ts">
import Preview from '@/ui/dropdown-menu/stories/DropdownMenuPlayground.vue'

</script>

# Dropdown Menu

Triggered menu for grouped actions and secondary command lists.

<ClientOnly>
  <DesignSystemPreview>
    <Preview />
  </DesignSystemPreview>
</ClientOnly>

[Open in Storybook](https://wisemen-digital.github.io/wisemen-core/storybook/?path=/story/components-dropdownmenu--default)

## Usage

Use the `#trigger` slot for the activating element and `#content` for the menu body. Group items with `UIDropdownMenuGroup` and separate sections with `UIDropdownMenuSeparator`.

```vue
<script setup lang="ts">
import { Settings01Icon, Trash01Icon, User01Icon } from '@wisemen/vue-core-icons'
import {
  UIButton,
  UIDropdownMenu,
  UIDropdownMenuGroup,
  UIDropdownMenuItem,
  UIDropdownMenuSeparator,
} from '@wisemen/vue-core'
</script>

<template>
  <UIDropdownMenu>
    <template #trigger>
      <UIButton label="Open menu" />
    </template>

    <template #content>
      <UIDropdownMenuGroup>
        <UIDropdownMenuItem
          :config="{ left: { type: 'icon', icon: User01Icon } }"
          label="Profile"
          @select="() => {}"
        />
        <UIDropdownMenuItem
          :config="{ left: { type: 'icon', icon: Settings01Icon } }"
          label="Settings"
          @select="() => {}"
        />
      </UIDropdownMenuGroup>

      <UIDropdownMenuSeparator />

      <UIDropdownMenuGroup>
        <UIDropdownMenuItem
          :config="{ left: { type: 'icon', icon: Trash01Icon } }"
          label="Delete"
          @select="() => {}"
        />
      </UIDropdownMenuGroup>
    </template>
  </UIDropdownMenu>
</template>
```

## API

<!-- @include: ./dropdown-menu-meta.md -->
