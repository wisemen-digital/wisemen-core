import type { DateTimeInstant } from '#models/dateTimeInstant.model.ts'

export type DateTimeInstantWithInfinity = 'infinity' | DateTimeInstant

/**
 * A DateTimeRangeInstant represents a range of time between two DateTimeInstants
 */
export interface DateTimeRangeInstant {
  from: DateTimeInstant
  until: DateTimeInstant
}

/**
 * A DateTimeRangeInstantWithInfinity represents a range of time between two DateTimeInstants,
 * where the start can be 'infinity' to represent an open-ended range.
 */
export interface DateTimeRangeInstantWithStartInfinity {
  from: DateTimeInstantWithInfinity
  until: DateTimeInstant
}

/**
 * A DateTimeRangeInstantWithInfinity represents a range of time between two DateTimeInstants,
 * where the end can be 'infinity' to represent an open-ended range.
 */
export interface DateTimeRangeInstantWithEndInfinity {
  from: DateTimeInstant
  until: DateTimeInstantWithInfinity
}

/**
 * A DateTimeRangeInstantWithInfinity represents a range of time between two DateTimeInstants,
 * where both the start and end can be 'infinity' to represent an open-ended range.
 */
export interface DateTimeRangeInstantWithInfinity {
  from: DateTimeInstantWithInfinity
  until: DateTimeInstantWithInfinity
}
