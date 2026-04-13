<script setup lang="ts">
import { useTextareaAutosize } from '@vueuse/core'

import { mergeClasses } from '@/class-variant/customClassVariants'
import FormControl from '@/components/shared/FormControl.vue'
import TestIdProvider from '@/components/shared/TestIdProvider.vue'
import { useInjectTextareaContext } from '@/components/textarea/textarea.context'

const {
  id,
  testId,
  isDisabled,
  isRequired,
  isSpellCheckEnabled,
  autocomplete,
  classConfig,
  customClassConfig,
  errorMessage,
  modelValue,
  placeholder,
  resize,
  style,
  onBlur,
  onFocus,
} = useInjectTextareaContext()

const {
  textarea,
} = useTextareaAutosize({
  watch: () => {
    if (resize.value === 'auto-vertical') {
      return modelValue.value
    }

    return null
  },
})

function onInput(event: InputEvent): void {
  modelValue.value = (event.target as HTMLInputElement).value
}
</script>

<template>
  <TestIdProvider :test-id="testId">
    <FormControl
      :id="id"
      :value="modelValue"
      :is-disabled="isDisabled"
      :is-invalid="errorMessage !== null"
      :is-required="isRequired"
      :described-by="`${id}-error ${id}-hint`"
      :is-loading="false"
      :class="style.input({
        class: mergeClasses(customClassConfig.input, classConfig?.input),
      })"
      :autocomplete="autocomplete"
      :placeholder="placeholder"
      :spellcheck="isSpellCheckEnabled"
      @focus="onFocus"
      @blur="onBlur"
      @input="onInput"
    >
      <!-- Render two separate textareas to avoid an explicit height being set when -->
      <!-- auto-vertical is not used. -->
      <textarea
        v-if="resize === 'auto-vertical'"
        ref="textarea"
      />
      <textarea v-else />
    </FormControl>
  </TestIdProvider>
</template>

<style>
/*
 * It's recommended to reset the scrollbar styles for the textarea
 * element to avoid incorrect height values for large amounts of text.
 */
textarea {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

textarea::-webkit-scrollbar {
  display: none;
}
</style>
