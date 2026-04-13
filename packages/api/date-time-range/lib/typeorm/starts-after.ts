import { randomUUID } from 'crypto'
import { FindOperator, Raw } from 'typeorm'
import { DateTimeRange } from '#src/date-time-range.js'

export function StartsAfter (date: Date): FindOperator<DateTimeRange> {
  const paramName = randomUUID().replaceAll('-', '')
  const range = new DateTimeRange(date, date)

  return Raw((alias: string) => `${alias} >> :${paramName}::tstzrange3`, { [paramName]: range.toString() }) as FindOperator<DateTimeRange>
}
