import { randomUUID } from 'crypto'
import { Raw } from 'typeorm'
import { DateRange } from '#src/date-range.js'

export function OverlapsWith (inPeriod: DateRange) {
  const paramName = randomUUID().replaceAll('-', '')

  return Raw((alias: string) => `${alias} && :${paramName}`, { [paramName]: inPeriod.toString() })
}
