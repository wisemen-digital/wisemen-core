<script setup lang="ts" generic="TMeta = Record<string, unknown>">
import {
  UIColumnLayout,
  UIRowLayout,
  UIText,
} from '@wisemen/vue-core-design-system'

import type { CalendarEvent } from '@/ui/calendar-week-view/types/calendarEvent.type'

const props = defineProps<{
  isAllDay: boolean
  isValid: boolean
  carry: { height: number
    width: number
    x: number
    y: number }
  event: CalendarEvent<TMeta>
}>()
</script>

<template>
  <!--
    Rendered in place rather than cloned or teleported. ReUI hand-clones the
    DOM node to dodge a React re-render per frame, but binding one transform
    to a shallowRef is already a direct style write in Vue, and rendering it
    normally lets the carry honour the consumer's #event slot.

    Not teleported to <body>: the design system scopes its colour custom
    properties, so a carry outside that subtree loses every themed colour and
    paints black. `position: fixed` already escapes the calendar root's
    `overflow-hidden` on its own — the teleport bought nothing and cost the
    theme.

    No transition of any kind: anything that eases here trails the pointer.
  -->
  <Component
    :is="props.isAllDay ? UIRowLayout : UIColumnLayout"
    :align="props.isAllDay ? 'center' : 'start'"
    :gap="props.isAllDay ? 'xs' : 'none'"
    :data-drop-invalid="props.isValid ? undefined : ''"
    :style="{
      height: `${props.carry.height}px`,
      width: `${props.carry.width}px`,
      transform: `translate3d(${Math.round(props.carry.x)}px, ${Math.round(props.carry.y)}px, 0)`,
    }"
    :class="props.isAllDay ? 'font-medium' : 'py-1'"
    class="
      pointer-events-none fixed top-0 left-0 z-100 overflow-hidden rounded-md
      border border-blue-200/60 bg-blue-50 px-1.5 text-left text-xs
      text-blue-900 opacity-90 shadow-md will-change-transform
      data-drop-invalid:border-error-400 data-drop-invalid:ring-1
      data-drop-invalid:ring-error-400/60
    "
  >
    <slot
      :event="props.event"
      :height="props.carry.height"
      :is-end="true"
      :is-ghost="true"
      :is-start="true"
    >
      <!--
        An all-day bar is 20px tall and lays its content out horizontally with
        a leading dot; the timed block stacks and pads vertically. Carrying the
        timed look into a bar-sized box clips the title, so the carry mirrors
        whichever shape it was picked up from.
      -->
      <span
        v-if="props.isAllDay"
        class="size-1.5 shrink-0 rounded-full bg-blue-500"
      />

      <UIText
        :text="props.event.title ?? 'Untitled event'"
        class="w-full font-medium"
      />
    </slot>
  </Component>
</template>
