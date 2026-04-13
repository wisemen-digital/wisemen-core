<script setup lang="ts">
import { DateRangeFieldInput as RekaRangeDateFieldInput } from 'reka-ui'

import { mergeClasses } from '@/class-variant/customClassVariants'
import { useInjectDateRangeFieldContext } from '@/components/date-range-field/dateRangeField.context'
import type { DateRangeFieldSegment } from '@/components/date-range-field/dateRangeField.type'
import TestIdProvider from '@/components/shared/TestIdProvider.vue'

const props = defineProps<{
  segments: DateRangeFieldSegment
}>()

const {
  testId,
  classConfig,
  customClassConfig,
  style,
  onBlur,
  onFocus,
} = useInjectDateRangeFieldContext()
</script>

<template>
  <TestIdProvider :test-id="testId">
    <div
      :class="style.inputs({
        class: mergeClasses(customClassConfig.inputs, classConfig?.inputs),
      })"
    >
      <template
        v-for="item in props.segments.start"
        :key="item.part"
      >
        <RekaRangeDateFieldInput
          v-if="item.part === 'literal'"
          :part="item.part"
          :class="style.input({
            class: mergeClasses(customClassConfig.input, classConfig?.input),
          })"
          type="start"
        >
          {{ item.value }}
        </RekaRangeDateFieldInput>

        <RekaRangeDateFieldInput
          v-else
          :part="item.part"
          :class="style.input({
            class: mergeClasses(customClassConfig.input, classConfig?.input),
          })"
          type="start"
          @focus="onFocus"
          @blur="onBlur"
        >
          {{ item.value }}
        </RekaRangeDateFieldInput>
      </template>

      <span
        :class="style.separator({
          class: mergeClasses(customClassConfig.separator, classConfig?.separator),
        })"
      >
        -
      </span>

      <template
        v-for="item in props.segments.end"
        :key="item.part"
      >
        <RekaRangeDateFieldInput
          v-if="item.part === 'literal'"
          :part="item.part"
          :class="style.input({
            class: mergeClasses(customClassConfig.input, classConfig?.input),
          })"
          type="end"
        >
          {{ item.value }}
        </RekaRangeDateFieldInput>

        <RekaRangeDateFieldInput
          v-else
          :part="item.part"
          :class="style.input({
            class: mergeClasses(customClassConfig.input, classConfig?.input),
          })"
          type="end"
          @focus="onFocus"
          @blur="onBlur"
        >
          {{ item.value }}
        </RekaRangeDateFieldInput>
      </template>
    </div>
  </TestIdProvider>
</template>
