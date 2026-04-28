<script setup lang="ts">
import { CheckIcon } from '@wisemen/vue-core-icons'
import {
  DropdownMenuCheckboxItem as RekaDropdownMenuCheckboxItem,
  DropdownMenuItemIndicator,
} from 'reka-ui'
import { computed } from 'vue'

import { UIActionTooltip } from '@/ui/action-tooltip/index'
import type { DropdownMenuCheckboxItem } from '@/ui/dropdown-menu/dropdownMenuItem.type'
import { UIMenuItem } from '@/ui/menu-item'

const props = defineProps<{
  item: DropdownMenuCheckboxItem
}>()

const disabledReason = computed<string | null>(() => props.item.disabledReason ?? null)
</script>

<template>
  <UIActionTooltip
    :is-disabled="disabledReason === null"
    :label="disabledReason"
  >
    <RekaDropdownMenuCheckboxItem
      :model-value="props.item.checked"
      :disabled="disabledReason !== null"
      class="
        group/dropdown-menu-item cursor-default rounded-sm duration-100
        outline-none
        data-disabled:cursor-not-allowed
        not-data-disabled:data-highlighted:bg-secondary-hover
      "
      @update:model-value="props.item.onChange"
    >
      <UIMenuItem
        :config="props.item"
        :label="props.item.label"
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
