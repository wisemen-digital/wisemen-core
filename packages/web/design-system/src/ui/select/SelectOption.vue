<script setup lang="ts">
import { CheckIcon } from '@wisemen/vue-core-icons'
import type { AcceptableValue } from 'reka-ui'
import {
  ListboxItem as RekaListboxItem,
  ListboxItemIndicator as RekaListboxItemIndicator,
} from 'reka-ui'

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
</script>

<template>
  <RekaListboxItem
    :value="props.value"
    class="
      group/listbox-item relative z-2 flex w-full cursor-default items-center
      rounded-sm outline-none
      hover:bg-secondary-hover
      data-highlighted:bg-secondary-hover
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
