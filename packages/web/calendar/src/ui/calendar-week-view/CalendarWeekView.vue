<script setup lang="ts" generic="TMeta = Record<string, unknown>">
import { Temporal } from 'temporal-polyfill'
import { computed } from 'vue'

import CalendarAllDayRow from '@/ui/calendar-week-view/components/CalendarAllDayRow.vue'
import CalendarDayColumn from '@/ui/calendar-week-view/components/CalendarDayColumn.vue'
import CalendarHourLabels from '@/ui/calendar-week-view/components/CalendarHourLabels.vue'
import CalendarWeekHeader from '@/ui/calendar-week-view/components/CalendarWeekHeader.vue'
import CalendarWeekToolbar from '@/ui/calendar-week-view/components/CalendarWeekToolbar.vue'
import { useCalendarCurrentTime } from '@/ui/calendar-week-view/composables/useCalendarCurrentTime.composable'
import { useCalendarWeekDays } from '@/ui/calendar-week-view/composables/useCalendarWeekDays.composable'
import type { CalendarEvent } from '@/ui/calendar-week-view/types/calendarEvent.type'
import type { CalendarWeekViewProps } from '@/ui/calendar-week-view/types/calendarWeekView.props'
import {
  getNextWeekDate,
  getPreviousWeekDate,
  getTodayDate,
} from '@/ui/calendar-week-view/utils/calendarWeekViewNavigation.util'

const props = withDefaults(defineProps<CalendarWeekViewProps<TMeta>>(), {
  endHour: 24,
  firstDayOfWeek: 1,
  startHour: 0,
})

const emit = defineEmits<{
  'update:currentDate': [date: Temporal.PlainDate]
  'eventClick': [payload: { event: CalendarEvent<TMeta>
    nativeEvent: MouseEvent }]
}>()

defineSlots<{
  event?: (props: { isGhost: boolean
    event: CalendarEvent<TMeta>
    height: number }) => unknown
}>()

const currentDateRef = computed(() => props.currentDate)
const firstDayOfWeekRef = computed(() => props.firstDayOfWeek)

const {
  weekDays,
} = useCalendarWeekDays({
  currentDate: currentDateRef,
  firstDayOfWeek: firstDayOfWeekRef,
})

const {
  currentZonedDateTime,
} = useCalendarCurrentTime()

const today = computed<Temporal.PlainDate>(() => Temporal.Now.plainDateISO())

const hourCount = computed<number>(() => props.endHour - props.startHour)

function timedEventsForDay(day: Temporal.PlainDate): CalendarEvent<TMeta>[] {
  return props.events.filter((event) => !event.allDay && Temporal.PlainDate.compare(
    event.start.toPlainDate(),
    day,
  ) === 0)
}

function allDayEventsForDay(day: Temporal.PlainDate): CalendarEvent<TMeta>[] {
  return props.events.filter((event) => event.allDay === true && Temporal.PlainDate.compare(
    event.start.toPlainDate(),
    day,
  ) === 0)
}

function isSameDate(a: Temporal.PlainDate, b: Temporal.PlainDate): boolean {
  return Temporal.PlainDate.compare(a, b) === 0
}

function onEventClick(payload: { event: CalendarEvent<TMeta>
  nativeEvent: MouseEvent }): void {
  emit('eventClick', payload)
}

function onPrev(): void {
  emit('update:currentDate', getPreviousWeekDate(props.currentDate))
}

function onNext(): void {
  emit('update:currentDate', getNextWeekDate(props.currentDate))
}

function onToday(): void {
  emit('update:currentDate', getTodayDate())
}
</script>

<template>
  <div
    class="
      flex h-full flex-col overflow-hidden rounded-lg border border-gray-200
      bg-white
    "
  >
    <CalendarWeekToolbar
      :week-days="weekDays"
      @prev="onPrev"
      @next="onNext"
      @today="onToday"
    />

    <div class="flex grow flex-col overflow-y-auto">
      <div class="sticky top-0 z-10 bg-white">
        <CalendarWeekHeader
          :week-days="weekDays"
          :today="today"
        />

        <CalendarAllDayRow
          :week-days="weekDays"
          :events-for-day="allDayEventsForDay"
          @event-click="onEventClick"
        />
      </div>

      <div class="flex grow">
        <CalendarHourLabels
          :start-hour="props.startHour"
          :end-hour="props.endHour"
        />

        <div class="grid grow grid-cols-7 border-l border-gray-100">
          <CalendarDayColumn
            v-for="day in weekDays"
            :key="day.toString()"
            :day="day"
            :events="timedEventsForDay(day)"
            :start-hour="props.startHour"
            :end-hour="props.endHour"
            :hour-count="hourCount"
            :is-today="isSameDate(day, today)"
            :current-zoned-date-time="currentZonedDateTime"
            @event-click="onEventClick"
          >
            <template
              v-if="$slots.event"
              #event="slotProps"
            >
              <slot
                name="event"
                v-bind="slotProps"
              />
            </template>
          </CalendarDayColumn>
        </div>
      </div>
    </div>
  </div>
</template>
