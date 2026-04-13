<script setup lang="ts">
import { NumberFieldInput as RekaNumberFieldInput } from 'reka-ui'

import { mergeClasses } from '@/class-variant/customClassVariants'
import { useInjectNumberFieldContext } from '@/components/number-field/numberField.context'
import FormControl from '@/components/shared/FormControl.vue'
import TestIdProvider from '@/components/shared/TestIdProvider.vue'

const {
  id,
  testId,
  isDisabled,
  isLoading,
  isRequired,
  autocomplete,
  classConfig,
  customClassConfig,
  errorMessage,
  placeholder,
  style,
  onBlur,
  onFocus,
} = useInjectNumberFieldContext()
</script>

<template>
  <TestIdProvider :test-id="testId">
    <FormControl
      :id="id"
      :is-disabled="isDisabled"
      :is-loading="isLoading"
      :is-invalid="errorMessage !== null"
      :described-by="`${id}-error ${id}-hint`"
      :is-required="isRequired"
    >
      <RekaNumberFieldInput
        :class="style.input({
          class: mergeClasses(customClassConfig.input, classConfig?.input),
        })"
        :autocomplete="autocomplete"
        :placeholder="placeholder"
        @focus="onFocus"
        @blur="onBlur"
      />
    </FormControl>
  </TestIdProvider>
</template>
