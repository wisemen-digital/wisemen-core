import { randomUUID } from 'crypto'
import { Raw } from 'typeorm'
import { DateTimeRange } from '#src/date-time-range.js'

// Finds database ranges that are immediately succeeded by the given period
export function IsSucceededBy (period: DateTimeRange) {
  const paramName = randomUUID().replaceAll('-', '')

  return Raw(
    (alias: string) => `:${paramName} -|- ${alias} AND :${paramName} > ${alias}`,
    { [paramName]: period.toString() }
  )
}
