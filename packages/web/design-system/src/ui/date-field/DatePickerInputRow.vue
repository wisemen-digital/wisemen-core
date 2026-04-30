<script setup lang="ts">
import {
  DatePickerField as RekaDatePickerField,
  DatePickerInput as RekaDatePickerInput,
} from 'reka-ui'
import { useI18n } from 'vue-i18n'

import { UIButton } from '@/ui/button'
import { useInjectDatePickerFieldContext } from '@/ui/date-field/datePickerField.context'

const emit = defineEmits<{
  today: []
}>()

const i18n = useI18n()

const {
  onClose,
} = useInjectDatePickerFieldContext()
</script>

<template>
  <div class="flex items-center gap-xs">
    <RekaDatePickerField
      v-slot="{ segments }"
      class="
        flex h-7 flex-1 items-center gap-xxs rounded-sm border border-secondary
        bg-primary px-sm text-xs text-primary
        [&:has(:focus)]:border-fg-brand-primary [&:has(:focus)]:outline
        [&:has(:focus)]:outline-fg-brand-primary
      "
      @keydown.enter="onClose"
    >
      <template
        v-for="{ part, value } in segments"
        :key="part"
      >
        <RekaDatePickerInput
          v-if="part !== 'literal'"
          :part="part"
          class="
            rounded-sm px-xxs text-xs text-primary tabular-nums
            caret-transparent outline-none
            hover:bg-secondary-hover
            focus:bg-secondary-hover focus:text-primary
            data-placeholder:text-placeholder
            data-placeholder:focus:text-primary
          "
        >
          {{ value }}
        </RekaDatePickerInput>

        <RekaDatePickerInput
          v-else
          :part="part"
          class="text-placeholder select-none"
        >
          {{ value }}
        </RekaDatePickerInput>
      </template>
    </RekaDatePickerField>

    <UIButton
      :label="i18n.t('component.date_picker.today')"
      size="md"
      variant="secondary"
      @click="emit('today')"
    />
  </div>
</template>
