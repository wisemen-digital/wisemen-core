import { Duration, DurationColumn, DurationUnit } from '@wisemen/quantity'
import { Column } from 'typeorm'
import { DateTimeRange } from '../date-time-range/date-time-range.js'
import { PlainTime } from '../plain-time/plain-time.js'
import { PlainDate } from '../plain-date/plain-date.js'
import { Timestamp, timestamp, TimestampColumn } from '../timestamp/index.js'
import { exhaustiveCheck } from '../common/exhaustive-check.helper.js'
import { TimezoneColumn, TimezoneInput } from '../common/timezone.js'
import { DateTimeRangeColumn } from '../date-time-range/typeorm/date-time-range-column.js'
import { PlainDateColumn } from '../plain-date/index.js'
import { PlainTimeColumn } from '../plain-time/index.js'
import { RRuleFrequency as RRuleFrequency, RRuleFrequencyColumn } from './frequency.js'

export type RRule = RRuleImpl

export class RRuleImpl {
  @DateTimeRangeColumn()
  range: DateTimeRange

  @TimezoneColumn()
  timezone: TimezoneInput

  @PlainDateColumn()
  startDate: PlainDate

  @PlainTimeColumn()
  startTime: PlainTime

  @DurationColumn(DurationUnit.SECONDS, {})
  duration: Duration

  @RRuleFrequencyColumn()
  frequency: RRuleFrequency

  @Column({ type: 'int' })
  interval: number

  @TimestampColumn({ array: true })
  exceptions: Timestamp[]

  static create (
    range: DateTimeRange,
    timezone: TimezoneInput,
    startDate: PlainDate,
    startTime: PlainTime,
    duration: Duration,
    frequency: RRuleFrequency,
    interval: number,
    exceptions: Timestamp[]
  ): RRule {
    const rrule = new RRuleImpl()

    rrule.range = range
    rrule.timezone = timezone
    rrule.startDate = startDate
    rrule.startTime = startTime
    rrule.duration = duration
    rrule.frequency = frequency
    rrule.interval = interval
    rrule.exceptions = exceptions

    return rrule
  }

  /** Generate the occurrences during a given range */
  * occurrences (
    during: DateTimeRange = new DateTimeRange(-Infinity, Infinity)
  ): Generator<DateTimeRange> {
    if (!this.range.overlaps(during)) {
      return
    }

    if (this.interval === 0) {
      const occurrenceStart = timestamp(this.startDate, this.startTime, this.timezone)

      if (!this.isExcepted(occurrenceStart)) {
        const occurrenceEnd = occurrenceStart.addDuration(this.duration)
        const occurrenceRange = new DateTimeRange(occurrenceStart, occurrenceEnd, '[)')

        yield occurrenceRange
      }

      return
    }

    const range = this.range.overlap(during)
    const distance = Math.ceil(range.from.diff(this.range.from, this.frequency, true))

    let date = this.startDate.add(distance, this.frequency)
    let occurrenceStart = timestamp(date, this.startTime, this.timezone)

    while (range.contains(occurrenceStart)) {
      if (!this.isExcepted(occurrenceStart)) {
        const occurrenceEnd = occurrenceStart.addDuration(this.duration)
        const occurrenceRange = new DateTimeRange(occurrenceStart, occurrenceEnd, '[)')

        yield occurrenceRange
      }

      date = this.nextDate(date)
      occurrenceStart = timestamp(date, this.startTime, this.timezone)
    }
  }

  private nextDate (date: PlainDate): PlainDate {
    switch (this.frequency) {
      case RRuleFrequency.DAILY: return date.add(this.interval, 'days')
      case RRuleFrequency.WEEKLY: return date.add(this.interval, 'weeks')
      case RRuleFrequency.MONTHLY: return date.add(this.interval, 'months')
      case RRuleFrequency.YEARLY: return date.add(this.interval, 'years')
      default: return exhaustiveCheck(this.frequency)
    }
  }

  private isExcepted (occurrenceStart: Timestamp): boolean {
    return this.exceptions.some(ex => ex.isSame(occurrenceStart))
  }
}
