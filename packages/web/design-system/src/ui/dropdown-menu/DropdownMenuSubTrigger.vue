<script setup lang="ts">
import { ChevronRightIcon } from '@wisemen/vue-core-icons'
import { DropdownMenuSubTrigger as RekaDropdownMenuSubTrigger } from 'reka-ui'
import type { Component } from 'vue'

import { UIActionTooltip } from '@/ui/action-tooltip'
import { UIRowLayout } from '@/ui/row-layout'
import { UIText } from '@/ui/text'

const props = withDefaults(defineProps<{
  isDisabled?: boolean
  disabledReason?: string | null
  icon?: Component | null
  label: string
}>(), {
  isDisabled: false,
  disabledReason: null,
  icon: null,
})
</script>

<template>
  <RekaDropdownMenuSubTrigger
    :disabled="props.isDisabled"
    class="group/dropdown-menu-sub-trigger outline-none"
  >
    <UIActionTooltip
      :is-disabled="!props.isDisabled || props.disabledReason === null"
      :label="props.disabledReason"
    >
      <div
        class="
          cursor-default rounded-sm px-md py-sm
          group-data-disabled/dropdown-menu-sub-trigger:cursor-not-allowed
          group-not-data-disabled/dropdown-menu-sub-trigger:group-data-highlighted/dropdown-menu-sub-trigger:bg-secondary-hover
        "
      >
        <UIRowLayout justify="between">
          <UIRowLayout>
            <Component
              :is="props.icon"
              v-if="props.icon !== null"
              class="
                size-3.5 text-tertiary
                group-data-disabled/dropdown-menu-sub-trigger:text-disabled
              "
            />

            <UIText
              :text="props.label"
              class="
                flex text-sm text-secondary
                group-data-disabled/dropdown-menu-sub-trigger:text-disabled
              "
            />
          </UIRowLayout>

          <ChevronRightIcon
            class="
              size-3.5 text-tertiary
              group-data-disabled/dropdown-menu-sub-trigger:text-disabled
            "
          />
        </UIRowLayout>
      </div>
    </UIActionTooltip>
  </RekaDropdownMenuSubTrigger>
</template>
