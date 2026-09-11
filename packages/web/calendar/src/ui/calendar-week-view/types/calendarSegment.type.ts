import type { Temporal } from 'temporal-polyfill'

import type { CalendarEvent } from '@/ui/calendar-week-view/types/calendarEvent.type'

/**
 * One day's slice of an event. A single-day event yields one segment with
 * both flags true; a cross-midnight or multi-day event yields one per day it
 * touches, capped at the rendered week. Continuation indicators are Phase 3 —
 * `isStart`/`isEnd` carry enough for slot rendering without them.
 */
export interface CalendarSegment<TMeta = Record<string, unknown>> {
  isEnd: boolean
  isStart: boolean
  day: Temporal.PlainDate
  endMin: number
  event: CalendarEvent<TMeta>
  startMin: number
}
