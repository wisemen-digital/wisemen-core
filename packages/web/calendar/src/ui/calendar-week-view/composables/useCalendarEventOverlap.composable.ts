import { Temporal } from 'temporal-polyfill'
import type {
  ComputedRef,
  Ref,
} from 'vue'
import { computed } from 'vue'

import type { CalendarEvent } from '@/ui/calendar-week-view/types/calendarEvent.type'

export interface CalendarEventLayout<TMeta = Record<string, unknown>> {
  columnCount: number
  columnIndex: number
  event: CalendarEvent<TMeta>
}

function eventsOverlap(a: {
  end: Temporal.ZonedDateTime
  start: Temporal.ZonedDateTime
}, b: {
  end: Temporal.ZonedDateTime
  start: Temporal.ZonedDateTime
}): boolean {
  return Temporal.ZonedDateTime.compare(a.start, b.end) < 0
    && Temporal.ZonedDateTime.compare(b.start, a.end) < 0
}

/**
 * ADR 0005: a fresh, deliberately simple greedy layout — not the
 * taxi-hendriks algorithm. Events are grouped into overlap clusters
 * (connected via any pairwise time overlap), then each cluster is split
 * into equal-width columns via first-fit-by-start-time column assignment.
 */
export function layoutOverlappingEvents<TMeta = Record<string, unknown>>(
  events: CalendarEvent<TMeta>[],
): CalendarEventLayout<TMeta>[] {
  const sortedEvents = [
    ...events,
  ].sort(
    (a, b) => Temporal.ZonedDateTime.compare(a.start, b.start),
  )

  const clusters: CalendarEvent<TMeta>[][] = []

  for (const event of sortedEvents) {
    const overlappingCluster = clusters.find((cluster) => cluster.some(
      (clusterEvent) => eventsOverlap(clusterEvent, event),
    ))

    if (overlappingCluster !== undefined) {
      overlappingCluster.push(event)
    }
    else {
      clusters.push([
        event,
      ])
    }
  }

  const layouts: CalendarEventLayout<TMeta>[] = []

  for (const cluster of clusters) {
    const columnEndTimes: Temporal.ZonedDateTime[] = []
    const eventColumnIndices = new Map<CalendarEvent<TMeta>, number>()

    for (const event of cluster) {
      const freeColumnIndex = columnEndTimes.findIndex(
        (columnEndTime) => Temporal.ZonedDateTime.compare(columnEndTime, event.start) <= 0,
      )

      if (freeColumnIndex === -1) {
        columnEndTimes.push(event.end)
        eventColumnIndices.set(event, columnEndTimes.length - 1)
      }
      else {
        columnEndTimes[freeColumnIndex] = event.end
        eventColumnIndices.set(event, freeColumnIndex)
      }
    }

    const columnCount = columnEndTimes.length

    for (const event of cluster) {
      layouts.push({
        columnCount,
        columnIndex: eventColumnIndices.get(event)!,
        event,
      })
    }
  }

  return layouts
}

export function useCalendarEventOverlap<TMeta = Record<string, unknown>>(
  dayEvents: Ref<CalendarEvent<TMeta>[]>,
): {
  layouts: ComputedRef<CalendarEventLayout<TMeta>[]>
} {
  const layouts = computed<CalendarEventLayout<TMeta>[]>(
    () => layoutOverlappingEvents(dayEvents.value),
  )

  return {
    layouts,
  }
}
