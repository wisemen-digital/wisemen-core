<script setup lang="ts">
import {
  UIColumnLayout,
  UIRowLayout,
  UIText,
} from '@wisemen/vue-core-design-system'
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
  <UIRowLayout
    gap="none"
    class="
      h-(--wui-calendar-header-height,3rem) shrink-0 border-b border-gray-200
    "
  >
    <div class="w-16 shrink-0" />

    <div class="grid grow grid-cols-7">
      <UIColumnLayout
        v-for="day in props.weekDays"
        :key="day.toString()"
        align="center"
        justify="center"
        gap="none"
        class="py-1"
      >
        <UIText
          :text="formatDayName(day)"
          class="text-xs font-medium text-gray-500 uppercase"
        />

        <UIText
          :text="day.day.toString()"
          :class="isSameDate(day, props.today) ? 'text-blue-600' : `
            text-gray-900
          `"
          class="text-sm font-semibold"
        />
      </UIColumnLayout>
    </div>
  </UIRowLayout>
</template>
