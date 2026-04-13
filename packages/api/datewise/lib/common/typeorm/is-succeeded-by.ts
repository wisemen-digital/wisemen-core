import { randomUUID } from 'crypto'
import { FindOperator, Raw } from 'typeorm'
import { DateRange } from '../../date-range/date-range.js'
import { DateTimeRange } from '../../date-time-range/date-time-range.js'

// Finds database ranges that are immediately succeeded by the given period
export function IsSucceededBy (period: DateRange): FindOperator<DateRange>
export function IsSucceededBy (period: DateTimeRange): FindOperator<DateTimeRange>
export function IsSucceededBy (
  period: DateRange | DateTimeRange
): FindOperator<DateRange> | FindOperator<DateTimeRange> {
  const paramName = randomUUID().replaceAll('-', '')

  return Raw(
    (alias: string) => `:${paramName} -|- ${alias} AND :${paramName} > ${alias}`,
    { [paramName]: period.toString() }
  ) as FindOperator<DateRange> | FindOperator<DateTimeRange>
}
