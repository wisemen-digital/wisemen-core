<script setup lang="ts">
import {
  computed,
  useAttrs,
  useId,
  useTemplateRef,
} from 'vue'

import { useInput } from '@/composables/input.composable'
import {
  AUTOCOMPLETE_INPUT_DEFAULTS,
  INPUT_DEFAULTS,
  INPUT_FIELD_DEFAULTS,
  INPUT_META_DEFAULTS,
} from '@/types/input.type'
import FieldWrapper from '@/ui/field-wrapper/FieldWrapper.vue'
import InputWrapper from '@/ui/input-wrapper/InputWrapper.vue'
import type { TextFieldProps } from '@/ui/text-field/textField.props'
import type { TextFieldStyle } from '@/ui/text-field/textField.style'
import { createTextFieldStyle } from '@/ui/text-field/textField.style'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<TextFieldProps>(), {
  ...INPUT_DEFAULTS,
  ...INPUT_META_DEFAULTS,
  ...INPUT_FIELD_DEFAULTS,
  ...AUTOCOMPLETE_INPUT_DEFAULTS,
  size: 'md',
  type: 'text',
})

const modelValue = defineModel<string | null>({
  required: true,
})

const textFieldStyle = computed<TextFieldStyle>(() => createTextFieldStyle({
  size: props.size,
}))

const inputRef = useTemplateRef('input')

const attrs = useAttrs()

const id = props.id ?? useId()

const {
  isError,
  ariaBusy,
  ariaDescribedBy,
  ariaInvalid,
  ariaRequired,
} = useInput(id, props)

defineExpose({
  input: inputRef,
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
    :class="props.class"
    :style="props.style"
    :for="id"
    :help-text="props.helpText"
    :hide-error-message="props.hideErrorMessage"
  >
    <template #label-left>
      <slot name="label-left" />
    </template>

    <template #label-right>
      <slot name="label-right" />
    </template>

    <FieldWrapper
      :icon-left="props.iconLeft"
      :icon-right="props.iconRight"
      :is-loading="props.isLoading"
      :is-error="isError"
      :is-disabled="props.isDisabled"
      :is-readonly="props.isReadonly"
      :size="props.size"
    >
      <template #left>
        <slot name="left" />
      </template>

      <template #right>
        <slot name="right" />
      </template>

      <input
        v-bind="attrs"
        :id="id"
        ref="input"
        :value="modelValue"
        :aria-describedby="ariaDescribedBy"
        :autocomplete="props.autocomplete ?? undefined"
        :name="props.name ?? undefined"
        :type="props.type"
        :aria-required="ariaRequired"
        :readonly="props.isReadonly"
        :aria-busy="ariaBusy"
        :aria-invalid="ariaInvalid"
        :disabled="props.isDisabled"
        :placeholder="props.placeholder ?? undefined"
        :class="textFieldStyle.input()"
        data-field-wrapper
        @input="(event) => modelValue = (event.target as HTMLInputElement).value"
      >
    </FieldWrapper>
  </InputWrapper>
</template>
