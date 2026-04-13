import { randomUUID } from 'crypto'
import { FindOperator, Raw } from 'typeorm'
import { DateTimeRange } from '#src/date-time-range.js'

export function ContainsDate (date: Date): FindOperator<DateTimeRange> {
  const paramName = randomUUID().replaceAll('-', '')

  return Raw((alias: string) => `${alias} @> :${paramName}::timestamptz(3)`, { [paramName]: date.toISOString() }) as FindOperator<DateTimeRange>
}
