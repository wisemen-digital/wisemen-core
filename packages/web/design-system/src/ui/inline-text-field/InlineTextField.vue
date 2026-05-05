<script setup lang="ts">
import {
  computed,
  useAttrs,
  useId,
  useTemplateRef,
} from 'vue'

import { useInlineInput } from '@/composables/input.composable'
import {
  AUTOCOMPLETE_INPUT_DEFAULTS,
  INLINE_FIELD_DEFAULTS,
  INPUT_DEFAULTS,
  INPUT_FIELD_DEFAULTS,
} from '@/types/input.type'
import InlineFieldWrapper from '@/ui/inline-field-wrapper/InlineFieldWrapper.vue'
import type { InlineTextFieldProps } from '@/ui/inline-text-field/inlineTextField.props'
import type { InlineTextFieldStyle } from '@/ui/inline-text-field/inlineTextField.style'
import { createInlineTextFieldStyle } from '@/ui/inline-text-field/inlineTextField.style'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<InlineTextFieldProps>(), {
  ...INPUT_DEFAULTS,
  ...INPUT_FIELD_DEFAULTS,
  ...AUTOCOMPLETE_INPUT_DEFAULTS,
  ...INLINE_FIELD_DEFAULTS,
  size: 'md',
  type: 'text',
})

const modelValue = defineModel<string | null>({
  required: true,
})

const inlineTextFieldStyle = computed<InlineTextFieldStyle>(() => createInlineTextFieldStyle({
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
} = useInlineInput(id, props)

defineExpose({
  input: inputRef,
})
</script>

<template>
  <InlineFieldWrapper
    :id="id"
    :is-error="isError"
    :is-disabled="props.isDisabled"
    :is-readonly="props.isReadonly"
    :is-loading="props.isLoading"
    :error-message="props.errorMessage"
    :label="props.label"
    :variant="props.variant"
    :icon-left="props.iconLeft"
    :icon-right="props.iconRight"
    :class="props.class"
    :style="props.style"
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
      :aria-invalid="ariaInvalid"
      :aria-required="ariaRequired"
      :aria-busy="ariaBusy"
      :autocomplete="props.autocomplete ?? undefined"
      :disabled="props.isDisabled"
      :name="props.name ?? undefined"
      :placeholder="props.placeholder ?? undefined"
      :readonly="props.isReadonly"
      :type="props.type"
      :class="inlineTextFieldStyle.input()"
      data-field-wrapper
      @input="(event) => modelValue = (event.target as HTMLInputElement).value"
    >
  </InlineFieldWrapper>
</template>
