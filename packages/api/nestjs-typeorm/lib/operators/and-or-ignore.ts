import { And, FindOperator } from 'typeorm'

/**
 * Perform a Typeorm `And` operator on a filtered set of given operators.
 * `undefined` operators are ignored.
 * 
 * When no operators would remain, `undefined` is returned.
 * When 1 operator would remain, that operator is returned.
 * When >1 operator would remain, a Typeorm `And` operator is used on the remaining operators.
 * 
 * Typically used when other helper functions and operators can return `undefined`
 */
export function AndOrIgnore<E, W extends FindOperator<E>> (
  ...operators: (W | undefined)[]
): FindOperator<E> | undefined {
  const filteredOperators = operators.filter(o => o !== undefined)

  if(filteredOperators.length === 0) {
    return undefined
  } else if (filteredOperators.length === 1) {
    return filteredOperators[0]
  } else {
    return And(...filteredOperators)
  }
}
