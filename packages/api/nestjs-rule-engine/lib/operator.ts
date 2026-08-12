import type { DefaultValueTypes } from '#src/value-types.js'

type BaseOperator<
  TOperatorId extends string,
  TLeftValueType extends keyof TValueTypes,
  I18nPath extends string = string,
  TValueTypes extends DefaultValueTypes = DefaultValueTypes
> = {
  /** operator unique identifier */
  id: TOperatorId
  /** i18n key for the name of this operator */
  nameKey?: I18nPath
  /** i18n key for the description of this operator */
  descriptionKey?: I18nPath
  /** the type of the left hand value, used to match compatible facts */
  leftValueType: TLeftValueType
}

/**
 * Configures an operator that only evaluates a left-hand value.
 */
export type UnaryOperator<
  TOperatorId extends string,
  TLeftValueType extends keyof TValueTypes,
  I18nPath extends string = string,
  TValueTypes extends DefaultValueTypes = DefaultValueTypes
> = BaseOperator<TOperatorId, TLeftValueType, I18nPath, TValueTypes> & {
  /** callback to evaluate the operator */
  evaluate: (leftValue: TValueTypes[TLeftValueType]) => boolean
}

/**
 * Configures an operator that compares a left-hand and right-hand value.
 */
export type BinaryOperator<
  TOperatorId extends string,
  TLeftValueType extends keyof TValueTypes,
  TRightValueType extends keyof TValueTypes,
  I18nPath extends string = string,
  TValueTypes extends DefaultValueTypes = DefaultValueTypes
> = BaseOperator<TOperatorId, TLeftValueType, I18nPath, TValueTypes> & {
  /** the type of the right hand value */
  rightValueType: TRightValueType
  /** callback to evaluate the operator */
  evaluate: (
    leftValue: TValueTypes[TLeftValueType],
    rightValue: TValueTypes[TRightValueType]
  ) => boolean
}

/**
 * Configures either a unary or binary operator.
 */
export type Operator<
  TOperatorId extends string,
  TLeftValueType extends keyof TValueTypes,
  TRightValueType extends keyof TValueTypes | undefined = undefined,
  I18nPath extends string = string,
  TValueTypes extends DefaultValueTypes = DefaultValueTypes
> = TRightValueType extends keyof TValueTypes
  ? BinaryOperator<TOperatorId, TLeftValueType, TRightValueType, I18nPath, TValueTypes>
  : UnaryOperator<TOperatorId, TLeftValueType, I18nPath, TValueTypes>

/**
 * Represents any valid operator option shape for a given registry.
 */
export type AnyOperator<
  I18nPath extends string = string,
  TValueTypes extends DefaultValueTypes = DefaultValueTypes
> = {
  [TLeftValueType in keyof TValueTypes]:
    | UnaryOperator<string, TLeftValueType, I18nPath, TValueTypes>
    | {
        [TRightValueType in keyof TValueTypes]:
          BinaryOperator<string, TLeftValueType, TRightValueType, I18nPath, TValueTypes>
      }[keyof TValueTypes]
}[keyof TValueTypes]
