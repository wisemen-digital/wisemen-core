<script setup lang="ts" generic="TValue extends AcceptableValue">
import type { AcceptableValue } from 'reka-ui'
import { CheckboxGroupRoot as RekaCheckboxGroupRoot } from 'reka-ui'
import type { Ref } from 'vue'
import {
  computed,
  ref,
} from 'vue'

import ActionTooltip from '@/ui/action-tooltip/ActionTooltip.vue'
import { useProvideCheckboxGroupContext } from '@/ui/checkbox-group/checkboxGroup.context'
import type { CheckboxGroupProps } from '@/ui/checkbox-group/checkboxGroup.props'

const props = withDefaults(defineProps<CheckboxGroupProps>(), {
  isDisabled: false,
  disabledReason: null,
  orientation: 'vertical',
})
const modelValue = defineModel<TValue[]>({
  required: true,
})

const registeredCheckboxes = ref<Map<string, TValue>>(new Map()) as Ref<Map<string, TValue>>

const isAllChecked = computed<boolean>(() => {
  return modelValue.value.length === registeredCheckboxes.value.size
})

const isIndeterminate = computed<boolean>(() => {
  const checkedCount = modelValue.value.length
  const totalCount = registeredCheckboxes.value.size

  return checkedCount > 0 && checkedCount < totalCount
})

function toggleAll(): void {
  if (isAllChecked.value) {
    modelValue.value = []

    return
  }

  modelValue.value = [
    ...registeredCheckboxes.value.values(),
  ] as TValue[]
}

function registerCheckbox(id: string, value: AcceptableValue): void {
  registeredCheckboxes.value.set(id, value as TValue)
}

function unRegisterCheckbox(id: string): void {
  registeredCheckboxes.value.delete(id)
}

useProvideCheckboxGroupContext({
  isDisabled: computed<boolean>(() => props.isDisabled),
  isIndeterminate,
  modelValue,
  orientation: computed<'horizontal' | 'vertical'>(() => props.orientation),
  registerCheckbox,
  toggleAll,
  unRegisterCheckbox,
})
</script>

<template>
  <ActionTooltip
    :is-disabled="!props.isDisabled || props.disabledReason == null"
    :label="props.disabledReason"
  >
    <RekaCheckboxGroupRoot v-model="modelValue">
      <slot />
    </RekaCheckboxGroupRoot>
  </ActionTooltip>
</template>
