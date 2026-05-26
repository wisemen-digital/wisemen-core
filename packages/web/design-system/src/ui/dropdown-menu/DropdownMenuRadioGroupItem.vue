<script setup lang="ts">
import { CheckIcon } from '@wisemen/vue-core-icons'
import {
  DropdownMenuItemIndicator,
  DropdownMenuRadioItem,
} from 'reka-ui'

import { UIMenuItem } from '@/ui/menu-item'
import type { MenuItemConfig } from '@/ui/menu-item/menuItem.type'

const props = withDefaults(defineProps<{
  isDisabled?: boolean
  config?: MenuItemConfig | null
  disabledReason?: string | null
  label: string
  value: string
}>(), {
  config: null,
  disabledReason: null,
})
</script>

<template>
  <DropdownMenuRadioItem
    :value="props.value"
    :disabled="props.isDisabled || props.disabledReason !== null"
    class="
      w-full cursor-default rounded-sm outline-none
      data-disabled:cursor-not-allowed
      not-data-disabled:data-highlighted:bg-secondary-hover
    "
  >
    <UIMenuItem
      :is-disabled="props.isDisabled"
      :disabled-reason="props.disabledReason"
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
