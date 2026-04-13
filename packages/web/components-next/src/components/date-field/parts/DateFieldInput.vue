<script setup lang="ts">
import { DateFieldInput as RekaDateFieldInput } from 'reka-ui'

import { mergeClasses } from '@/class-variant/customClassVariants'
import { useInjectDateFieldContext } from '@/components/date-field/dateField.context'
import type { DateFieldSegment } from '@/components/date-field/dateField.type'
import TestIdProvider from '@/components/shared/TestIdProvider.vue'

const props = defineProps<{
  segments: DateFieldSegment[]
}>()

const {
  testId,
  classConfig,
  customClassConfig,
  style,
  onBlur,
  onFocus,
} = useInjectDateFieldContext()
</script>

<template>
  <TestIdProvider :test-id="testId">
    <div
      :class="style.inputs({
        class: mergeClasses(customClassConfig.inputs, classConfig?.inputs),
      })"
    >
      <template
        v-for="item in props.segments"
        :key="item.part"
      >
        <RekaDateFieldInput
          v-if="item.part === 'literal'"
          :part="item.part"
          :class="style.input({
            class: mergeClasses(customClassConfig.input, classConfig?.input),
          })"
        >
          {{ item.value }}
        </RekaDateFieldInput>

        <RekaDateFieldInput
          v-else
          :part="item.part"
          :class="style.input({
            class: mergeClasses(customClassConfig.input, classConfig?.input),
          })"
          @focus="onFocus"
          @blur="onBlur"
        >
          {{ item.value }}
        </RekaDateFieldInput>
      </template>
    </div>
  </TestIdProvider>
</template>
