import type { Fact } from '#src/fact.js'
import type { DefaultValueTypes } from '#src/value-types.js'

/**
 * Resolves the runtime value type for a fact definition.
 */
export type RuntimeFactValue<
  TFact extends Fact<string, string, TValueTypes>,
  TValueTypes extends DefaultValueTypes = DefaultValueTypes
> = TValueTypes[TFact['valueType']]

/**
 * Maps fact ids to the runtime values required to execute rules.
 */
export type RuntimeFacts<
  TFacts extends readonly Fact<string, string, TValueTypes>[],
  TValueTypes extends DefaultValueTypes = DefaultValueTypes
> = {
  [TFact in TFacts[number] as TFact['id']]: RuntimeFactValue<TFact, TValueTypes>
}
