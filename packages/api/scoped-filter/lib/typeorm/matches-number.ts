import { NumberFilterCondition } from '#src/number-filter-condition.js'
import { NumberFilter } from '#src/number-filter.js'
import { FindOperator } from 'typeorm'
import { binaryRawCondition } from '#src/typeorm/helpers.js'

export function MatchesNumber (
  filter: NumberFilter | undefined
): FindOperator<number> | undefined {
  if (filter === undefined) {
    return undefined
  }

  switch (filter.condition) {
    case NumberFilterCondition.EQUAL:
      return binaryRawCondition<number>('=', filter.value)
    case NumberFilterCondition.NOT_EQUAL:
      return binaryRawCondition<number>('!=', filter.value)
    case NumberFilterCondition.GREATER_THAN:
      return binaryRawCondition<number>('>', filter.value)
    case NumberFilterCondition.GREATER_THAN_OR_EQUAL:
      return binaryRawCondition<number>('>=', filter.value)
    case NumberFilterCondition.LESS_THAN:
      return binaryRawCondition<number>('<', filter.value)
    case NumberFilterCondition.LESS_THAN_OR_EQUAL:
      return binaryRawCondition<number>('<=', filter.value)
  }
}
