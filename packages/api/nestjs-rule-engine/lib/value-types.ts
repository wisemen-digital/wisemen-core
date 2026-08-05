import { DEFAULT_BOOLEAN_VALUE_TYPE_DEFINITION } from '#src/value-types/boolean.js'
import { DEFAULT_NUMBER_VALUE_TYPE_DEFINITION } from '#src/value-types/number.js'
import { DEFAULT_STRING_VALUE_TYPE_DEFINITION } from '#src/value-types/string.js'

/**
 * Built-in value types available when no custom registry is supplied.
 */
export interface DefaultValueTypes {
  string: string
  number: number
  boolean: boolean
}

/**
 * Describes how a runtime value type is validated, transformed, and documented.
 */
export interface ValueTypeDefinition<
  TValueTypes,
  TValueType extends keyof TValueTypes = keyof TValueTypes
> {
  transformer: (value: unknown) => TValueTypes[TValueType]
  dtoDecorators?: PropertyDecorator[]
}

/**
 * Resolves runtime values and DTO decorators for registered engine value types.
 */
export class ValueTypeRegistry<TValueTypes = DefaultValueTypes> {
  readonly transformers = new Map<keyof TValueTypes, (v: unknown) => TValueTypes[keyof TValueTypes]>()
  readonly dtoDecorators = new Map<keyof TValueTypes, PropertyDecorator[]>()

  /**
   * Resolves an unknown runtime value into the requested registered type.
   */
  resolve<TValueType extends keyof TValueTypes> (
    type: TValueType,
    value: unknown
  ): TValueTypes[TValueType] {
    const transformer = this.transformers.get(type)
    if (transformer === undefined) {
      throw new Error(`value type ${String(type)} was not registered`)
    }

    return transformer(value) as TValueTypes[TValueType]
  }

  /**
   * Returns the decorators used to describe a value type in generated DTOs.
   */
  getDtoDecorators<TValueType extends keyof TValueTypes> (type: TValueType): PropertyDecorator[] {
    return this.dtoDecorators.get(type) ?? []
  }

  /**
   * Registers a value type using a transformer and optional DTO decorators.
   */
  register<TValueType extends keyof TValueTypes> (
    type: TValueType,
    definition: ValueTypeDefinition<TValueTypes, TValueType>
  ): void
  register<TValueType extends keyof TValueTypes> (
    type: TValueType,
    transformer: (value: unknown) => TValueTypes[TValueType]
  ): void
  register<TValueType extends keyof TValueTypes> (
    type: TValueType,
    definitionOrTransformer:
      | ValueTypeDefinition<TValueTypes, TValueType>
      | ((value: unknown) => TValueTypes[TValueType])
  ): void {
    const definition = typeof definitionOrTransformer === 'function'
      ? {
          transformer: definitionOrTransformer,
          dtoDecorators: []
        }
      : definitionOrTransformer

    this.transformers.set(type, definition.transformer)
    this.dtoDecorators.set(type, definition.dtoDecorators ?? [])
  }
}

/**
 * Default registry with built-in string, boolean, and number value types.
 */
export const DEFAULT_VALUE_TYPE_REGISTRY = new ValueTypeRegistry()

DEFAULT_VALUE_TYPE_REGISTRY.register('string', DEFAULT_STRING_VALUE_TYPE_DEFINITION)
DEFAULT_VALUE_TYPE_REGISTRY.register('boolean', DEFAULT_BOOLEAN_VALUE_TYPE_DEFINITION)
DEFAULT_VALUE_TYPE_REGISTRY.register('number', DEFAULT_NUMBER_VALUE_TYPE_DEFINITION)
