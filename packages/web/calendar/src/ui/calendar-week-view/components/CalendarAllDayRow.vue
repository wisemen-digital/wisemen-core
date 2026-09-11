<script setup lang="ts" generic="TMeta = Record<string, unknown>">
import {
  UIRowLayout,
  UIText,
} from '@wisemen/vue-core-design-system'
import type { Temporal } from 'temporal-polyfill'
import { computed } from 'vue'

import type { CalendarEvent } from '@/ui/calendar-week-view/types/calendarEvent.type'
import type { CalendarInteractions } from '@/ui/calendar-week-view/types/calendarInteraction.type'
import type { CalendarAllDayBar } from '@/ui/calendar-week-view/utils/calendarAllDayBar.util'
import { buildAllDayBars } from '@/ui/calendar-week-view/utils/calendarAllDayBar.util'
import { resolveEditability } from '@/ui/calendar-week-view/utils/calendarDragMath.util'

const props = defineProps<{
  draggingEventId: string | null
  events: CalendarEvent<TMeta>[]
  ghost: { isValid: boolean
    end: Temporal.ZonedDateTime
    event: CalendarEvent<TMeta>
    start: Temporal.ZonedDateTime } | null
  interactions: CalendarInteractions
  weekDays: Temporal.PlainDate[]
}>()

const emit = defineEmits<{
  eventClick: [payload: { event: CalendarEvent<TMeta>
    nativeEvent: MouseEvent }]
  gestureStart: [payload: { event: CalendarEvent<TMeta>
    kind: 'move' | 'resize-end' | 'resize-start'
    nativeEvent: PointerEvent }]
  slotClick: [payload: { day: Temporal.PlainDate
    nativeEvent: MouseEvent }]
}>()

const bars = computed<CalendarAllDayBar<TMeta>[]>(() => buildAllDayBars(
  props.events.filter((event) => event.id !== props.draggingEventId),
  props.weekDays,
))

/** The proposed position, laid out with the same packer as a committed bar. */
const ghostBar = computed<CalendarAllDayBar<TMeta> | null>(() => {
  const ghost = props.ghost

  if (ghost === null) {
    return null
  }

  return buildAllDayBars([
    {
      ...ghost.event,
      end: ghost.end,
      start: ghost.start,
    },
  ], props.weekDays)[0] ?? null
})

const laneCount = computed<number>(() => Math.max(
  1,
  ...bars.value.map((bar) => bar.lane + 1),
  ...(ghostBar.value === null
    ? []
    : [
        ghostBar.value.lane + 1,
      ]),
))

function editabilityFor(event: CalendarEvent<TMeta>): {
  isDraggable: boolean
  isResizable: boolean
} {
  return resolveEditability(event, props.interactions)
}

function onEventClick(event: CalendarEvent<TMeta>, nativeEvent: MouseEvent): void {
  nativeEvent.stopPropagation()

  emit('eventClick', {
    event,
    nativeEvent,
  })
}

function onEventPointerDown(event: CalendarEvent<TMeta>, nativeEvent: PointerEvent): void {
  // All-day bars move between days only. Dragging one into the time grid would
  // silently invent start and end times the user never chose, so crossing the
  // timed/all-day boundary stays an explicit consumer action.
  if (!editabilityFor(event).isDraggable || nativeEvent.button !== 0) {
    return
  }

  nativeEvent.stopPropagation()

  emit('gestureStart', {
    event,
    kind: 'move',
    nativeEvent,
  })
}

function onResizePointerDown(
  event: CalendarEvent<TMeta>,
  nativeEvent: PointerEvent,
  kind: 'resize-end' | 'resize-start',
): void {
  if (nativeEvent.button !== 0) {
    return
  }

  nativeEvent.stopPropagation()

  emit('gestureStart', {
    event,
    kind,
    nativeEvent,
  })
}

function onSlotClick(day: Temporal.PlainDate, nativeEvent: MouseEvent): void {
  emit('slotClick', {
    day,
    nativeEvent,
  })
}
</script>

<template>
  <!--
    eslint-disable vuejs-accessibility/click-events-have-key-events
    eslint-disable vuejs-accessibility/no-static-element-interactions
    The day cells behind the bars are grid cells, not controls — see the same
    note in CalendarDayColumn. Keyboard equivalents arrive with Phase 6.
  -->
  <UIRowLayout
    align="start"
    gap="none"
    class="min-h-8 shrink-0 border-b border-gray-200"
  >
    <UIRowLayout
      align="start"
      justify="end"
      gap="none"
      class="w-16 shrink-0 pt-1 pr-2"
    >
      <UIText
        text="All day"
        class="text-xs text-gray-400"
      />
    </UIRowLayout>

    <div class="relative grow self-stretch border-l border-gray-100">
      <div class="absolute inset-0 grid grid-cols-7">
        <div
          v-for="day in props.weekDays"
          :key="day.toString()"
          class="
            border-r border-gray-100
            last:border-r-0
          "
          @click="onSlotClick(day, $event)"
        />
      </div>

      <div
        :style="{ gridTemplateRows: `repeat(${laneCount}, minmax(0, 1fr))` }"
        class="relative grid grid-cols-7 gap-y-0.5 p-1"
      >
        <UIRowLayout
          v-for="bar in bars"
          :key="bar.event.id"
          :style="{
            gridColumn: `${bar.colStart + 1} / span ${bar.colSpan}`,
            gridRow: `${bar.lane + 1}`,
          }"
          :class="[
            editabilityFor(bar.event).isDraggable ? 'touch-none' : '',
            bar.isStart ? 'ml-px rounded-l-md' : '',
            bar.isEnd ? 'mr-px rounded-r-md' : '',
          ]"
          as="button"
          gap="xs"
          type="button"
          class="
            group/bar relative h-5 truncate border border-blue-200/60 bg-blue-50
            px-1.5 text-left text-xs font-medium text-blue-900
            hover:bg-blue-100
          "
          @click="onEventClick(bar.event, $event)"
          @pointerdown="onEventPointerDown(bar.event, $event)"
        >
          <span class="size-1.5 shrink-0 rounded-full bg-blue-500" />

          <UIText :text="bar.event.title ?? 'Untitled event'" />

          <template v-if="editabilityFor(bar.event).isResizable">
            <span
              v-if="bar.isStart"
              data-slot="calendar-resize-handle"
              class="
                absolute inset-y-1 left-0 w-1.5 cursor-ew-resize touch-none
                rounded-full bg-blue-400/70 opacity-0 transition-opacity
                duration-150
                group-hover/bar:opacity-100
                motion-reduce:transition-none
                pointer-coarse:opacity-100
              "
              @pointerdown="onResizePointerDown(bar.event, $event, 'resize-start')"
            />

            <span
              v-if="bar.isEnd"
              data-slot="calendar-resize-handle"
              class="
                absolute inset-y-1 right-0 w-1.5 cursor-ew-resize touch-none
                rounded-full bg-blue-400/70 opacity-0 transition-opacity
                duration-150
                group-hover/bar:opacity-100
                motion-reduce:transition-none
                pointer-coarse:opacity-100
              "
              @pointerdown="onResizePointerDown(bar.event, $event, 'resize-end')"
            />
          </template>
        </UIRowLayout>

        <div
          v-if="ghostBar !== null && props.ghost !== null"
          :data-drop-invalid="props.ghost.isValid ? undefined : ''"
          :style="{
            gridColumn: `${ghostBar.colStart + 1} / span ${ghostBar.colSpan}`,
            gridRow: `${ghostBar.lane + 1}`,
          }"
          class="
            pointer-events-none h-5 rounded-md border border-dashed
            border-blue-400 bg-blue-100/50
            data-drop-invalid:border-error-400 data-drop-invalid:bg-error-100/40
          "
        />
      </div>
    </div>
  </UIRowLayout>
</template>
