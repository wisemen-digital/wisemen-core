<script setup lang="ts" generic="TValue extends AcceptableValue">
import type { AcceptableValue } from 'reka-ui'
import { RadioGroupRoot as RekaRadioGroupRoot } from 'reka-ui'
import {
  computed,
  ref,
} from 'vue'

import type { RadioGroupEmits } from '@/components/radio-group/radioGroup.emits'
import type { RadioGroupProps } from '@/components/radio-group/radioGroup.props'
import InteractableElement from '@/components/shared/InteractableElement.vue'
import TestIdProvider from '@/components/shared/TestIdProvider.vue'
import { useFocusOut } from '@/composables/focus-out/focusOut.composable'

const props = withDefaults(defineProps<RadioGroupProps>(), {
  id: null,
  testId: null,
  isDisabled: false,
  isRequired: false,
  isTouched: false,
  errorMessage: null,
  hint: null,
  label: null,
})

const emit = defineEmits<RadioGroupEmits>()

const modelValue = defineModel<TValue>({
  required: true,
})

const radioGroupRootRef = ref<InstanceType<typeof RekaRadioGroupRoot> | null>(null)

useFocusOut(
  computed<HTMLElement | null>(() => radioGroupRootRef.value?.$el ?? null),
  () => {
    emit('blur')
  },
)
</script>

<template>
  <TestIdProvider :test-id="props.testId">
    <InteractableElement :is-disabled="props.isDisabled">
      <RekaRadioGroupRoot
        :id="props.id"
        ref="radioGroupRootRef"
        v-model="modelValue"
        :aria-invalid="props.errorMessage !== null"
      >
        <slot />
      </RekaRadioGroupRoot>
    </InteractableElement>
  </TestIdProvider>
</template>
