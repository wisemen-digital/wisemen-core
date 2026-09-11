<script setup lang="ts" generic="TMeta = Record<string, unknown>">
import { Temporal } from 'temporal-polyfill'
import {
  computed,
  useTemplateRef,
} from 'vue'

import CalendarAllDayRow from '@/ui/calendar-week-view/components/CalendarAllDayRow.vue'
import CalendarDayColumn from '@/ui/calendar-week-view/components/CalendarDayColumn.vue'
import CalendarDragCarry from '@/ui/calendar-week-view/components/CalendarDragCarry.vue'
import CalendarHourLabels from '@/ui/calendar-week-view/components/CalendarHourLabels.vue'
import CalendarWeekHeader from '@/ui/calendar-week-view/components/CalendarWeekHeader.vue'
import CalendarWeekToolbar from '@/ui/calendar-week-view/components/CalendarWeekToolbar.vue'
import { useCalendarCurrentTime } from '@/ui/calendar-week-view/composables/useCalendarCurrentTime.composable'
import { useCalendarDrag } from '@/ui/calendar-week-view/composables/useCalendarDrag.composable'
import { useCalendarOptimisticEvents } from '@/ui/calendar-week-view/composables/useCalendarOptimisticEvents.composable'
import { useCalendarWeekDays } from '@/ui/calendar-week-view/composables/useCalendarWeekDays.composable'
import type { CalendarEvent } from '@/ui/calendar-week-view/types/calendarEvent.type'
import type {
  CalendarInteractions,
  CalendarProposedUpdate,
  CalendarSlotDraft,
  CalendarSlotInfo,
} from '@/ui/calendar-week-view/types/calendarInteraction.type'
import type { CalendarSegment } from '@/ui/calendar-week-view/types/calendarSegment.type'
import type { CalendarWeekViewProps } from '@/ui/calendar-week-view/types/calendarWeekView.props'
import {
  clipSegmentToBounds,
  splitEventsIntoSegments,
} from '@/ui/calendar-week-view/utils/calendarSegment.util'
import {
  getNextWeekDate,
  getPreviousWeekDate,
  getTodayDate,
} from '@/ui/calendar-week-view/utils/calendarWeekViewNavigation.util'

const props = withDefaults(defineProps<CalendarWeekViewProps<TMeta>>(), {
  endHour: 24,
  firstDayOfWeek: 1,
  snapDuration: 15,
  startHour: 0,
})

const emit = defineEmits<{
  'update:currentDate': [date: Temporal.PlainDate]
  'eventClick': [payload: { event: CalendarEvent<TMeta>
    nativeEvent: MouseEvent }]
  'selectSlot': [draft: CalendarSlotDraft]
  'slotClick': [payload: CalendarSlotInfo]
}>()

defineSlots<{
  event?: (props: { isEnd: boolean
    isGhost: boolean
    isStart: boolean
    event: CalendarEvent<TMeta>
    height: number }) => unknown
}>()

const gridElement = useTemplateRef<HTMLElement>('grid')
const scrollElement = useTemplateRef<HTMLElement>('scroll')

const currentDateRef = computed(() => props.currentDate)
const firstDayOfWeekRef = computed(() => props.firstDayOfWeek)
const eventsRef = computed(() => props.events)

const interactions = computed<CalendarInteractions>(() => ({
  drag: props.interactions?.drag ?? false,
  resize: props.interactions?.resize ?? false,
  selectSlot: props.interactions?.selectSlot ?? false,
}))

const {
  weekDays,
} = useCalendarWeekDays({
  currentDate: currentDateRef,
  firstDayOfWeek: firstDayOfWeekRef,
})

const {
  currentZonedDateTime,
} = useCalendarCurrentTime()

const {
  resolvedEvents,
  setOptimisticCreated,
  setOptimisticPosition,
} = useCalendarOptimisticEvents<TMeta>(eventsRef)

const {
  carryState,
  dragState,
  slotDraft,
  startEventGesture,
  startSlotGesture,
} = useCalendarDrag<TMeta>({
  canDropEvent: computed(() => props.canDropEvent),
  canSelectSlot: computed(() => props.canSelectSlot),
  endHour: computed(() => props.endHour),
  gridElement,
  scrollElement,
  snapDuration: computed(() => props.snapDuration),
  startHour: computed(() => props.startHour),
  weekDays,
  onCommitSlot: onSlotCommit,
  onCommitUpdate: onUpdateCommit,
})

const today = computed<Temporal.PlainDate>(() => Temporal.Now.plainDateISO())

const hourCount = computed<number>(() => props.endHour - props.startHour)

/**
 * The dragged event is hidden from the grid while its carry follows the
 * pointer; the dashed placeholder marks where it would land.
 */
const timedSegments = computed<CalendarSegment<TMeta>[]>(() => splitEventsIntoSegments(
  resolvedEvents.value.filter(
    (event) => event.allDay !== true && event.id !== dragState.value?.event.id,
  ),
  weekDays.value,
))

function segmentsForDay(day: Temporal.PlainDate): CalendarSegment<TMeta>[] {
  return timedSegments.value.filter(
    (segment) => Temporal.PlainDate.compare(segment.day, day) === 0,
  )
}

const allDayEvents = computed<CalendarEvent<TMeta>[]>(
  () => resolvedEvents.value.filter((event) => event.allDay === true),
)

interface AllDayGhost {
  isValid: boolean
  end: Temporal.ZonedDateTime
  event: CalendarEvent<TMeta>
  start: Temporal.ZonedDateTime
}

/** The all-day drag proposal, laid out as a bar by the row itself. */
const allDayGhost = computed<AllDayGhost | null>(() => {
  const state = dragState.value

  return state === null || state.event.allDay !== true
    ? null
    : {
        isValid: state.isValid,
        end: state.end,
        event: state.event,
        start: state.start,
      }
})

function isSameDate(a: Temporal.PlainDate, b: Temporal.PlainDate): boolean {
  return Temporal.PlainDate.compare(a, b) === 0
}

function toMinuteRange(
  start: Temporal.ZonedDateTime,
  end: Temporal.ZonedDateTime,
  day: Temporal.PlainDate,
): { endMin: number
  startMin: number } | null {
  const segments = splitEventsIntoSegments([
    {
      id: 'ghost',
      end,
      start,
      meta: {} as TMeta,
    },
  ], [
    day,
  ])

  const segment = segments[0]

  if (segment === undefined) {
    return null
  }

  // Clipped the same way committed segments are, so a ghost reaching past
  // midnight or outside startHour/endHour never renders at a negative offset.
  const clipped = clipSegmentToBounds(segment, props.startHour * 60, props.endHour * 60)

  return clipped === null
    ? null
    : {
        endMin: clipped.endMin,
        startMin: clipped.startMin,
      }
}

function ghostRangeForDay(day: Temporal.PlainDate): { isValid: boolean
  endMin: number
  startMin: number } | null {
  const state = dragState.value

  // An all-day drag is drawn as a bar in the all-day row; its midnight-to-
  // midnight range would otherwise paint a full-height ghost in every column
  // it touches, starting above the grid whenever startHour is not zero.
  if (state === null || state.event.allDay === true) {
    return null
  }

  const range = toMinuteRange(state.start, state.end, day)

  return range === null
    ? null
    : {
        isValid: state.isValid,
        ...range,
      }
}

function draftRangeForDay(day: Temporal.PlainDate): { endMin: number
  startMin: number } | null {
  const draft = slotDraft.value

  if (draft === null || Temporal.PlainDate.compare(draft.day, day) !== 0) {
    return null
  }

  return toMinuteRange(draft.start, draft.end, day)
}

async function onUpdateCommit(update: CalendarProposedUpdate<TMeta>): Promise<void> {
  if (update.source === 'duplicate') {
    const duplicate = await props.onEventDuplicate?.(update)

    if (duplicate !== undefined && duplicate !== false) {
      setOptimisticCreated(duplicate)
    }

    return
  }

  setOptimisticPosition(update.event.id, {
    end: update.end,
    start: update.start,
  })

  const result = await props.onEventUpdate?.(update)

  if (result === false) {
    setOptimisticPosition(update.event.id, null)

    return
  }

  if (typeof result === 'object' && result !== null) {
    setOptimisticPosition(update.event.id, {
      end: result.end ?? update.end,
      start: result.start ?? update.start,
    })
  }
}

function onSlotCommit(draft: CalendarSlotDraft): void {
  emit('selectSlot', draft)
}

function onEventClick(payload: { event: CalendarEvent<TMeta>
  nativeEvent: MouseEvent }): void {
  emit('eventClick', payload)
}

function onGestureStart(payload: { event: CalendarEvent<TMeta>
  kind: 'move' | 'resize-end' | 'resize-start'
  nativeEvent: PointerEvent }): void {
  startEventGesture(payload.nativeEvent, payload.event, payload.kind)
}

/** All-day bars are day-granular: whole-day moves, day-edge resizes. */
function onAllDayGestureStart(payload: { event: CalendarEvent<TMeta>
  kind: 'move' | 'resize-end' | 'resize-start'
  nativeEvent: PointerEvent }): void {
  startEventGesture(payload.nativeEvent, payload.event, payload.kind, true)
}

function onSlotGestureStart(payload: { day: Temporal.PlainDate
  nativeEvent: PointerEvent }): void {
  startSlotGesture(payload.nativeEvent, payload.day)
}

function onTimedSlotClick(payload: { day: Temporal.PlainDate
  nativeEvent: MouseEvent }): void {
  const rect = gridElement.value?.getBoundingClientRect()

  emit('slotClick', {
    isAllDay: false,
    day: payload.day,
    start: rect === undefined
      ? null
      : payload.day.toZonedDateTime({
          timeZone: Temporal.Now.timeZoneId(),
        }).add({
          minutes: Math.round(
            props.startHour * 60
            + ((payload.nativeEvent.clientY - rect.top) / rect.height)
            * hourCount.value * 60,
          ),
        }),
  })
}

function onAllDaySlotClick(payload: { day: Temporal.PlainDate
  nativeEvent: MouseEvent }): void {
  emit('slotClick', {
    isAllDay: true,
    day: payload.day,
    start: null,
  })
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

    <div
      ref="scroll"
      class="flex grow flex-col overflow-y-auto"
    >
      <div class="sticky top-0 z-10 bg-white">
        <CalendarWeekHeader
          :week-days="weekDays"
          :today="today"
        />

        <CalendarAllDayRow
          :week-days="weekDays"
          :events="allDayEvents"
          :interactions="interactions"
          :ghost="allDayGhost"
          :dragging-event-id="dragState?.event.allDay === true ? dragState.event.id : null"
          @event-click="onEventClick"
          @gesture-start="onAllDayGestureStart"
          @slot-click="onAllDaySlotClick"
        />
      </div>

      <div class="flex grow">
        <CalendarHourLabels
          :start-hour="props.startHour"
          :end-hour="props.endHour"
        />

        <div
          ref="grid"
          class="grid grow grid-cols-7 border-l border-gray-100"
        >
          <CalendarDayColumn
            v-for="day in weekDays"
            :key="day.toString()"
            :day="day"
            :segments="segmentsForDay(day)"
            :start-hour="props.startHour"
            :end-hour="props.endHour"
            :hour-count="hourCount"
            :is-today="isSameDate(day, today)"
            :interactions="interactions"
            :ghost-range="ghostRangeForDay(day)"
            :draft-range="draftRangeForDay(day)"
            :current-zoned-date-time="currentZonedDateTime"
            @event-click="onEventClick"
            @gesture-start="onGestureStart"
            @slot-click="onTimedSlotClick"
            @slot-gesture-start="onSlotGestureStart"
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

    <CalendarDragCarry
      v-if="carryState !== null && dragState !== null && dragState.kind === 'move'"
      :carry="carryState"
      :event="dragState.event"
      :is-all-day="dragState.event.allDay === true"
      :is-valid="dragState.isValid"
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
    </CalendarDragCarry>
  </div>
</template>
