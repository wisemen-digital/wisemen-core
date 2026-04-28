<script setup lang="ts">
import {
  DatePickerCell as RekaDatePickerCell,
  DatePickerCellTrigger as RekaDatePickerCellTrigger,
  DatePickerGrid as RekaDatePickerGrid,
  DatePickerGridBody as RekaDatePickerGridBody,
  DatePickerGridHead as RekaDatePickerGridHead,
  DatePickerGridRow as RekaDatePickerGridRow,
  DatePickerHeadCell as RekaDatePickerHeadCell,
} from 'reka-ui'

import { useInjectDatePickerFieldContext } from '@/ui/date-field/datePickerField.context'

const props = defineProps<{
  month: any
  weekDays: string[]
}>()

const {
  onClose,
} = useInjectDatePickerFieldContext()
</script>

<template>
  <RekaDatePickerGrid class="w-full border-collapse select-none">
    <RekaDatePickerGridHead>
      <RekaDatePickerGridRow class="flex">
        <RekaDatePickerHeadCell
          v-for="day in props.weekDays"
          :key="day"
          class="flex-1 py-xs text-center text-xs font-medium text-tertiary"
        >
          {{ day }}
        </RekaDatePickerHeadCell>
      </RekaDatePickerGridRow>
    </RekaDatePickerGridHead>

    <RekaDatePickerGridBody>
      <RekaDatePickerGridRow
        v-for="(week, weekIndex) in props.month.rows"
        :key="weekIndex"
        class="flex py-xxs"
      >
        <RekaDatePickerCell
          v-for="date in week"
          :key="date.toString()"
          :date="date"
          class="relative flex-1 p-0 text-center text-xs"
        >
          <RekaDatePickerCellTrigger
            v-slot="{ today }"
            :day="date"
            :month="props.month.value"
            class="
              group/cell inline-flex size-9 shrink-0 items-center justify-center
              rounded-full text-xs font-normal text-secondary transition-colors
              outline-none
              not-data-disabled:hover:bg-primary-hover
              focus-visible:ring-2 focus-visible:ring-fg-brand-primary
              data-disabled:pointer-events-none data-disabled:text-disabled
              data-disabled:opacity-50
              data-outside-view:pointer-events-none data-outside-view:invisible
              data-selected:bg-brand-solid data-selected:text-primary-on-brand
              data-selected:hover:bg-brand-solid-hover
              data-selected:focus-visible:ring-0
              data-unavailable:pointer-events-none
              data-unavailable:text-disabled data-unavailable:line-through
            "
            @click="onClose"
          >
            {{ date.day }}

            <span
              v-if="today"
              class="
                absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full
                bg-brand-solid
                group-data-selected/cell:bg-white
              "
            />
          </RekaDatePickerCellTrigger>
        </RekaDatePickerCell>
      </RekaDatePickerGridRow>
    </RekaDatePickerGridBody>
  </RekaDatePickerGrid>
</template>
