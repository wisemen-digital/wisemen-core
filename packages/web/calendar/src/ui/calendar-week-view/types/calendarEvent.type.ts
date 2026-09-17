import type { Temporal } from 'temporal-polyfill'

export interface CalendarEvent<TMeta = Record<string, unknown>> {
  id: string
  /**
   * Identifies the underlying recurring definition. Reserved, unused until
   * recurrence ships — see ADR 0004.
   */
  itemId?: string
  /**
   * Identifies this specific rendered instance. Reserved, unused until
   * recurrence ships — see ADR 0004.
   */
  occurrenceId?: string
  title?: string
  allDay?: boolean
  end: Temporal.ZonedDateTime
  start: Temporal.ZonedDateTime
  meta: TMeta
}
