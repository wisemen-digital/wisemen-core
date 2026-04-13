import { randomUUID } from 'crypto'
import { Raw } from 'typeorm'
import { DateTimeRange } from '#src/date-time-range.js'

export function OverlapsWith (inPeriod: DateTimeRange) {
  const paramName = randomUUID().replaceAll('-', '')

  return Raw((alias: string) => `${alias} && :${paramName}`, { [paramName]: inPeriod.toString() })
}
