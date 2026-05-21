import { randomUUID } from 'crypto'
import { FindOperator, Raw } from 'typeorm'
import { DateTimeRange } from '../../date-time-range/date-time-range.js'
import { DateRange } from '../../date-range/date-range.js'
import { PlainDate } from '#src/plain-date/index.js'
import { isPlainDate } from '#src/plain-date/is-plain-date.js'
import { isTimestamp } from '#src/timestamp/is-timestamp.js'
import { Timestamp } from '#src/timestamp/timestamp.js'

/** 
 * Checks if a range ends before the given range with the `<<` operator. 
 */
export function EndsBefore (date: PlainDate): FindOperator<DateRange>
export function EndsBefore (ts: Timestamp | Date): FindOperator<DateTimeRange>
export function EndsBefore (
  timestamp: PlainDate | Timestamp | Date
): FindOperator<DateRange> | FindOperator<DateTimeRange> {
  let range: DateTimeRange | DateRange
  if (isPlainDate(timestamp)) {
    range = new DateRange(timestamp, timestamp)
  } else if (isTimestamp(timestamp) || timestamp instanceof Date) {
    range = new DateTimeRange(timestamp, timestamp, '[]')
  } else {
    throw new Error('invalid argument, expected plain date, timestamp or date')
  }

  const paramName = randomUUID().replaceAll('-', '')

  let cast: string
  if (range instanceof DateRange) {
    cast = 'daterange'
  } else {
    cast = 'tstzrange3'
  }

  return Raw(
    (alias: string) => `${alias} << :${paramName}::${cast}`,
    { [paramName]: range.toString() }
  ) as FindOperator<DateRange> | FindOperator<DateTimeRange>
}
