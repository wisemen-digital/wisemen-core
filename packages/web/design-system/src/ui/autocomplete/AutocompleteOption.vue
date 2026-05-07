<script setup lang="ts">
import { CheckIcon } from '@wisemen/vue-core-icons'
import type { AcceptableValue } from 'reka-ui'
import {
  ComboboxItem as RekaComboboxItem,
  ComboboxItemIndicator as RekaComboboxItemIndicator,
} from 'reka-ui'

import { useInjectAutocompleteContext } from '@/ui/autocomplete/autocomplete.context'
import { UIMenuItem } from '@/ui/menu-item'

const props = withDefaults(defineProps<{
  label?: string | null
  value: AcceptableValue
}>(), {
  label: null,
})

const {
  getItemConfig, size,
} = useInjectAutocompleteContext()
</script>

<template>
  <RekaComboboxItem
    :value="props.value"
    class="
      group/combobox-item relative z-2 flex w-full cursor-default items-center
      rounded-sm outline-none
      hover:bg-secondary-hover
      data-highlighted:bg-secondary-hover
    "
  >
    <UIMenuItem
      :config="getItemConfig?.(props.value) ?? null"
      :label="props.label"
      :size="size"
    >
      <template #right>
        <RekaComboboxItemIndicator>
          <CheckIcon
            class="size-3.5 text-tertiary"
          />
        </RekaComboboxItemIndicator>
      </template>
    </UIMenuItem>
  </RekaComboboxItem>
</template>
