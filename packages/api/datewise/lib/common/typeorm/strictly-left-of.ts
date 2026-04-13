import { randomUUID } from 'crypto'
import { FindOperator, Raw } from 'typeorm'
import { DateRange } from '../../date-range/date-range.js'
import { DateTimeRange } from '../../date-time-range/date-time-range.js'

export function StrictlyLeftOf (range: DateRange): FindOperator<DateRange>
export function StrictlyLeftOf (range: DateTimeRange): FindOperator<DateTimeRange>
export function StrictlyLeftOf (
  range: DateRange | DateTimeRange
): FindOperator<DateRange> | FindOperator<DateTimeRange> {
  const paramName = randomUUID().replaceAll('-', '')

  return Raw(
    (alias: string) => `${alias} << :${paramName}`,
    { [paramName]: range.toString() }
  ) as FindOperator<DateRange> | FindOperator<DateTimeRange>
}
