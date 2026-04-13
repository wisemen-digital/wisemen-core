<script setup lang="ts">
import { CheckboxGroupRoot as RekaCheckboxGroupRoot } from 'reka-ui'
import { computed } from 'vue'

import BaseCheckbox from '@/ui/checkbox/base/BaseCheckbox.vue'
import { useInjectCheckboxGroupContext } from '@/ui/checkbox-group/checkboxGroup.context'

const props = withDefaults(defineProps<{
  label?: string | null
}>(), {
  label: null,
})

const {
  isDisabled,
  isIndeterminate,
  modelValue,
  toggleAll,
} = useInjectCheckboxGroupContext()

const isAtLeastOneChecked = computed<boolean>(() => {
  return modelValue.value.length > 0
})

const value = computed<string[]>({
  get: () => isAtLeastOneChecked.value
    ? [
        'indeterminate',
      ]
    : [],
  set: toggleAll,
})
</script>

<template>
  <RekaCheckboxGroupRoot v-model="value">
    <BaseCheckbox
      :is-disabled="isDisabled"
      :is-indeterminate="isIndeterminate"
      :label="props.label"
      value="indeterminate"
      @update:model-value="toggleAll"
    />
  </RekaCheckboxGroupRoot>
</template>
