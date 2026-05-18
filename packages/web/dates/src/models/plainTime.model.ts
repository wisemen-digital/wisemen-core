import type { Temporal } from 'temporal-polyfill'

/**
 * A PlainTime represents a time of day without a date or time zone. It consists of hours, minutes, seconds,
 * and optional fractional seconds.
 * The PlainTime type is useful for representing times in contexts where the date and time zone are not relevant,
 * such as opening hours, appointment times, or time-based events.
 */
export type PlainTime = Temporal.PlainTime
