import { randomUUID } from 'crypto'
import { Raw } from 'typeorm'
import { DateTimeRange } from '#src/date-time-range.js'

export function Precedes (period: DateTimeRange) {
  const paramName = randomUUID().replaceAll('-', '')

  return Raw(
    (alias: string) => `${alias} -|- :${paramName} AND ${alias} < :${paramName}`,
    { [paramName]: period.toString() }
  )
}
