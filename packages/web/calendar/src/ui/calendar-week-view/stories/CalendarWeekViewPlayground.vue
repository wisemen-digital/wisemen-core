<script setup lang="ts">
import { Temporal } from 'temporal-polyfill'
import { ref } from 'vue'

import CalendarWeekView from '@/ui/calendar-week-view/CalendarWeekView.vue'
import type { CalendarEvent } from '@/ui/calendar-week-view/types/calendarEvent.type'
import type {
  CalendarProposedUpdate,
  CalendarSlotDraft,
  CalendarSlotInfo,
  CalendarUpdateResult,
} from '@/ui/calendar-week-view/types/calendarInteraction.type'
import type { CalendarWeekViewProps } from '@/ui/calendar-week-view/types/calendarWeekView.props'

const props = withDefaults(defineProps<{
  isCreatable?: boolean
  isDraggable?: boolean
  isResizable?: boolean
  endHour?: CalendarWeekViewProps['endHour']
  firstDayOfWeek?: CalendarWeekViewProps['firstDayOfWeek']
  /** Rejects any drop landing after noon, to exercise the live drag gate. */
  rejectAfternoons?: boolean
  snapDuration?: CalendarWeekViewProps['snapDuration']
  startHour?: CalendarWeekViewProps['startHour']
}>(), {
  isCreatable: false,
  isDraggable: false,
  isResizable: false,
  endHour: 24,
  firstDayOfWeek: 1,
  rejectAfternoons: false,
  snapDuration: 15,
  startHour: 0,
})

const currentDate = ref<Temporal.PlainDate>(Temporal.Now.plainDateISO())

function toStartOfWeek(date: Temporal.PlainDate): Temporal.PlainDate {
  return date.subtract({
    days: date.dayOfWeek - 1,
  })
}

function buildSampleEvents(): CalendarEvent[] {
  const weekStart = toStartOfWeek(Temporal.Now.plainDateISO())
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
    eventAt(4, 12, 0, 30, 'Lunch and learn'),
    eventAt(5, 11, 0, 60, 'Weekend prep sync'),
    // Crosses midnight: renders as two segments, drags and resizes as one.
    eventAt(2, 22, 30, 240, 'Overnight deploy'),
    {
      ...eventAt(3, 13, 0, 60, 'Locked: payroll cutoff'),
      readOnly: true,
    },
    {
      ...eventAt(4, 9, 0, 120, 'Fixed length: certification exam'),
      resizable: false,
    },
    {
      // Spans Wed–Fri: drag it sideways, or pull either edge to change its run.
      ...eventAt(2, 0, 0, 3 * 24 * 60, 'Team offsite'),
      allDay: true,
    },
    {
      ...eventAt(0, 0, 0, 2 * 24 * 60, 'Release freeze'),
      allDay: true,
    },
    {
      ...eventAt(5, 0, 0, 24 * 60, 'On call: weekend'),
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
}

const events = ref<CalendarEvent[]>(buildSampleEvents())

function canDropEvent(update: CalendarProposedUpdate): boolean {
  return !props.rejectAfternoons || update.start.hour < 12
}

/** Stand-in for a real save: async, so the optimistic hold is visible. */
async function onEventUpdate(update: CalendarProposedUpdate): Promise<CalendarUpdateResult> {
  await new Promise((resolve) => {
    setTimeout(resolve, 300)
  })

  events.value = events.value.map((event) => event.id === update.event.id
    ? {
        ...event,
        end: update.end,
        start: update.start,
      }
    : event)

  return true
}

function onEventDuplicate(update: CalendarProposedUpdate): CalendarEvent {
  const duplicate: CalendarEvent = {
    ...update.event,
    id: `${update.event.id}-copy-${Date.now()}`,
    title: `${update.event.title ?? 'Untitled event'} (copy)`,
    end: update.end,
    start: update.start,
  }

  events.value = [
    ...events.value,
    duplicate,
  ]

  return duplicate
}

function onSelectSlot(draft: CalendarSlotDraft): void {
  events.value = [
    ...events.value,
    {
      id: `created-${Date.now()}`,
      title: 'New event',
      end: draft.end,
      start: draft.start,
      meta: {},
    },
  ]
}

function onEventClick(payload: { event: CalendarEvent
  nativeEvent: MouseEvent }): void {
  // eslint-disable-next-line no-console
  console.log('eventClick', payload.event.title)
}

function onSlotClick(payload: CalendarSlotInfo): void {
  // eslint-disable-next-line no-console
  console.log('slotClick', payload.day.toString(), payload.start?.toString() ?? 'all-day')
}
</script>

<template>
  <div class="h-180 w-full">
    <CalendarWeekView
      v-model:current-date="currentDate"
      :events="events"
      :start-hour="props.startHour"
      :end-hour="props.endHour"
      :first-day-of-week="props.firstDayOfWeek"
      :snap-duration="props.snapDuration"
      :interactions="{
        drag: props.isDraggable,
        resize: props.isResizable,
        selectSlot: props.isCreatable,
      }"
      :can-drop-event="canDropEvent"
      :on-event-update="onEventUpdate"
      :on-event-duplicate="onEventDuplicate"
      @event-click="onEventClick"
      @slot-click="onSlotClick"
      @select-slot="onSelectSlot"
    />
  </div>
</template>
