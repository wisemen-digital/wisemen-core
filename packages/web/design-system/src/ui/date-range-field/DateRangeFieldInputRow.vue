<script setup lang="ts">
import { ChevronRightIcon } from '@wisemen/vue-core-icons'
import {
  DateRangePickerField as RekaDateRangePickerField,
  DateRangePickerInput as RekaDateRangePickerInput,
} from 'reka-ui'
import { useI18n } from 'vue-i18n'

import { UIButton } from '@/ui/button'
import { useInjectDateRangeFieldContext } from '@/ui/date-range-field/dateRangeField.context'
import { UIRowLayout } from '@/ui/row-layout'

const i18n = useI18n()

const {
  onCancel,
} = useInjectDateRangeFieldContext()
</script>

<template>
  <div
    class="
      flex flex-col gap-md border-t border-secondary p-xl
      md:flex-row md:items-center md:justify-between
    "
  >
    <UIRowLayout class="min-w-0">
      <RekaDateRangePickerField
        v-slot="{ segments }"
        class="
          flex h-7 min-w-0 flex-1 items-center gap-xxs rounded-sm border
          border-secondary bg-primary px-sm text-xs text-primary
          md:max-w-30 md:min-w-30 md:flex-none
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
              hover:bg-primary-hover
              focus:bg-primary-hover focus:text-primary
              data-placeholder:text-placeholder
              data-placeholder:focus:text-primary
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
          flex h-7 min-w-0 flex-1 items-center gap-xxs rounded-sm border
          border-secondary bg-primary px-sm text-xs text-primary
          md:max-w-30 md:min-w-30 md:flex-none
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
              hover:bg-primary-hover
              focus:bg-primary-hover focus:text-primary
              data-placeholder:text-placeholder
              data-placeholder:focus:text-primary
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
    </UIRowLayout>

    <UIRowLayout class="self-end">
      <UIButton
        :label="i18n.t('component.date_range_picker.close')"
        size="md"
        variant="secondary"
        @click="onCancel"
      />
    </UIRowLayout>
  </div>
</template>
