<script setup lang="ts">
import { mergeClasses } from '@/class-variant/customClassVariants'
import { useInjectFormFieldContext } from '@/components/form-field/formField.context'
import type { FormFieldLabelSlots } from '@/components/form-field/formField.slots'

defineSlots<FormFieldLabelSlots>()

const {
  isRequired,
  classConfig,
  customClassConfig,
  for: forId,
  label,
  style,
} = useInjectFormFieldContext()
</script>

<template>
  <div
    v-if="label !== null"
    :class="style.labelContainer({
      class: mergeClasses(customClassConfig.labelContainer, classConfig?.labelContainer),
    })"
  >
    <div class="flex items-center">
      <slot name="leading" />

      <label
        :class="style.label({
          class: mergeClasses(customClassConfig.label, classConfig?.label),
        })"
        :for="forId"
      >
        {{ label }}
        <span
          v-if="isRequired"
          :class="style.asterisk({
            class: mergeClasses(customClassConfig.asterisk, classConfig?.asterisk),
          })"
        >*</span>
      </label>

      <slot name="trailing" />
    </div>

    <slot name="right" />
  </div>
</template>
