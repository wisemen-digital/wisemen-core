<script setup lang="ts">
import type { AcceptableInputValue } from 'reka-ui'
import { RadioGroupItem as RekaRadioGroupItem } from 'reka-ui'
import { computed } from 'vue'

import ColumnLayout from '@/ui/column-layout/ColumnLayout.vue'
import { useProvideRadioGroupItemContext } from '@/ui/radio-group/base/baseRadioGroup.context'
import type { BaseRadioGroupStyle } from '@/ui/radio-group/base/baseRadioGroup.style'
import { createBaseRadioGroupStyle } from '@/ui/radio-group/base/baseRadioGroup.style'
import RadioGroupIndicator from '@/ui/radio-group/RadioGroupIndicator.vue'
import RowLayout from '@/ui/row-layout/RowLayout.vue'
import { UIText } from '@/ui/text/index'

const props = withDefaults(defineProps<{
  isDisabled?: boolean
  description?: string | null
  label: string
  value: AcceptableInputValue
}>(), {
  isDisabled: false,
  description: null,
})

const emit = defineEmits<{
  blur: []
  focus: []
}>()

const radioGroupStyle = computed<BaseRadioGroupStyle>(() => createBaseRadioGroupStyle())

useProvideRadioGroupItemContext({
  radioGroupStyle,
})
</script>

<template>
  <RekaRadioGroupItem
    :disabled="props.isDisabled"
    :value="props.value"
    :class="radioGroupStyle.cardRoot()"
    @blur="emit('blur')"
    @focus="emit('focus')"
  >
    <RowLayout
      align="start"
      class="w-full"
    >
      <div :class="radioGroupStyle.control()">
        <RadioGroupIndicator />
      </div>

      <ColumnLayout gap="none">
        <UIText
          :text="props.label"
          :class="radioGroupStyle.label()"
        />

        <UIText
          v-if="props.description"
          :text="props.description"
          :class="radioGroupStyle.description()"
        />
      </ColumnLayout>
    </RowLayout>
  </RekaRadioGroupItem>
</template>
