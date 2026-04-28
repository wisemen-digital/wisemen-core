<script setup lang="ts">
import { CheckIcon } from '@wisemen/vue-core-icons'
import {
  DropdownMenuItemIndicator,
  DropdownMenuRadioItem as RekaDropdownMenuRadioItem,
} from 'reka-ui'
import { computed } from 'vue'

import { UIActionTooltip } from '@/ui/action-tooltip/index'
import type { DropdownMenuRadioOption } from '@/ui/dropdown-menu/dropdownMenuItem.type'
import { UIMenuItem } from '@/ui/menu-item'

const props = defineProps<{
  option: DropdownMenuRadioOption
}>()

const disabledReason = computed<string | null>(() => props.option.disabledReason ?? null)
</script>

<template>
  <UIActionTooltip
    :is-disabled="disabledReason === null"
    :label="disabledReason"
  >
    <RekaDropdownMenuRadioItem
      :value="props.option.value"
      :disabled="disabledReason !== null"
      class="
        group/dropdown-menu-item cursor-default rounded-sm duration-100
        outline-none
        data-disabled:cursor-not-allowed
        not-data-disabled:data-highlighted:bg-secondary-hover
      "
    >
      <UIMenuItem
        :config="props.option"
        :label="props.option.label"
      >
        <template #right>
          <DropdownMenuItemIndicator>
            <CheckIcon class="size-3.5 text-tertiary" />
          </DropdownMenuItemIndicator>
        </template>
      </UIMenuItem>
    </RekaDropdownMenuRadioItem>
  </UIActionTooltip>
</template>
