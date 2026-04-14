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
  size?: SwitchProps['size']
}>(), {
  isDisabled: false,
  isRequired: false,
  errorMessage: undefined,
  hint: undefined,
  label: 'Switch Label',
  size: 'md',
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
      :size="props.size"
    />
  </div>
</template>
