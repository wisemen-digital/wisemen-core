<script setup lang="ts">
import type { AcceptableInputValue } from 'reka-ui'
import {
  onBeforeUnmount,
  onMounted,
  useId,
} from 'vue'

import type { DisabledWithReason } from '@/types/disabledWithReason.type'
import BaseCheckbox from '@/ui/checkbox/base/BaseCheckbox.vue'
import { useInjectCheckboxGroupContext } from '@/ui/checkbox-group/checkboxGroup.context'

const props = defineProps<{
  isLabelHidden?: boolean
  label?: string
  value: AcceptableInputValue
} & DisabledWithReason>()

const id = useId()

const {
  registerCheckbox, unRegisterCheckbox,
} = useInjectCheckboxGroupContext()

onMounted(() => {
  registerCheckbox(id, props.value)
})

onBeforeUnmount(() => {
  unRegisterCheckbox(id)
})
</script>

<template>
  <BaseCheckbox
    :value="props.value"
    :label="props.label"
    :is-label-hidden="props.isLabelHidden"
    :is-disabled="props.isDisabled"
    :disabled-reason="props.disabledReason"
  />
</template>
