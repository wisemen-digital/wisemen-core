import { randomUUID } from 'crypto'
import { Raw } from 'typeorm'
import { DateRange } from '#src/date-range.js'

export function AdjacentAfter (period: DateRange) {
  const paramName = randomUUID().replaceAll('-', '')

  return Raw(
    (alias: string) => `${alias} -|- :${paramName} AND ${alias} > :${paramName}`,
    { [paramName]: period.toString() }
  )
}
