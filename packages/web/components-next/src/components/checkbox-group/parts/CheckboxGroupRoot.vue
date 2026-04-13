<script setup lang="ts" generic="TValue extends AcceptableValue">
import type { AcceptableValue } from 'reka-ui'
import { CheckboxGroupRoot as RekaCheckboxGroupRoot } from 'reka-ui'
import {
  computed,
  ref,
} from 'vue'

import type { CheckboxGroupEmits } from '@/components/checkbox-group/checkboxGroup.emits'
import type { CheckboxGroupProps } from '@/components/checkbox-group/checkboxGroup.props'
import InteractableElement from '@/components/shared/InteractableElement.vue'
import TestIdProvider from '@/components/shared/TestIdProvider.vue'
import { useFocusOut } from '@/composables/focus-out/focusOut.composable'

const props = withDefaults(defineProps<CheckboxGroupProps>(), {
  id: null,
  testId: null,
  isDisabled: false,
  isRequired: false,
  isTouched: false,
  errorMessage: null,
  hint: null,
  label: null,
})

const emit = defineEmits<CheckboxGroupEmits>()

const modelValue = defineModel<TValue[]>({
  required: true,
})

const checkboxGroupRootRef = ref<InstanceType<any> | null>(null)

useFocusOut(
  computed<HTMLElement | null>(() => checkboxGroupRootRef.value?.$el ?? null),
  () => {
    emit('blur')
  },
)
</script>

<template>
  <TestIdProvider :test-id="props.testId">
    <InteractableElement :is-disabled="props.isDisabled">
      <RekaCheckboxGroupRoot
        ref="checkboxGroupRootRef"
        v-bind="props"
        v-model="modelValue"
      >
        <slot />
      </RekaCheckboxGroupRoot>
    </InteractableElement>
  </TestIdProvider>
</template>
