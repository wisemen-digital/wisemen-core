import type { Temporal } from 'temporal-polyfill'

import type { CalendarEvent } from '@/ui/calendar-week-view/types/calendarEvent.type'

/**
 * Gesture opt-ins. All default to `false` so a calendar that was read-only
 * before editing shipped stays read-only until a consumer asks otherwise.
 */
export interface CalendarInteractions {
  drag: boolean
  resize: boolean
  selectSlot: boolean
}

export type CalendarUpdateSource = 'drag' | 'duplicate' | 'resize-end' | 'resize-start'

export interface CalendarProposedUpdate<TMeta = Record<string, unknown>> {
  end: Temporal.ZonedDateTime
  event: CalendarEvent<TMeta>
  source: CalendarUpdateSource
  start: Temporal.ZonedDateTime
}

/**
 * `false` rejects and reverts the optimistic position. `true`/`void` accepts
 * it. An object accepts with an adjustment. Replaces the `revert()` callback
 * the roadmap sketched: the handler answering is the contract, so there is no
 * state left stranded when a consumer forgets to revert.
 */
export type CalendarUpdateResult
  = | boolean
    | { end?: Temporal.ZonedDateTime
      start?: Temporal.ZonedDateTime }
      | undefined

/** The in-gesture drag-create rectangle. Cleared on commit or cancel. */
export interface CalendarSlotDraft {
  day: Temporal.PlainDate
  end: Temporal.ZonedDateTime
  start: Temporal.ZonedDateTime
}

/** A click is a point, not a range. `start` is null on the all-day row. */
export interface CalendarSlotInfo {
  isAllDay: boolean
  day: Temporal.PlainDate
  start: Temporal.ZonedDateTime | null
}
