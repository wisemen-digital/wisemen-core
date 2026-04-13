import { Duration } from '@wisemen/quantity'
import { TimezoneInput } from '../common/timezone.js'
import { DateTimeRange } from '../date-time-range/date-time-range.js'
import { PlainDate } from '../plain-date/plain-date.js'
import { PlainTime } from '../plain-time/plain-time.js'
import { Timestamp } from '../timestamp/timestamp.js'
import { RRuleFrequency } from './frequency.js'
import { RRule, RRuleImpl } from './rrule.js'

export interface RRuleOptions {
  range: DateTimeRange
  timezone: TimezoneInput
  startDate: PlainDate
  startTime: PlainTime
  duration: Duration
  frequency: RRuleFrequency
  interval: number
  exceptions: Timestamp[]
}

export function factory (options: null): null
export function factory (options: RRuleOptions): RRule
export function factory (options: RRuleOptions | null): RRule | null {
  if (options === null) {
    return null
  }

  return RRuleImpl.create(
    options.range,
    options.timezone,
    options.startDate,
    options.startTime,
    options.duration,
    options.frequency,
    options.interval,
    options.exceptions
  )
}
