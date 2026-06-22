import { randomUUID } from 'crypto'
import { ObjectLiteral, Raw, FindOperator, SelectQueryBuilder } from 'typeorm'

interface BinaryConditionOptions {
  cast?: string
  negate?: boolean
}

export function binaryRawCondition<T> (
  operator: string,
  value: unknown,
  options?: BinaryConditionOptions
): FindOperator<T> {
  const paramName = randomUUID().replaceAll('-', '')
  const cast = options?.cast === undefined ? '' : `::${options.cast}`

  return Raw((alias: string) => {
    const expression = `${alias} ${operator} :${paramName}${cast}`

    return options?.negate === true ? `NOT (${expression})` : expression
  }, { [paramName]: value }) as FindOperator<T>
}

export function binaryQueryBuilderCondition<T extends ObjectLiteral> (
  column: string,
  operator: string,
  value: unknown,
  options?: BinaryConditionOptions
): (qb: SelectQueryBuilder<T>) => string {
  return (qb: SelectQueryBuilder<T>) => {
    const paramName = randomUUID().replaceAll('-', '')
    const cast = options?.cast === undefined ? '' : `::${options.cast}`

    qb.setParameter(paramName, value)

    const expression = `${column} ${operator} :${paramName}${cast}`

    return options?.negate === true ? `NOT (${expression})` : expression
  }
}
