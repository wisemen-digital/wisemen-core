<script setup lang="ts" generic="TValue extends AcceptableValue">
import type { AcceptableValue } from 'reka-ui'
import { RadioGroupRoot as RekaRadioGroupRoot } from 'reka-ui'

import { useInjectRadioGroupContext } from '@/ui/radio-group/radioGroup.context'

const {
  isDisabled,
  modelValue,
  orientation,
} = useInjectRadioGroupContext()
</script>

<template>
  <RekaRadioGroupRoot
    v-model="modelValue"
    :orientation="orientation"
    :disabled="isDisabled"
  >
    <slot />
  </RekaRadioGroupRoot>
</template>
