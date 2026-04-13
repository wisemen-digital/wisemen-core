<script setup lang="ts">
import {
  AnimatePresence,
  Motion,
} from 'motion-v'

import { mergeClasses } from '@/class-variant/customClassVariants'
import { useInjectFormFieldContext } from '@/components/form-field/formField.context'
import type { FormFieldLabelSlots } from '@/components/form-field/formField.slots'
import Icon from '@/components/icon/Icon.vue'

defineSlots<FormFieldLabelSlots>()

const {
  isTouched,
  classConfig,
  customClassConfig,
  errorMessage,
  for: forId,
  style,
} = useInjectFormFieldContext()
</script>

<template>
  <AnimatePresence :initial="false">
    <Motion
      v-if="errorMessage !== null && isTouched"
      :initial="{
        height: 0,
        opacity: 0,
        filter: 'blur(4px)',
      }"
      :animate="{
        height: 'auto',
        opacity: 1,
        filter: 'blur(0)',
      }"
      :exit="{
        height: 0,
        opacity: 0,
        filter: 'blur(4px)',
      }"
    >
      <div>
        <div
          :class="style.error({
            class: mergeClasses(customClassConfig.error, classConfig?.error),
          })"
        >
          <Icon
            :class="style.errorIcon({
              class: mergeClasses(customClassConfig.errorIcon, classConfig?.errorIcon),
            })"
            icon="alertTriangle"
          />

          <span
            :id="`${forId}-error`"
            aria-live="assertive"
            role="alert"
          >
            {{ errorMessage }}
          </span>
        </div>
      </div>
    </Motion>
  </AnimatePresence>
</template>
