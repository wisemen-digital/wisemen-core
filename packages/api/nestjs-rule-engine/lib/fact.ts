import type { DefaultValueTypes } from '#src/value-types.js'

/**
 * Narrows a fact to one of the registered engine value types.
 */
export type FactValueType<TValueTypes extends DefaultValueTypes = DefaultValueTypes> = keyof TValueTypes

/**
 * Configures a fact that can be provided at rule evaluation time.
 */
export type Fact<
  TFactId extends string = string,
  I18nPath extends string = string,
  TValueTypes extends DefaultValueTypes = DefaultValueTypes
> = {
  /** fact unique identifier */
  id: TFactId

  /** i18n key for the name of this fact */
  nameKey?: I18nPath

  /** i18n key for the description of this fact */
  descriptionKey?: I18nPath
  /** the type of value, used to match compatible operators */
  valueType: FactValueType<TValueTypes>
}
