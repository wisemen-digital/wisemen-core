<script setup lang="ts">
import { computed } from 'vue'

import { mergeClasses } from '@/class-variant/customClassVariants'
import { useInjectFormFieldContext } from '@/components/form-field/formField.context'
import type { FormFieldLabelSlots } from '@/components/form-field/formField.slots'

defineSlots<FormFieldLabelSlots>()

const {
  isTouched,
  classConfig,
  customClassConfig,
  errorMessage,
  for: forId,
  hint,
  style,
} = useInjectFormFieldContext()

const isErrorVisible = computed<boolean>(() => isTouched.value && errorMessage.value !== null)
</script>

<template>
  <div>
    <span
      v-if="hint !== null && !isErrorVisible"
      :id="`${forId}-hint`"
      :class="style.hint({
        class: mergeClasses(customClassConfig.hint, classConfig?.hint),
      })"
      role="alert"
    >
      {{ hint }}
    </span>
  </div>
</template>
