import { randomUUID } from 'crypto'
import { FindOperator, Raw } from 'typeorm'
import { DateRange } from '../../date-range/date-range.js'
import { DateTimeRange } from '../../date-time-range/date-time-range.js'

// Finds database ranges that are immediately preceded by the given period
export function IsPrecededBy (period: DateRange): FindOperator<DateRange>
export function IsPrecededBy (period: DateTimeRange): FindOperator<DateTimeRange>
export function IsPrecededBy (
  period: DateRange | DateTimeRange
): FindOperator<DateRange> | FindOperator<DateTimeRange> {
  const paramName = randomUUID().replaceAll('-', '')

  return Raw(
    (alias: string) => `:${paramName} -|- ${alias} AND :${paramName} < ${alias}`,
    { [paramName]: period.toString() }
  ) as FindOperator<DateRange> | FindOperator<DateTimeRange>
}
