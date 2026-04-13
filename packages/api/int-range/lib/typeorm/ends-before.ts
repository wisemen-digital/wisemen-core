import { randomUUID } from 'crypto'
import { FindOperator, Raw } from 'typeorm'
import { IntRange } from '#src/int-range.js'

export function EndsBefore (value: number): FindOperator<IntRange> {
  const paramName = randomUUID().replaceAll('-', '')
  const range = new IntRange(value, value)

  return Raw((alias: string) => `${alias} << :${paramName}::int8range`, { [paramName]: range.toString() }) as FindOperator<IntRange>
}
