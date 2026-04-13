import { Duration, DurationUnit } from '@wisemen/quantity'
import { DateTimeRange } from '../date-time-range/date-time-range.js'
import { PlainDate } from '../plain-date/plain-date.js'
import { PlainTime } from '../plain-time/plain-time.js'
import { TimezoneInput } from '../common/timezone.js'
import { timestamp } from '../timestamp/index.js'
import { RRule, RRuleImpl } from './rrule.js'
import { RRuleFrequency } from './frequency.js'

export interface RRuleOnceOptions {
  startDate: PlainDate
  startTime: PlainTime
  duration: Duration
  timezone: TimezoneInput
}

export function once (range: DateTimeRange): RRule
export function once (options: RRuleOnceOptions): RRule
export function once (options: RRuleOnceOptions | DateTimeRange): RRule {
  if (options instanceof DateTimeRange) {
    return rruleFromRange(options)
  }

  const start = timestamp(options.startDate, options.startTime, options.timezone)
  const end = start.addDuration(options.duration)
  const range = new DateTimeRange(start, end)

  return RRuleImpl.create(
    range,
    options.timezone,
    options.startDate,
    options.startTime,
    options.duration,
    RRuleFrequency.DAILY,
    0,
    []
  )
}

function rruleFromRange (range: DateTimeRange): RRule {
  const utcStart = range.from.setTimezone('UTC')

  return RRuleImpl.create(
    range,
    'UTC',
    utcStart.toPlainDate(),
    utcStart.toPlainTime(),
    new Duration(range.hours, DurationUnit.HOURS),
    RRuleFrequency.DAILY,
    0,
    []
  )
}
