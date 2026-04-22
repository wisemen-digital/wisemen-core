<script setup lang="ts">
import {
  DatePickerField as RekaDatePickerField,
  DatePickerInput as RekaDatePickerInput,
} from 'reka-ui'
import { useI18n } from 'vue-i18n'

import { UIButton } from '@/ui/button'
import { useInjectDatePickerContext } from '@/ui/date-picker/datePicker.context'

const emit = defineEmits<{
  today: []
}>()

const {
  t,
} = useI18n()

const {
  datePickerStyle, onClose,
} = useInjectDatePickerContext()
</script>

<template>
  <div :class="datePickerStyle.inputRow()">
    <RekaDatePickerField
      v-slot="{ segments }"
      :class="datePickerStyle.inputField()"
      @keydown.enter="onClose"
    >
      <template
        v-for="{ part, value } in segments"
        :key="part"
      >
        <RekaDatePickerInput
          v-if="part !== 'literal'"
          :part="part"
          :class="datePickerStyle.inputSegment()"
        >
          {{ value }}
        </RekaDatePickerInput>

        <RekaDatePickerInput
          v-else
          :part="part"
          :class="datePickerStyle.inputLiteral()"
        >
          {{ value }}
        </RekaDatePickerInput>
      </template>
    </RekaDatePickerField>

    <UIButton
      :label="t('component.date_picker.today')"
      size="md"
      variant="secondary"
      @click="emit('today')"
    />
  </div>
</template>
