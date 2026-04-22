<script setup lang="ts">
import { CheckIcon } from '@wisemen/vue-core-icons'
import type { AcceptableValue } from 'reka-ui'
import {
  ComboboxItem as RekaComboboxItem,
  ComboboxItemIndicator as RekaComboboxItemIndicator,
} from 'reka-ui'

import { useIsUsingKeyboard } from '@/composables/isUsingKeyboard.composable'
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

const isUsingKeyboard = useIsUsingKeyboard()
</script>

<template>
  <RekaComboboxItem
    :value="props.value"
    :class="{
      'data-highlighted:bg-secondary-hover': isUsingKeyboard,
      'hover:bg-secondary-hover': !isUsingKeyboard,
    }"
    class="
      group/combobox-item flex w-full cursor-default items-center rounded-sm
      outline-none
    "
  >
    <UIMenuItem
      :config="getItemConfig?.(props.value) ?? null"
      :label="props.label"
      :size="size"
    >
      <template #right>
        <RekaComboboxItemIndicator>
          <Component
            :is="CheckIcon"
            class="size-3.5 text-tertiary"
          />
        </RekaComboboxItemIndicator>
      </template>
    </UIMenuItem>
  </RekaComboboxItem>
</template>
