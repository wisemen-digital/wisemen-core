import type { Temporal } from 'temporal-polyfill'

/**
 * A PlainDate represents a calendar date without a time or time zone. It consists of a year, month, and day.
 * The PlainDate type is useful for representing dates in contexts where the time of day and time zone are not relevant,
 * such as birthdays, anniversaries, or historical events.
 */
export type PlainDate = Temporal.PlainDate

export interface PlainDateRange {
  from: PlainDate | null
  until: PlainDate | null
}
