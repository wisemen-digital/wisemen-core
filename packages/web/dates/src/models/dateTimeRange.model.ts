import type { DateTimeInstant } from '#models/dateTimeInstant.model.ts'

export type DateTimeInstantWithInfinity = 'infinity' | DateTimeInstant

/**
 * A DateTimeInstantRange represents a range of time between two DateTimeInstants
 */
export interface DateTimeInstantRange {
  from: DateTimeInstant
  until: DateTimeInstant
}

/**
 * A DateTimeInstantRangeWithInfinity represents a range of time between two DateTimeInstants,
 * where the start can be 'infinity' to represent an open-ended range.
 */
export interface DateTimeInstantRangeWithStartInfinity {
  from: DateTimeInstantWithInfinity
  until: DateTimeInstant
}

/**
 * A DateTimeInstantRangeWithInfinity represents a range of time between two DateTimeInstants,
 * where the end can be 'infinity' to represent an open-ended range.
 */
export interface DateTimeInstantRangeWithEndInfinity {
  from: DateTimeInstant
  until: DateTimeInstantWithInfinity
}

/**
 * A DateTimeInstantRangeWithInfinity represents a range of time between two DateTimeInstants,
 * where both the start and end can be 'infinity' to represent an open-ended range.
 */
export interface DateTimeInstantRangeWithInfinity {
  from: DateTimeInstantWithInfinity
  until: DateTimeInstantWithInfinity
}
