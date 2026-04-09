<script setup lang="ts">
import { ChevronRightIcon } from '@wisemen/vue-core-icons'
import {
  DateRangePickerField as RekaDateRangePickerField,
  DateRangePickerInput as RekaDateRangePickerInput,
} from 'reka-ui'
import { useI18n } from 'vue-i18n'

import { UIButton } from '@/ui/button'
import { useInjectDateRangePickerContext } from '@/ui/date-range-picker/dateRangePicker.context'

const {
  t,
} = useI18n()

const {
  onApply, onCancel,
} = useInjectDateRangePickerContext()
</script>

<template>
  <div class="flex items-center gap-xs border-t border-secondary p-xl">
    <RekaDateRangePickerField
      v-slot="{ segments }"
      class="
        flex h-7 flex-1 items-center gap-xxs rounded-sm border border-secondary
        bg-primary px-sm text-xs text-primary
        [&:has(:focus)]:border-fg-brand-primary [&:has(:focus)]:outline
        [&:has(:focus)]:outline-fg-brand-primary
      "
    >
      <template
        v-for="{ part, value } in segments.start"
        :key="`start-${part}`"
      >
        <RekaDateRangePickerInput
          v-if="part !== 'literal'"
          :part="part"
          class="
            rounded-sm px-xxs text-xs text-primary tabular-nums
            caret-transparent outline-none
            focus:bg-brand-solid focus:text-primary-on-brand
            data-placeholder:text-placeholder
            data-placeholder:focus:text-primary-on-brand
          "
          type="start"
        >
          {{ value }}
        </RekaDateRangePickerInput>

        <RekaDateRangePickerInput
          v-else
          :part="part"
          class="text-placeholder select-none"
          type="start"
        >
          {{ value }}
        </RekaDateRangePickerInput>
      </template>
    </RekaDateRangePickerField>

    <ChevronRightIcon class="size-4 text-placeholder" />

    <RekaDateRangePickerField
      v-slot="{ segments }"
      class="
        flex h-7 flex-1 items-center gap-xxs rounded-sm border border-secondary
        bg-primary px-sm text-xs text-primary
        [&:has(:focus)]:border-fg-brand-primary [&:has(:focus)]:outline
        [&:has(:focus)]:outline-fg-brand-primary
      "
    >
      <template
        v-for="{ part, value } in segments.end"
        :key="`end-${part}`"
      >
        <RekaDateRangePickerInput
          v-if="part !== 'literal'"
          :part="part"
          class="
            rounded-sm px-xxs text-xs text-primary tabular-nums
            caret-transparent outline-none
            focus:bg-brand-solid focus:text-primary-on-brand
            data-placeholder:text-placeholder
            data-placeholder:focus:text-primary-on-brand
          "
          type="end"
        >
          {{ value }}
        </RekaDateRangePickerInput>

        <RekaDateRangePickerInput
          v-else
          :part="part"
          class="text-placeholder select-none"
          type="end"
        >
          {{ value }}
        </RekaDateRangePickerInput>
      </template>
    </RekaDateRangePickerField>

    <UIButton
      :label="t('component.date_range_picker.cancel')"
      size="md"
      variant="secondary"
      @click="onCancel"
    />

    <UIButton
      :label="t('component.date_range_picker.apply')"
      size="md"
      variant="primary"
      @click="onApply"
    />
  </div>
</template>
