<script setup lang="ts">
import { ref } from 'vue'

import type { SwitchProps } from '@/ui/switch/switch.props'
import Switch from '@/ui/switch/Switch.vue'

const props = withDefaults(defineProps<{
  isDisabled?: boolean
  isRequired?: boolean
  errorMessage?: SwitchProps['errorMessage']
  hint?: SwitchProps['hint']
  label?: string
}>(), {
  isDisabled: false,
  isRequired: false,
  errorMessage: undefined,
  hint: undefined,
  label: 'Switch Label',
})

const modelValue = ref<boolean>(false)
</script>

<template>
  <div>
    <Switch
      v-model="modelValue"
      :error-message="props.errorMessage"
      :hint="props.hint"
      :is-disabled="props.isDisabled"
      :is-required="props.isRequired"
      :label="props.label"
    />
  </div>
</template>
