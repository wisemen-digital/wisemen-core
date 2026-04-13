import { randomUUID } from 'crypto'
import { FindOperator, Raw } from 'typeorm'
import { IntRange } from '#src/int-range.js'

export function ContainsValue (value: number): FindOperator<IntRange> {
  const paramName = randomUUID().replaceAll('-', '')

  return Raw((alias: string) => `${alias} @> :${paramName}::int8`, { [paramName]: value }) as FindOperator<IntRange>
}
