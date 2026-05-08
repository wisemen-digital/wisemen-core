import { randomUUID } from 'crypto'
import { FindOperator, Raw } from 'typeorm'
import { DateRange } from '../../date-range/date-range.js'
import { DateTimeRange } from '../../date-time-range/date-time-range.js'
import { PlainDate } from '../../plain-date/index.js'
import { Timestamp } from '../../timestamp/timestamp.js'

/**
 * Checks wether a plain date lies in the given date range with the `<@` operator.
 */
export function ContainedIn (period: DateRange): FindOperator<PlainDate>
/**
 * Checks wether a timestamp lies in the given date time range with the `<@` operator.
 */
export function ContainedIn (period: DateTimeRange): FindOperator<Timestamp>
export function ContainedIn (
  period: DateRange | DateTimeRange
): FindOperator<PlainDate> | FindOperator<Timestamp> {
  const paramName = randomUUID().replaceAll('-', '')

  let type: string
  if(period instanceof DateRange) {
    type = 'daterange'
  } else {
    type = 'tstzrange3'
  }

  return Raw(
    (alias: string) => `${alias} <@ :${paramName}::${type}`,
    { [paramName]: period.toString() }
  ) as FindOperator<PlainDate> | FindOperator<Timestamp>
}
