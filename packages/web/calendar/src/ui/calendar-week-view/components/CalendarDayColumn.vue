<script setup lang="ts" generic="TMeta = Record<string, unknown>">
import type { Temporal } from 'temporal-polyfill'
import { computed } from 'vue'

import CalendarCurrentTimeIndicator from '@/ui/calendar-week-view/components/CalendarCurrentTimeIndicator.vue'
import CalendarEventBlock from '@/ui/calendar-week-view/components/CalendarEventBlock.vue'
import { useCalendarEventOverlap } from '@/ui/calendar-week-view/composables/useCalendarEventOverlap.composable'
import type { CalendarEvent } from '@/ui/calendar-week-view/types/calendarEvent.type'
import type { CalendarInteractions } from '@/ui/calendar-week-view/types/calendarInteraction.type'
import type { CalendarSegment } from '@/ui/calendar-week-view/types/calendarSegment.type'
import { resolveEditability } from '@/ui/calendar-week-view/utils/calendarDragMath.util'
import { clipSegmentToBounds } from '@/ui/calendar-week-view/utils/calendarSegment.util'

const props = defineProps<{
  currentZonedDateTime: Temporal.ZonedDateTime
  isToday: boolean
  day: Temporal.PlainDate
  draftRange: { endMin: number
    startMin: number } | null
  endHour: number
  ghostRange: { isValid: boolean
    endMin: number
    startMin: number } | null
  hourCount: number
  interactions: CalendarInteractions
  segments: CalendarSegment<TMeta>[]
  startHour: number
}>()

const emit = defineEmits<{
  eventClick: [payload: { event: CalendarEvent<TMeta>
    nativeEvent: MouseEvent }]
  gestureStart: [payload: { event: CalendarEvent<TMeta>
    kind: 'move' | 'resize-end' | 'resize-start'
    nativeEvent: PointerEvent }]
  slotClick: [payload: { day: Temporal.PlainDate
    nativeEvent: MouseEvent }]
  slotGestureStart: [payload: { day: Temporal.PlainDate
    nativeEvent: PointerEvent }]
}>()

/**
 * Anything outside the grid's hours is trimmed away before layout: an event
 * running from midnight on a grid that starts at 06:00 would otherwise be
 * positioned at a negative offset and paint over the header.
 */
const visibleSegments = computed<CalendarSegment<TMeta>[]>(() => props.segments
  .map((segment) => clipSegmentToBounds(segment, props.startHour * 60, props.endHour * 60))
  .filter((segment): segment is CalendarSegment<TMeta> => segment !== null))

const {
  layouts,
} = useCalendarEventOverlap<TMeta>(visibleSegments)

const hours = computed<number[]>(() => Array.from(
  {
    length: props.hourCount,
  },
  (_, index) => props.startHour + index,
))

const totalGridMinutes = computed<number>(() => (props.endHour - props.startHour) * 60)

function toTopOffsetPercentage(minutes: number): number {
  return ((minutes - props.startHour * 60) / totalGridMinutes.value) * 100
}

function toHeightPercentage(startMin: number, endMin: number): number {
  return ((endMin - startMin) / totalGridMinutes.value) * 100
}

function editabilityFor(event: CalendarEvent<TMeta>): {
  isDraggable: boolean
  isResizable: boolean
} {
  return resolveEditability(event, props.interactions)
}

function onEventClick(payload: { event: CalendarEvent<TMeta>
  nativeEvent: MouseEvent }): void {
  emit('eventClick', payload)
}

function onGestureStart(payload: { event: CalendarEvent<TMeta>
  kind: 'move' | 'resize-end' | 'resize-start'
  nativeEvent: PointerEvent }): void {
  emit('gestureStart', payload)
}

function onBackgroundPointerDown(nativeEvent: PointerEvent): void {
  if (!props.interactions.selectSlot || nativeEvent.button !== 0) {
    return
  }

  emit('slotGestureStart', {
    day: props.day,
    nativeEvent,
  })
}

function onBackgroundClick(nativeEvent: MouseEvent): void {
  emit('slotClick', {
    day: props.day,
    nativeEvent,
  })
}
</script>

<template>
  <!--
    eslint-disable vuejs-accessibility/click-events-have-key-events
    eslint-disable vuejs-accessibility/no-static-element-interactions
    These backgrounds are grid cells, not controls. Giving each one a role and a
    key handler would add seven tab stops per row, which is the opposite of the
    single-Tab-stop-per-grid model Phase 6 commits to. Keyboard slot selection
    arrives with that roving-focus work, not before it.
  -->
  <div
    :class="props.interactions.selectSlot ? 'touch-none' : ''"
    class="
      relative grow border-r border-gray-100
      last:border-r-0
    "
    @pointerdown="onBackgroundPointerDown"
    @click="onBackgroundClick"
  >
    <div
      v-for="hour in hours"
      :key="hour"
      class="h-(--wui-calendar-hour-height,64px) border-b border-gray-100"
    />

    <div
      v-if="props.draftRange !== null"
      :style="{
        top: `${toTopOffsetPercentage(props.draftRange.startMin)}%`,
        height: `${toHeightPercentage(props.draftRange.startMin, props.draftRange.endMin)}%`,
      }"
      class="
        pointer-events-none absolute inset-x-px rounded-md border border-dashed
        border-blue-400 bg-blue-100/50
      "
    />

    <div
      v-if="props.ghostRange !== null"
      :data-drop-invalid="props.ghostRange.isValid ? undefined : ''"
      :style="{
        top: `${toTopOffsetPercentage(props.ghostRange.startMin)}%`,
        height: `${toHeightPercentage(props.ghostRange.startMin, props.ghostRange.endMin)}%`,
      }"
      class="
        pointer-events-none absolute inset-x-px rounded-md border border-dashed
        border-blue-400 bg-blue-100/40
        data-drop-invalid:border-error-400 data-drop-invalid:bg-error-100/40
      "
    />

    <CalendarEventBlock
      v-for="layout in layouts"
      :key="`${layout.segment.event.id}-${layout.segment.day.toString()}`"
      :event="layout.segment.event"
      :is-draggable="editabilityFor(layout.segment.event).isDraggable"
      :is-end="layout.segment.isEnd"
      :is-resizable="editabilityFor(layout.segment.event).isResizable"
      :is-start="layout.segment.isStart"
      :top-offset-percentage="toTopOffsetPercentage(layout.segment.startMin)"
      :height-percentage="toHeightPercentage(layout.segment.startMin, layout.segment.endMin)"
      :left-percentage="(layout.columnIndex / layout.columnCount) * 100"
      :width-percentage="100 / layout.columnCount"
      @event-click="onEventClick"
      @gesture-start="onGestureStart"
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
