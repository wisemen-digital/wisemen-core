<script setup lang="ts">
import { CheckIcon } from '@wisemen/vue-core-icons'
import type { AcceptableValue } from 'reka-ui'
import {
  ListboxItem as RekaListboxItem,
  ListboxItemIndicator as RekaListboxItemIndicator,
} from 'reka-ui'
import { computed } from 'vue'

import { useIsUsingKeyboard } from '@/composables/isUsingKeyboard.composable'
import { UIRowLayout } from '@/ui/row-layout'
import { useInjectSelectContext } from '@/ui/select/select.context'
import { UIText } from '@/ui/text'

const props = withDefaults(defineProps<{
  label?: string | null
  value: AcceptableValue
}>(), {
  label: null,
})

const {
  size, onSelectOption,
} = useInjectSelectContext({
  size: computed<'md'>(() => 'md'),
  onSelectOption: () => {},
})

const isUsingKeyboard = useIsUsingKeyboard()
</script>

<template>
  <RekaListboxItem
    :value="props.value"
    :class="{
      'data-highlighted:bg-secondary-hover': isUsingKeyboard,
      'hover:bg-secondary-hover': !isUsingKeyboard,
      'min-h-8 p-sm': size === 'md',
      'min-h-7 px-sm py-xs': size === 'sm',
    }"
    class="
      group/listbox-item flex w-full cursor-default items-center rounded-sm
      outline-none
    "
    @select="onSelectOption"
  >
    <UIRowLayout
      justify="between"
      class="w-full"
    >
      <slot>
        <UIText
          v-if="props.label !== null"
          :text="props.label"
          :class="{
            'text-xs': size === 'sm',
            'text-sm': size === 'md',
          }"
          class="text-secondary select-none"
        />
      </slot>

      <RekaListboxItemIndicator>
        <Component
          :is="CheckIcon"
          class="size-3.5 text-tertiary"
        />
      </RekaListboxItemIndicator>
    </UIRowLayout>
  </RekaListboxItem>
</template>
