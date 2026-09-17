<script setup lang="ts">
import { Temporal } from 'temporal-polyfill'
import {
  computed,
  ref,
} from 'vue'

import CalendarWeekView from '@/ui/calendar-week-view/CalendarWeekView.vue'
import type { CalendarEvent } from '@/ui/calendar-week-view/types/calendarEvent.type'
import type { CalendarWeekViewProps } from '@/ui/calendar-week-view/types/calendarWeekView.props'

const props = withDefaults(defineProps<{
  endHour?: CalendarWeekViewProps['endHour']
  firstDayOfWeek?: CalendarWeekViewProps['firstDayOfWeek']
  startHour?: CalendarWeekViewProps['startHour']
}>(), {
  endHour: 24,
  firstDayOfWeek: 1,
  startHour: 0,
})

const currentDate = ref<Temporal.PlainDate>(Temporal.Now.plainDateISO())

function toStartOfWeek(date: Temporal.PlainDate): Temporal.PlainDate {
  return date.subtract({
    days: date.dayOfWeek - 1,
  })
}

const sampleEvents = computed<CalendarEvent[]>(() => {
  const weekStart = toStartOfWeek(currentDate.value)
  const now = Temporal.Now.zonedDateTimeISO()

  function eventAt(
    dayOffset: number,
    hour: number,
    minute: number,
    durationMinutes: number,
    title: string,
  ): CalendarEvent {
    const day = weekStart.add({
      days: dayOffset,
    })

    const start = day.toZonedDateTime({
      plainTime: Temporal.PlainTime.from({
        hour,
        minute,
      }),
      timeZone: Temporal.Now.timeZoneId(),
    })

    return {
      id: `${dayOffset}-${hour}-${minute}-${title}`,
      title,
      end: start.add({
        minutes: durationMinutes,
      }),
      start,
      meta: {},
    }
  }

  return [
    eventAt(0, 9, 0, 60, 'Team standup'),
    eventAt(0, 11, 0, 90, 'Client call'),
    eventAt(0, 14, 30, 45, 'Design review'),
    eventAt(1, 9, 30, 30, '1:1 with manager'),
    eventAt(1, 10, 0, 60, 'Sprint planning'),
    eventAt(1, 10, 30, 60, 'Overlapping sync'),
    eventAt(1, 15, 0, 120, 'Deep work block'),
    eventAt(2, 8, 0, 60, 'Breakfast meeting'),
    eventAt(2, 13, 0, 30, 'Quick check-in'),
    eventAt(2, 13, 15, 30, 'Overlapping review'),
    eventAt(2, 13, 30, 30, 'Overlapping follow-up'),
    eventAt(3, 10, 0, 60, 'Interview'),
    eventAt(3, 16, 0, 60, 'Retro'),
    eventAt(4, 9, 0, 480, 'Conference (all day-ish)'),
    eventAt(4, 12, 0, 30, 'Lunch and learn'),
    eventAt(5, 11, 0, 60, 'Weekend prep sync'),
    {
      ...eventAt(3, 0, 0, 0, 'Team offsite'),
      allDay: true,
    },
    {
      id: 'now-event',
      title: 'Happening now',
      end: now.add({
        minutes: 45,
      }),
      start: now.subtract({
        minutes: 15,
      }),
      meta: {},
    },
  ]
})

function onEventClick(payload: { event: CalendarEvent
  nativeEvent: MouseEvent }): void {
  // eslint-disable-next-line no-console
  console.log('eventClick', payload.event.title)
}
</script>

<template>
  <div class="h-180 w-full">
    <CalendarWeekView
      v-model:current-date="currentDate"
      :events="sampleEvents"
      :start-hour="props.startHour"
      :end-hour="props.endHour"
      :first-day-of-week="props.firstDayOfWeek"
      @event-click="onEventClick"
    />
  </div>
</template>
