import { exhaustiveCheck } from '#src/exhaustive-check.helper.js'
import type { Fact } from '#src/fact.js'
import type { RuntimeFacts } from '#src/runtime-fact.js'
import type { RunTimeValue } from '#src/runtime-value.js'
import type { DefaultValueTypes } from '#src/value-types.js'
import { ValueTypeRegistry } from '#src/value-types.js'

/**
 * Resolves runtime values against the registered value types and current facts.
 */
export class Almanac<TValueTypes extends DefaultValueTypes = DefaultValueTypes> {
  constructor(
    readonly registry: ValueTypeRegistry<TValueTypes>,
    readonly factDefinitions: Map<string, Fact<string, string, TValueTypes>>,
    readonly factValues: RuntimeFacts<Fact<string,string, TValueTypes>[], TValueTypes>
  ) {}

  /**
   * Resolves a runtime value into the typed value expected by an operator or event.
   */
  resolve<TValueType extends keyof TValueTypes>(
    type: TValueType,
    runtimeValue: RunTimeValue
  ): TValueTypes[TValueType] {
    const valueType = runtimeValue.type
    switch (valueType) {
      case 'fact': {
        const fact = this.factDefinitions.get(runtimeValue.factId)
        if (fact === undefined) {
          throw new Error(`fact ${runtimeValue.factId} not found`)
        }

        if (fact.valueType !== type) {
          throw new Error(`value type mismatch`)
        }

        return this.registry.resolve(type, this.factValues[runtimeValue.factId as keyof typeof this.factValues])
      }
      case 'value':
        return this.registry.resolve(type, runtimeValue.value)
      default:
        return exhaustiveCheck(valueType)
    }
  }
}
