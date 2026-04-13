<script setup lang="ts" generic="TValue extends AcceptableValue">
import type { AcceptableValue } from 'reka-ui'
import { RadioGroupRoot as RekaRadioGroupRoot } from 'reka-ui'
import { computed } from 'vue'

import ActionTooltip from '@/ui/action-tooltip/ActionTooltip.vue'
import { useProvideRadioGroupContext } from '@/ui/radio-group/radioGroup.context'
import type { RadioGroupProps } from '@/ui/radio-group/radioGroup.props'

const props = withDefaults(defineProps<RadioGroupProps>(), {
  isDisabled: false,
  disabledReason: null,
  hideErrorMessage: false,
  orientation: 'vertical',
})

const modelValue = defineModel<TValue>({
  required: true,
})

useProvideRadioGroupContext({
  isDisabled: computed<boolean>(() => props.isDisabled),
  modelValue,
  orientation: computed<'horizontal' | 'vertical'>(() => props.orientation),
})
</script>

<template>
  <ActionTooltip
    :is-disabled="!props.isDisabled || props.disabledReason == null"
    :label="props.disabledReason"
  >
    <RekaRadioGroupRoot
      v-model="modelValue"
      :orientation="props.orientation"
      :disabled="props.isDisabled"
    >
      <slot />
    </RekaRadioGroupRoot>
  </ActionTooltip>
</template>
