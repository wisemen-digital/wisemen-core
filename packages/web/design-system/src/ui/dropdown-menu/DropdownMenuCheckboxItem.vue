<script setup lang="ts">
import { CheckIcon } from '@wisemen/vue-core-icons'
import {
  DropdownMenuCheckboxItem as RekaDropdownMenuCheckboxItem,
  DropdownMenuItemIndicator,
} from 'reka-ui'

import { UIActionTooltip } from '@/ui/action-tooltip/index'
import { UIMenuItem } from '@/ui/menu-item'
import type { MenuItemConfig } from '@/ui/menu-item/menuItem.type'

const props = withDefaults(defineProps<{
  config?: Omit<MenuItemConfig, 'label'> | null
  disabledReason?: string | null
  label: string
}>(), {
  config: null,
  disabledReason: null,
})

const checked = defineModel<boolean>({ required: true })
</script>

<template>
  <UIActionTooltip
    :is-disabled="props.disabledReason === null"
    :label="props.disabledReason"
  >
    <RekaDropdownMenuCheckboxItem
      v-model="checked"
      :disabled="props.disabledReason !== null"
      class="
        group/dropdown-menu-item cursor-default rounded-sm duration-100
        outline-none
        data-disabled:cursor-not-allowed
        not-data-disabled:data-highlighted:bg-secondary-hover
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
    </RekaDropdownMenuCheckboxItem>
  </UIActionTooltip>
</template>
