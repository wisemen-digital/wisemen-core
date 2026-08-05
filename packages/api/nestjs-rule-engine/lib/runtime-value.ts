/**
 * References a runtime fact by id.
 */
export type ResolvedValue = { type: 'fact', factId: string }

/**
 * Carries a literal runtime value.
 */
export type InputValue = { type: 'value', value: unknown }

/**
 * Describes a runtime value that is either literal input or a fact reference.
 */
export type RunTimeValue =
  | ResolvedValue
  | InputValue
