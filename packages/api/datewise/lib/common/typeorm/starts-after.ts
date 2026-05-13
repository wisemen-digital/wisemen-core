import { randomUUID } from 'crypto'
import { FindOperator, Raw } from 'typeorm'
import { DateTimeRange } from '../../date-time-range/date-time-range.js'
import { DateRange } from '../../date-range/date-range.js'
import { PlainDate } from '#src/plain-date/index.js'
import { isPlainDate } from '#src/plain-date/is-plain-date.js'
import { isTimestamp } from '#src/timestamp/is-timestamp.js'
import { Timestamp } from '#src/timestamp/timestamp.js'

/** 
 * Checks if a range starts after the given range with the `>>` operator. 
 */
export function StartsAfter (date: PlainDate): FindOperator<DateRange>
export function StartsAfter (ts: Timestamp | Date): FindOperator<DateTimeRange>
export function StartsAfter (
  value: PlainDate | Timestamp | Date
): FindOperator<DateRange> | FindOperator<DateTimeRange> {
  let range: DateTimeRange | DateRange
  if(isPlainDate(value)) {
    range = new DateRange(value, value)
  } else if (isTimestamp(value) || value instanceof Date) {
    range = new DateTimeRange(value, value, '[]')
  } else {
    throw new Error('invalid argument, expected plain date, timestamp or date')
  }


  const paramName = randomUUID().replaceAll('-', '')

  let cast: string 
  if(range instanceof DateRange) {
    cast = 'daterange'
  } else {
    cast = 'tstzrange3'
  }

  return Raw(
    (alias: string) => `${alias} >> :${paramName}::${cast}`,
    { [paramName]: range.toString() }
  ) as FindOperator<DateRange> | FindOperator<DateTimeRange>
}
