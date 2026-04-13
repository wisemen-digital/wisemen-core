import { randomUUID } from 'crypto'
import { FindOperator, Raw } from 'typeorm'
import { DateTimeRange } from '../../date-time-range/date-time-range.js'
import { DateRange } from '../../date-range/date-range.js'

export function StartsAfter (range: DateRange): FindOperator<DateRange>
export function StartsAfter (range: DateTimeRange): FindOperator<DateTimeRange>
export function StartsAfter (
  range: DateRange | DateTimeRange
): FindOperator<DateRange> | FindOperator<DateTimeRange> {
  const paramName = randomUUID().replaceAll('-', '')

  return Raw(
    (alias: string) => `${alias} >> :${paramName}::tstzrange3`,
    { [paramName]: range.toString() }
  ) as FindOperator<DateRange> | FindOperator<DateTimeRange>
}
