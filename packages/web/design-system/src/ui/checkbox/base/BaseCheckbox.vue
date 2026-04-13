<script setup lang="ts">
import { CheckboxRoot as RekaCheckboxRoot } from 'reka-ui'
import {
  computed,
  useId,
} from 'vue'

import { useProvideCheckboxContext } from '@/ui/checkbox/base/baseCheckbox.context'
import type { BaseCheckboxProps } from '@/ui/checkbox/base/baseCheckbox.props'
import type { BaseCheckboxStyle } from '@/ui/checkbox/base/baseCheckbox.style'
import { createBaseCheckboxStyle } from '@/ui/checkbox/base/baseCheckbox.style'
import CheckboxIndicator from '@/ui/checkbox/CheckboxIndicator.vue'
import InputWrapper from '@/ui/input-wrapper/InputWrapper.vue'

const props = withDefaults(defineProps<BaseCheckboxProps>(), {
  isIndeterminate: false,
  hideErrorMessage: false,
})

const emit = defineEmits<{
  blur: []
}>()

const modelValue = defineModel<boolean>({
  required: false,
})

const id = props.id ?? useId()

const checkboxStyle = computed<BaseCheckboxStyle>(() => createBaseCheckboxStyle())

const delegatedModel = computed<boolean | 'indeterminate' | null>({
  get() {
    if (modelValue.value === null) {
      return null
    }

    if (modelValue.value) {
      return true
    }

    if (props.isIndeterminate) {
      return 'indeterminate'
    }

    return false
  },
  set(value) {
    if (value === null) {
      return
    }

    modelValue.value = value === 'indeterminate' ? false : value
  },
})

useProvideCheckboxContext({
  isIndeterminate: computed<boolean>(() => props.isIndeterminate),
  checkboxStyle,
})
</script>

<template>
  <InputWrapper
    :error-message="props.errorMessage"
    :is-disabled="props.isDisabled"
    :is-required="props.isRequired"
    :disabled-reason="props.disabledReason"
    :hint="props.hint"
    :label="props.label"
    :is-horizontal="true"
    :class="props.class"
    :style="props.style"
    :for="id"
    :help-text="props.helpText"
    :hide-error-message="props.hideErrorMessage"
    :is-label-hidden="props.isLabelHidden"
  >
    <RekaCheckboxRoot
      :id="id"
      v-model="delegatedModel"
      :disabled="props.isDisabled"
      :class="checkboxStyle.root()"
      :value="props.value"
      @blur="emit('blur')"
    >
      <div
        :class="checkboxStyle.control()"
      >
        <CheckboxIndicator />
      </div>
    </RekaCheckboxRoot>
  </InputWrapper>
</template>
