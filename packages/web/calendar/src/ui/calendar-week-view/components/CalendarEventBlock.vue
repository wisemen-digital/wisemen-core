<script setup lang="ts" generic="TMeta = Record<string, unknown>">
import type { CalendarEvent } from '@/ui/calendar-week-view/types/calendarEvent.type'

const props = defineProps<{
  event: CalendarEvent<TMeta>
  heightPercentage: number
  leftPercentage: number
  topOffsetPercentage: number
  widthPercentage: number
}>()

const emit = defineEmits<{
  eventClick: [payload: { event: CalendarEvent<TMeta>
    nativeEvent: MouseEvent }]
}>()

function onClick(nativeEvent: MouseEvent): void {
  emit('eventClick', {
    event: props.event,
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
    type="button"
    class="
      absolute flex flex-col items-start overflow-hidden rounded-md border
      border-blue-200/60 bg-blue-50 px-1.5 py-1 text-left text-xs text-blue-900
      hover:bg-blue-100
    "
    @click="onClick"
  >
    <slot
      :event="props.event"
      :height="props.heightPercentage"
      :is-ghost="false"
    >
      <span class="block w-full truncate font-medium">
        {{ props.event.title ?? 'Untitled event' }}
      </span>
    </slot>
  </button>
</template>
