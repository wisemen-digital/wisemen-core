<script setup lang="ts">
import { TimeFieldInput as RekaTimeFieldInput } from 'reka-ui'

import { mergeClasses } from '@/class-variant/customClassVariants'
import type { DateFieldSegment } from '@/components/date-field/dateField.type'
import { useInjectTimeFieldContext } from '@/components/time-field/timeField.context'

const props = defineProps<{
  segments: DateFieldSegment[]
}>()

const {
  classConfig,
  customClassConfig,
  style,
  onBlur,
  onFocus,
} = useInjectTimeFieldContext()
</script>

<template>
  <div
    :class="style.inputs({
      class: mergeClasses(customClassConfig.inputs, classConfig?.inputs),
    })"
  >
    <template
      v-for="item in props.segments"
      :key="item.part"
    >
      <RekaTimeFieldInput
        v-if="item.part === 'literal'"
        :part="item.part"
        :class="style.input({
          class: mergeClasses(customClassConfig.input, classConfig?.input),
        })"
      >
        {{ item.value }}
      </RekaTimeFieldInput>

      <RekaTimeFieldInput
        v-else
        :part="item.part"
        :class="style.input({
          class: mergeClasses(customClassConfig.input, classConfig?.input),
        })"
        @focus="onFocus"
        @blur="onBlur"
      >
        {{ item.value }}
      </RekaTimeFieldInput>
    </template>
  </div>
</template>
