<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  endHour: number
  startHour: number
}>()

const hours = computed<number[]>(() => Array.from(
  {
    length: props.endHour - props.startHour,
  },
  (_, index) => props.startHour + index,
))

function formatHourLabel(hour: number): string {
  return `${hour.toString().padStart(2, '0')}:00`
}
</script>

<template>
  <div class="w-16 shrink-0">
    <div
      v-for="hour in hours"
      :key="hour"
      class="relative h-(--wui-calendar-hour-height,64px)"
    >
      <span
        class="absolute top-0 right-2 -translate-y-1/2 text-xs text-gray-400"
      >
        {{ formatHourLabel(hour) }}
      </span>
    </div>
  </div>
</template>
