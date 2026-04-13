import { randomUUID } from 'crypto'
import { Raw } from 'typeorm'
import { IntRange } from '#src/int-range.js'

export function OverlapsWith (inRange: IntRange) {
  const paramName = randomUUID().replaceAll('-', '')

  return Raw((alias: string) => `${alias} && :${paramName}`, { [paramName]: inRange.toString() })
}
