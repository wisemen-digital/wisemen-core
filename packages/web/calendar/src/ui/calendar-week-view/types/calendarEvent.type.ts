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
  /**
   * Overrides `interactions.drag` for this event, in both directions.
   * Ignored when `readOnly` is set.
   */
  draggable?: boolean
  end: Temporal.ZonedDateTime
  /** Excluded from drag and resize regardless of `interactions`. */
  readOnly?: boolean
  /**
   * Overrides `interactions.resize` for this event, in both directions.
   * Ignored when `readOnly` is set.
   */
  resizable?: boolean
  start: Temporal.ZonedDateTime
  meta: TMeta
}
