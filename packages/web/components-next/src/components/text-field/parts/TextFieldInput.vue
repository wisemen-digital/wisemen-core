<script setup lang="ts">
import { mergeClasses } from '@/class-variant/customClassVariants'
import FormControl from '@/components/shared/FormControl.vue'
import TestIdProvider from '@/components/shared/TestIdProvider.vue'
import { useInjectTextFieldContext } from '@/components/text-field/textField.context'

const {
  id,
  testId,
  isDisabled,
  isLoading,
  isRequired,
  isSpellCheckEnabled,
  autocomplete,
  classConfig,
  customClassConfig,
  errorMessage,
  modelValue,
  placeholder,
  style,
  type,
  onBlur,
  onFocus,
} = useInjectTextFieldContext()

function onInput(event: InputEvent): void {
  modelValue.value = (event.target as HTMLInputElement).value
}
</script>

<template>
  <TestIdProvider :test-id="testId">
    <FormControl
      :id="id"
      :value="modelValue"
      :is-loading="isLoading"
      :is-disabled="isDisabled"
      :is-invalid="errorMessage !== null"
      :is-required="isRequired"
      :described-by="`${id}-error ${id}-hint`"
      :class="style.input({
        class: mergeClasses(customClassConfig.input, classConfig?.input),
      })"
      :type="type"
      :autocomplete="autocomplete"
      :placeholder="placeholder"
      :spellcheck="isSpellCheckEnabled"
      @focus="onFocus"
      @blur="onBlur"
      @input="onInput"
    >
      <input>
    </FormControl>
  </TestIdProvider>
</template>
