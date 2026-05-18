<script setup lang="ts">
import { ChevronRightIcon } from '@wisemen/vue-core-icons'
import { DropdownMenuSubTrigger as RekaDropdownMenuSubTrigger } from 'reka-ui'

import { UIMenuItem } from '@/ui/menu-item'
import type { MenuItemConfig } from '@/ui/menu-item/menuItem.type'

const props = withDefaults(defineProps<{
  isDisabled?: boolean
  config?: MenuItemConfig | null
  disabledReason?: string | null
  label: string
}>(), {
  config: null,
  disabledReason: null,
})
</script>

<template>
  <RekaDropdownMenuSubTrigger
    :disabled="props.isDisabled || props.disabledReason !== null"
    class="
      cursor-default rounded-sm outline-none
      data-disabled:cursor-not-allowed
      not-data-disabled:data-highlighted:bg-secondary-hover
      data-[state=open]:bg-secondary-hover
    "
  >
    <UIMenuItem
      :is-disabled="props.isDisabled"
      :disabled-reason="props.disabledReason"
      :config="props.config"
      :label="props.label"
    >
      <template #right>
        <ChevronRightIcon class="size-3.5 text-tertiary" />
      </template>
    </UIMenuItem>
  </RekaDropdownMenuSubTrigger>
</template>
