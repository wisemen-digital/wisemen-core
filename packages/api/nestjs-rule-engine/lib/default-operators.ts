import type { AnyOperator } from '#src/operator.js'
import { DEFAULT_BOOLEAN_OPERATORS } from '#src/value-types/boolean.js'
import { DEFAULT_NUMBER_OPERATORS } from '#src/value-types/number.js'
import { DEFAULT_STRING_OPERATORS } from '#src/value-types/string.js'

/**
 * Built-in operator set used by the engine when no custom operators are supplied.
 */
export const DEFAULT_OPERATORS = [
  ...DEFAULT_BOOLEAN_OPERATORS,
  ...DEFAULT_NUMBER_OPERATORS,
  ...DEFAULT_STRING_OPERATORS
] as const satisfies readonly AnyOperator[]
