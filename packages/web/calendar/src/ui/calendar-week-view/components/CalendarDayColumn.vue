<script setup lang="ts" generic="TMeta = Record<string, unknown>">
import type { Temporal } from 'temporal-polyfill'
import {
  computed,
  toRef,
} from 'vue'

import CalendarCurrentTimeIndicator from '@/ui/calendar-week-view/components/CalendarCurrentTimeIndicator.vue'
import CalendarEventBlock from '@/ui/calendar-week-view/components/CalendarEventBlock.vue'
import { useCalendarEventOverlap } from '@/ui/calendar-week-view/composables/useCalendarEventOverlap.composable'
import type { CalendarEvent } from '@/ui/calendar-week-view/types/calendarEvent.type'

const props = defineProps<{
  currentZonedDateTime: Temporal.ZonedDateTime
  isToday: boolean
  day: Temporal.PlainDate
  endHour: number
  events: CalendarEvent<TMeta>[]
  hourCount: number
  startHour: number
}>()

const emit = defineEmits<{
  eventClick: [payload: { event: CalendarEvent<TMeta>
    nativeEvent: MouseEvent }]
}>()

const eventsRef = toRef(props, 'events')
const {
  layouts,
} = useCalendarEventOverlap<TMeta>(eventsRef)

const hours = computed<number[]>(() => Array.from(
  {
    length: props.hourCount,
  },
  (_, index) => props.startHour + index,
))

const totalGridMinutes = computed<number>(() => (props.endHour - props.startHour) * 60)

function toTopOffsetPercentage(zonedDateTime: Temporal.ZonedDateTime): number {
  const minutesSinceStart = (zonedDateTime.hour - props.startHour) * 60 + zonedDateTime.minute

  return (minutesSinceStart / totalGridMinutes.value) * 100
}

function toHeightPercentage(start: Temporal.ZonedDateTime, end: Temporal.ZonedDateTime): number {
  const durationMinutes = start.until(end).total({
    unit: 'minutes',
  })

  return (durationMinutes / totalGridMinutes.value) * 100
}

function onEventClick(payload: { event: CalendarEvent<TMeta>
  nativeEvent: MouseEvent }): void {
  emit('eventClick', payload)
}
</script>

<template>
  <div
    class="
      relative grow border-r border-gray-100
      last:border-r-0
    "
  >
    <div
      v-for="hour in hours"
      :key="hour"
      class="h-(--wui-calendar-hour-height,64px) border-b border-gray-100"
    />

    <CalendarEventBlock
      v-for="layout in layouts"
      :key="layout.event.id"
      :event="layout.event"
      :top-offset-percentage="toTopOffsetPercentage(layout.event.start)"
      :height-percentage="toHeightPercentage(layout.event.start, layout.event.end)"
      :left-percentage="(layout.columnIndex / layout.columnCount) * 100"
      :width-percentage="100 / layout.columnCount"
      @event-click="onEventClick"
    >
      <template
        v-if="$slots.event"
        #default="slotProps"
      >
        <slot
          name="event"
          v-bind="slotProps"
        />
      </template>
    </CalendarEventBlock>

    <CalendarCurrentTimeIndicator
      v-if="props.isToday"
      :current-zoned-date-time="props.currentZonedDateTime"
      :start-hour="props.startHour"
      :end-hour="props.endHour"
    />
  </div>
</template>
