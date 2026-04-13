import { randomUUID } from 'crypto'
import { Raw } from 'typeorm'
import { IntRange } from '#src/int-range.js'

// Finds database ranges that are immediately preceded by the given range
export function IsPrecededBy (range: IntRange) {
  const paramName = randomUUID().replaceAll('-', '')

  return Raw(
    (alias: string) => `:${paramName} -|- ${alias} AND :${paramName} < ${alias}`,
    { [paramName]: range.toString() }
  )
}
