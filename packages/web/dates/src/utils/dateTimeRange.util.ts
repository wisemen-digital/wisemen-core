import { Temporal } from 'temporal-polyfill'

import type { DateTimeInstant } from '#models/dateTimeInstant.model.ts'
import type {
  DateTimeRangeInstant,
  DateTimeRangeInstantWithInfinity,
} from '#models/dateTimeRange.model.ts'

export class DateTimeRangeUtil {
  static getStateInRange(
    date: DateTimeInstant,
    range: DateTimeRangeInstant | DateTimeRangeInstantWithInfinity,
  ): 'after' | 'before' | 'in' {
    if (this.isBeforeRange(date, range)) {
      return 'before'
    }

    if (this.isAfterRange(date, range)) {
      return 'after'
    }

    return 'in'
  }

  static isAfterRange(
    value: DateTimeInstant,
    range: DateTimeRangeInstant | DateTimeRangeInstantWithInfinity,
  ): boolean {
    const {
      until,
    } = range

    if (until === 'infinity') {
      return false
    }

    return Temporal.Instant.compare(value, until) > 0
  }

  static isBeforeRange(
    value: DateTimeInstant,
    range: DateTimeRangeInstant | DateTimeRangeInstantWithInfinity,
  ): boolean {
    const {
      from,
    } = range

    if (from === 'infinity') {
      return false
    }

    return Temporal.Instant.compare(value, from) < 0
  }

  static isInRange(
    value: DateTimeInstant,
    range: DateTimeRangeInstant | DateTimeRangeInstantWithInfinity,
  ): boolean {
    return !this.isBeforeRange(value, range) && !this.isAfterRange(value, range)
  }
}
