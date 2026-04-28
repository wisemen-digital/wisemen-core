<script setup lang="ts">
import { DropdownMenuItem as RekaDropdownMenuItem } from 'reka-ui'

import { UIActionTooltip } from '@/ui/action-tooltip/index'
import { UIMenuItem } from '@/ui/menu-item'
import type { MenuItemConfig } from '@/ui/menu-item/menuItem.type'

const props = withDefaults(defineProps<{
  config?: MenuItemConfig | null
  disabledReason?: string | null
  label: string
}>(), {
  config: null,
  disabledReason: null,
})

const emit = defineEmits<{
  select: []
}>()
</script>

<template>
  <UIActionTooltip
    :is-disabled="props.disabledReason === null"
    :label="props.disabledReason"
  >
    <RekaDropdownMenuItem
      :disabled="props.disabledReason !== null"
      class="
        group/dropdown-menu-item cursor-default rounded-sm duration-100
        outline-none
        data-disabled:cursor-not-allowed
        not-data-disabled:data-highlighted:bg-secondary-hover
      "
      @select="emit('select')"
    >
      <UIMenuItem
        :config="props.config"
        :label="props.label"
      />
    </RekaDropdownMenuItem>
  </UIActionTooltip>
</template>
