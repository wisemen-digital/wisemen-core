<script setup lang="ts">
import { CheckIcon } from '@wisemen/vue-core-icons'
import {
  DropdownMenuItemIndicator,
  DropdownMenuRadioItem,
} from 'reka-ui'

import { UIMenuItem } from '@/ui/menu-item'
import type { MenuItemConfig } from '@/ui/menu-item/menuItem.type'

const props = withDefaults(defineProps<{
  config?: Omit<MenuItemConfig, 'label'> | null
  label: string
  value: string
}>(), {
  config: null,
})
</script>

<template>
  <DropdownMenuRadioItem
    :value="props.value"
    class="
      cursor-default rounded-sm duration-100 outline-none
      data-highlighted:bg-secondary-hover
    "
  >
    <UIMenuItem
      :config="props.config"
      :label="props.label"
    >
      <template #right>
        <DropdownMenuItemIndicator>
          <CheckIcon class="size-3.5 text-tertiary" />
        </DropdownMenuItemIndicator>
      </template>
    </UIMenuItem>
  </DropdownMenuRadioItem>
</template>
