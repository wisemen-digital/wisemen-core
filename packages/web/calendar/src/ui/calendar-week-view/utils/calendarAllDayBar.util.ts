import { Temporal } from 'temporal-polyfill'

import type { CalendarEvent } from '@/ui/calendar-week-view/types/calendarEvent.type'

/**
 * One all-day event's horizontal bar across the visible week. `colStart` and
 * `colSpan` are indices into the rendered days; `lane` stacks bars that share
 * a day. `isStart`/`isEnd` are false when the event continues outside the
 * week, so no resize handle is offered on an edge the grid invented.
 */
export interface CalendarAllDayBar<TMeta = Record<string, unknown>> {
  isEnd: boolean
  isStart: boolean
  colSpan: number
  colStart: number
  event: CalendarEvent<TMeta>
  lane: number
}

/**
 * Last day an all-day event occupies. `end` is exclusive, so an event ending
 * at midnight belongs to the previous day; a zero-length or inverted range
 * collapses to a single day rather than vanishing.
 */
export function lastOccupiedDay(event: Pick<CalendarEvent, 'end' | 'start'>): Temporal.PlainDate {
  if (Temporal.ZonedDateTime.compare(event.end, event.start) <= 0) {
    return event.start.toPlainDate()
  }

  return event.end.subtract({
    nanoseconds: 1,
  }).toPlainDate()
}

export function buildAllDayBars<TMeta = Record<string, unknown>>(
  events: CalendarEvent<TMeta>[],
  weekDays: Temporal.PlainDate[],
): CalendarAllDayBar<TMeta>[] {
  const firstDay = weekDays[0]
  const lastDay = weekDays.at(-1)

  if (firstDay === undefined || lastDay === undefined) {
    return []
  }

  const bars: Omit<CalendarAllDayBar<TMeta>, 'lane'>[] = []

  for (const event of events) {
    const startDay = event.start.toPlainDate()
    const endDay = lastOccupiedDay(event)

    if (Temporal.PlainDate.compare(endDay, firstDay) < 0
      || Temporal.PlainDate.compare(startDay, lastDay) > 0) {
      continue
    }

    const colStart = Math.max(
      firstDay.until(startDay).total({
        unit: 'days',
      }),
      0,
    )
    const colEnd = Math.min(
      firstDay.until(endDay).total({
        unit: 'days',
      }),
      weekDays.length - 1,
    )

    bars.push({
      isEnd: Temporal.PlainDate.compare(endDay, lastDay) <= 0,
      isStart: Temporal.PlainDate.compare(startDay, firstDay) >= 0,
      colSpan: colEnd - colStart + 1,
      colStart,
      event,
    })
  }

  bars.sort((a, b) => a.colStart - b.colStart || b.colSpan - a.colSpan)

  // Greedy first-fit lanes: a lane is free once its last bar has ended.
  const laneEndColumns: number[] = []

  return bars.map((bar) => {
    const freeLane = laneEndColumns.findIndex((endColumn) => endColumn < bar.colStart)
    const lane = freeLane === -1 ? laneEndColumns.length : freeLane

    laneEndColumns[lane] = bar.colStart + bar.colSpan - 1

    return {
      ...bar,
      lane,
    }
  })
}
