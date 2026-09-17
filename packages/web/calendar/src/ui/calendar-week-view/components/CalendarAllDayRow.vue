<script setup lang="ts" generic="TMeta = Record<string, unknown>">
import type { Temporal } from 'temporal-polyfill'

import type { CalendarEvent } from '@/ui/calendar-week-view/types/calendarEvent.type'

const props = defineProps<{
  eventsForDay: (day: Temporal.PlainDate) => CalendarEvent<TMeta>[]
  weekDays: Temporal.PlainDate[]
}>()

const emit = defineEmits<{
  eventClick: [payload: { event: CalendarEvent<TMeta>
    nativeEvent: MouseEvent }]
}>()

function onEventClick(event: CalendarEvent<TMeta>, nativeEvent: MouseEvent): void {
  emit('eventClick', {
    event,
    nativeEvent,
  })
}
</script>

<template>
  <div
    class="flex min-h-8 shrink-0 items-stretch border-b border-gray-200"
  >
    <div class="flex w-16 shrink-0 items-center justify-end pr-2">
      <span class="text-xs text-gray-400">All day</span>
    </div>

    <div class="grid grow grid-cols-7 border-l border-gray-100">
      <div
        v-for="day in props.weekDays"
        :key="day.toString()"
        class="
          flex flex-col gap-1 border-r border-gray-100 p-1
          last:border-r-0
        "
      >
        <button
          v-for="event in props.eventsForDay(day)"
          :key="event.id"
          type="button"
          class="
            flex items-center gap-1 truncate rounded-md border
            border-blue-200/60 bg-blue-50 px-1.5 py-0.5 text-left text-xs
            font-medium text-blue-900
            hover:bg-blue-100
          "
          @click="onEventClick(event, $event)"
        >
          <span class="size-1.5 shrink-0 rounded-full bg-blue-500" />
          <span class="truncate">{{ event.title ?? 'Untitled event' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
