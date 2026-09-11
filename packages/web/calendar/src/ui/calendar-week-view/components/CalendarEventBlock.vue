<script setup lang="ts" generic="TMeta = Record<string, unknown>">
import type { CalendarEvent } from '@/ui/calendar-week-view/types/calendarEvent.type'

const props = defineProps<{
  isDraggable: boolean
  isEnd: boolean
  isResizable: boolean
  isStart: boolean
  event: CalendarEvent<TMeta>
  heightPercentage: number
  leftPercentage: number
  topOffsetPercentage: number
  widthPercentage: number
}>()

const emit = defineEmits<{
  eventClick: [payload: { event: CalendarEvent<TMeta>
    nativeEvent: MouseEvent }]
  gestureStart: [payload: { event: CalendarEvent<TMeta>
    kind: 'move' | 'resize-end' | 'resize-start'
    nativeEvent: PointerEvent }]
}>()

function onClick(nativeEvent: MouseEvent): void {
  // The column background behind this block is itself a slot-click and
  // slot-drag target; without stopping here, clicking or dragging an event
  // also starts selecting the empty space underneath it.
  nativeEvent.stopPropagation()

  emit('eventClick', {
    event: props.event,
    nativeEvent,
  })
}

function onPointerDown(nativeEvent: PointerEvent): void {
  if (!props.isDraggable || nativeEvent.button !== 0) {
    return
  }

  nativeEvent.stopPropagation()

  emit('gestureStart', {
    event: props.event,
    kind: 'move',
    nativeEvent,
  })
}

function onResizePointerDown(
  nativeEvent: PointerEvent,
  kind: 'resize-end' | 'resize-start',
): void {
  if (nativeEvent.button !== 0) {
    return
  }

  nativeEvent.stopPropagation()

  emit('gestureStart', {
    event: props.event,
    kind,
    nativeEvent,
  })
}
</script>

<template>
  <button
    :style="{
      top: `${props.topOffsetPercentage}%`,
      height: `${props.heightPercentage}%`,
      left: `calc(${props.leftPercentage}% + 1px)`,
      width: `calc(${props.widthPercentage}% - 2px)`,
    }"
    :class="[
      props.isDraggable ? 'touch-none' : '',
      props.isStart ? 'rounded-t-md' : '',
      props.isEnd ? 'rounded-b-md' : '',
    ]"
    type="button"
    class="
      group/event absolute flex flex-col items-start overflow-hidden border
      border-blue-200/60 bg-blue-50 px-1.5 py-1 text-left text-xs text-blue-900
      hover:bg-blue-100
    "
    @click="onClick"
    @pointerdown="onPointerDown"
  >
    <slot
      :event="props.event"
      :height="props.heightPercentage"
      :is-end="props.isEnd"
      :is-ghost="false"
      :is-start="props.isStart"
    >
      <span class="block w-full truncate font-medium">
        {{ props.event.title ?? 'Untitled event' }}
      </span>
    </slot>

    <template v-if="props.isResizable">
      <span
        v-if="props.isStart"
        data-slot="calendar-resize-handle"
        class="
          absolute inset-x-1 top-0 h-1.5 cursor-ns-resize touch-none
          rounded-full bg-blue-400/70 opacity-0 transition-opacity duration-150
          group-hover/event:opacity-100
          motion-reduce:transition-none
          pointer-coarse:opacity-100
        "
        @pointerdown="onResizePointerDown($event, 'resize-start')"
      />

      <span
        v-if="props.isEnd"
        data-slot="calendar-resize-handle"
        class="
          absolute inset-x-1 bottom-0 h-1.5 cursor-ns-resize touch-none
          rounded-full bg-blue-400/70 opacity-0 transition-opacity duration-150
          group-hover/event:opacity-100
          motion-reduce:transition-none
          pointer-coarse:opacity-100
        "
        @pointerdown="onResizePointerDown($event, 'resize-end')"
      />
    </template>
  </button>
</template>
