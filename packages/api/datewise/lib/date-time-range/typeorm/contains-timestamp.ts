import { randomUUID } from 'crypto'
import { FindOperator, Raw } from 'typeorm'
import { DateTimeRange } from '../date-time-range.js'
import { TimestampInput } from '../../timestamp/timestamp.js'
import { timestamp } from '../../timestamp/index.js'

export function ContainsTimestamp (date: TimestampInput): FindOperator<DateTimeRange> {
  const paramName = randomUUID().replaceAll('-', '')

  return Raw(
    (alias: string) => `${alias} @> :${paramName}::timestamptz(3)`,
    { [paramName]: timestamp(date).toISOString() }
  ) as FindOperator<DateTimeRange>
}
