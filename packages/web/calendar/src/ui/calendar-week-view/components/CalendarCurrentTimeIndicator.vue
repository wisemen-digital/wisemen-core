<script setup lang="ts">
import type { Temporal } from 'temporal-polyfill'
import { computed } from 'vue'

const props = defineProps<{
  currentZonedDateTime: Temporal.ZonedDateTime
  endHour: number
  startHour: number
}>()

const topOffsetPercentage = computed<number>(() => {
  const minutesSinceStart = (props.currentZonedDateTime.hour - props.startHour) * 60
    + props.currentZonedDateTime.minute

  const totalMinutes = (props.endHour - props.startHour) * 60

  return (minutesSinceStart / totalMinutes) * 100
})

function formatTimeLabel(zonedDateTime: Temporal.ZonedDateTime): string {
  return zonedDateTime.toPlainTime().toString({
    smallestUnit: 'minute',
  })
}
</script>

<template>
  <div
    :style="{ top: `${topOffsetPercentage}%` }"
    class="pointer-events-none absolute inset-x-0 z-10 flex items-center"
  >
    <span
      class="
        -ml-14 w-12 shrink-0 text-right text-[10px] font-medium text-error-500
      "
    >
      {{ formatTimeLabel(props.currentZonedDateTime) }}
    </span>

    <div class="h-px w-full bg-error-500">
      <div class="-mt-0.75 size-1.75 rounded-full bg-error-500" />
    </div>
  </div>
</template>
