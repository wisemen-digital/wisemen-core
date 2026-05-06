<script setup lang="ts">
import { CheckIcon } from '@wisemen/vue-core-icons'
import type { AcceptableValue } from 'reka-ui'
import {
  ListboxItem as RekaListboxItem,
  ListboxItemIndicator as RekaListboxItemIndicator,
} from 'reka-ui'

import { useIsUsingKeyboard } from '@/composables/isUsingKeyboard.composable'
import { UIMenuItem } from '@/ui/menu-item'
import { useInjectSelectContext } from '@/ui/select/select.context'

const props = withDefaults(defineProps<{
  label?: string | null
  value: AcceptableValue
}>(), {
  label: null,
})

const {
  getItemConfig,
  size,
  onSelectOption,
} = useInjectSelectContext()

const isUsingKeyboard = useIsUsingKeyboard()
</script>

<template>
  <RekaListboxItem
    :value="props.value"

    :class="{
      'data-highlighted:bg-secondary-hover': isUsingKeyboard,
      'hover:bg-secondary-hover': !isUsingKeyboard,
    }"
    class="
      group/listbox-item flex w-full cursor-default items-center rounded-sm
      outline-none
    "
    @select="onSelectOption"
  >
    <UIMenuItem
      :config="getItemConfig?.(props.value) ?? null"
      :label="props.label"
      :size="size"
    >
      <template #right>
        <RekaListboxItemIndicator>
          <Component
            :is="CheckIcon"
            class="size-3.5 text-tertiary"
          />
        </RekaListboxItemIndicator>
      </template>
    </UIMenuItem>
  </RekaListboxItem>
</template>
