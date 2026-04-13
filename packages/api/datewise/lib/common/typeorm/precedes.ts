import { randomUUID } from 'crypto'
import { FindOperator, Raw } from 'typeorm'
import { DateRange } from '../../date-range/date-range.js'
import { DateTimeRange } from '../../date-time-range/date-time-range.js'

export function Precedes (period: DateTimeRange): FindOperator<DateTimeRange>
export function Precedes (period: DateRange): FindOperator<DateRange>
export function Precedes (
  period: DateRange | DateTimeRange
): FindOperator<DateRange> | FindOperator<DateTimeRange> {
  const paramName = randomUUID().replaceAll('-', '')

  return Raw(
    (alias: string) => `${alias} -|- :${paramName} AND ${alias} < :${paramName}`,
    { [paramName]: period.toString() }
  ) as FindOperator<DateRange> | FindOperator<DateTimeRange>
}
