<script setup lang="ts">
import { Temporal } from 'temporal-polyfill'

const props = defineProps<{
  today: Temporal.PlainDate
  weekDays: Temporal.PlainDate[]
}>()

function isSameDate(a: Temporal.PlainDate, b: Temporal.PlainDate): boolean {
  return Temporal.PlainDate.compare(a, b) === 0
}

function formatDayName(date: Temporal.PlainDate): string {
  return date.toLocaleString(undefined, {
    weekday: 'short',
  })
}
</script>

<template>
  <div
    class="
      flex h-(--wui-calendar-header-height,3rem) shrink-0 items-center border-b
      border-gray-200
    "
  >
    <div class="w-16 shrink-0" />

    <div class="grid grow grid-cols-7">
      <div
        v-for="day in props.weekDays"
        :key="day.toString()"
        class="flex flex-col items-center justify-center py-1"
      >
        <span class="text-xs font-medium text-gray-500 uppercase">
          {{ formatDayName(day) }}
        </span>

        <span
          :class="isSameDate(day, props.today) ? 'text-blue-600' : `
            text-gray-900
          `"
          class="text-sm font-semibold"
        >
          {{ day.day }}
        </span>
      </div>
    </div>
  </div>
</template>
