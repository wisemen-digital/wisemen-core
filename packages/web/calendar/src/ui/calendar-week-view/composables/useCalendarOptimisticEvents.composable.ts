import type { Temporal } from 'temporal-polyfill'
import type {
  ComputedRef,
  Ref,
} from 'vue'
import {
  computed,
  shallowRef,
  watch,
} from 'vue'

import type { CalendarEvent } from '@/ui/calendar-week-view/types/calendarEvent.type'

interface OptimisticPosition {
  end: Temporal.ZonedDateTime
  start: Temporal.ZonedDateTime
}

/**
 * Holds a dropped event at its new position while the consumer persists it,
 * so a round-trip does not flash the event back to where it was. Cleared the
 * moment the `events` prop changes identity — the consumer either updates the
 * prop or answers `false`, and there is no third state to time out of.
 */
export function useCalendarOptimisticEvents<TMeta = Record<string, unknown>>(
  events: Ref<CalendarEvent<TMeta>[]>,
): {
  clearOptimistic: () => void
  resolvedEvents: ComputedRef<CalendarEvent<TMeta>[]>
  setOptimisticCreated: (event: CalendarEvent<TMeta> | null) => void
  setOptimisticPosition: (id: string, position: OptimisticPosition | null) => void
} {
  const positions = shallowRef(new Map<string, OptimisticPosition>())
  const created = shallowRef<CalendarEvent<TMeta> | null>(null)

  function clearOptimistic(): void {
    if (positions.value.size > 0) {
      positions.value = new Map()
    }

    created.value = null
  }

  watch(events, () => {
    clearOptimistic()
  })

  function setOptimisticPosition(id: string, position: OptimisticPosition | null): void {
    const next = new Map(positions.value)

    if (position === null) {
      next.delete(id)
    }
    else {
      next.set(id, position)
    }

    positions.value = next
  }

  function setOptimisticCreated(event: CalendarEvent<TMeta> | null): void {
    created.value = event
  }

  const resolvedEvents = computed<CalendarEvent<TMeta>[]>(() => {
    const base = events.value.map((event) => {
      const position = positions.value.get(event.id)

      return position === undefined
        ? event
        : {
            ...event,
            end: position.end,
            start: position.start,
          }
    })

    return created.value === null
      ? base
      : [
          ...base,
          created.value,
        ]
  })

  return {
    clearOptimistic,
    resolvedEvents,
    setOptimisticCreated,
    setOptimisticPosition,
  }
}
