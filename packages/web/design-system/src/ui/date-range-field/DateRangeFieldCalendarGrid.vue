<script setup lang="ts">
import { endOfMonth } from '@internationalized/date'
import {
  DateRangePickerCell as RekaDateRangePickerCell,
  DateRangePickerCellTrigger as RekaDateRangePickerCellTrigger,
  DateRangePickerGrid as RekaDateRangePickerGrid,
  DateRangePickerGridBody as RekaDateRangePickerGridBody,
  DateRangePickerGridHead as RekaDateRangePickerGridHead,
  DateRangePickerGridRow as RekaDateRangePickerGridRow,
  DateRangePickerHeadCell as RekaDateRangePickerHeadCell,
} from 'reka-ui'

const props = defineProps<{
  month: any
  weekDays: string[]
}>()

function isFirstDayOfMonth(date: any): boolean {
  return date.day === 1
}

function isLastDayOfMonth(date: any): boolean {
  return date.day === endOfMonth(date).day
}
</script>

<template>
  <RekaDateRangePickerGrid class="w-full border-collapse select-none">
    <RekaDateRangePickerGridHead>
      <RekaDateRangePickerGridRow class="flex py-xxs">
        <RekaDateRangePickerHeadCell
          v-for="day in props.weekDays"
          :key="day"
          class="flex-1 py-xs text-center text-xs font-medium text-tertiary"
        >
          {{ day }}
        </RekaDateRangePickerHeadCell>
      </RekaDateRangePickerGridRow>
    </RekaDateRangePickerGridHead>

    <RekaDateRangePickerGridBody>
      <RekaDateRangePickerGridRow
        v-for="(week, weekIndex) in props.month.rows"
        :key="weekIndex"
        class="flex py-xxs"
      >
        <RekaDateRangePickerCell
          v-for="date in week"
          :key="date.toString()"
          :date="date"
          class="group/cell relative flex-1 p-0 text-center text-xs"
        >
          <RekaDateRangePickerCellTrigger
            v-slot="{ today }"
            :class="{
              'rounded-r-full': isLastDayOfMonth(date),
              'rounded-l-full': isFirstDayOfMonth(date),
            }"
            :day="date"
            :month="props.month.value"
            class="
              group/celtrig inline-flex h-9 w-full items-center justify-center
              text-xs outline-none
              group-first/cell:rounded-l-full
              group-last/cell:rounded-r-full
              data-disabled:pointer-events-none
              data-highlighted:bg-brand-secondary
              data-highlighted-end:rounded-r-full
              data-highlighted-end:bg-brand-secondary
              data-highlighted-start:rounded-l-full
              data-highlighted-start:bg-brand-secondary
              data-outside-view:pointer-events-none data-outside-view:invisible
              data-selected:bg-brand-secondary
              data-selection-end:rounded-r-full
              data-selection-end:bg-brand-secondary
              data-selection-start:rounded-l-full
              data-selection-start:bg-brand-secondary
              data-unavailable:pointer-events-none
              [&[data-selection-end][data-highlighted-start]:not([data-highlighted-end])]:rounded-r-none
              [&[data-selection-start][data-highlighted-end]:not([data-highlighted-start])]:rounded-l-none
            "
          >
            <div
              class="
                relative flex size-9 shrink-0 items-center justify-center
                rounded-full text-xs font-normal text-secondary
                group-focus-visible/celtrig:ring-2
                group-focus-visible/celtrig:ring-fg-brand-primary
                group-data-disabled/celtrig:text-disabled
                group-data-disabled/celtrig:opacity-50
                group-data-highlighted-end/celtrig:bg-brand-solid
                group-data-highlighted-end/celtrig:text-primary-on-brand
                group-data-highlighted-end/celtrig:group-focus-visible/celtrig:ring-0
                group-data-highlighted-start/celtrig:bg-brand-solid
                group-data-highlighted-start/celtrig:text-primary-on-brand
                group-data-highlighted-start/celtrig:group-focus-visible/celtrig:ring-0
                group-data-outside-view/celtrig:text-disabled
                group-data-selection-end/celtrig:bg-brand-solid
                group-data-selection-end/celtrig:text-primary-on-brand
                group-data-selection-end/celtrig:group-focus-visible/celtrig:ring-0
                group-data-selection-start/celtrig:bg-brand-solid
                group-data-selection-start/celtrig:text-primary-on-brand
                group-data-selection-start/celtrig:group-focus-visible/celtrig:ring-0
                group-data-unavailable/celtrig:text-disabled
                group-data-unavailable/celtrig:line-through
                group-not-data-disabled/celtrig:group-not-data-highlighted/celtrig:group-not-data-selected/celtrig:hover:bg-primary-hover
              "
            >
              {{ date.day }}

              <span
                v-if="today"
                class="
                  absolute bottom-1 left-1/2 size-1 -translate-x-1/2
                  rounded-full bg-brand-solid
                  group-data-highlighted-end/celtrig:bg-white
                  group-data-highlighted-start/celtrig:bg-white
                  group-data-selection-end/celtrig:bg-white
                  group-data-selection-start/celtrig:bg-white
                "
              />
            </div>
          </RekaDateRangePickerCellTrigger>
        </RekaDateRangePickerCell>
      </RekaDateRangePickerGridRow>
    </RekaDateRangePickerGridBody>
  </RekaDateRangePickerGrid>
</template>
