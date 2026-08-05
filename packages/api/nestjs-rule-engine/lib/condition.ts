import { Almanac } from '#src/almanac.js'
import type { AnyOperator } from '#src/operator.js'
import type { RunTimeValue } from '#src/runtime-value.js'
import type { DefaultValueTypes } from '#src/value-types.js'

type UnaryOperator<TValueTypes extends DefaultValueTypes = DefaultValueTypes>
  = Exclude<AnyOperator<string, TValueTypes>, { rightValueType: PropertyKey }>
type BinaryOperator<TValueTypes extends DefaultValueTypes = DefaultValueTypes>
  = Extract<AnyOperator<string, TValueTypes>, { rightValueType: keyof TValueTypes }>

/**
 * Evaluates to `true` when every nested condition matches.
 */
export interface AllConditionOptions {
  type: 'all'
  conditions: ConditionOptions[]
}

/**
 * Evaluates to `true` when at least one nested condition matches.
 */
export interface AnyConditionOptions {
  type: 'any'
  conditions: ConditionOptions[]
}

/**
 * Inverts the result of a nested condition.
 */
export interface NotConditionOptions {
  type: 'not'
  condition: ConditionOptions
}

/**
 * Configures a unary operator condition.
 */
export interface UnaryOperatorConditionOptions {
  type: 'operator'
  leftValue: RunTimeValue
  operatorId: string
  rightValue?: never
}

/**
 * Configures a binary operator condition.
 */
export interface BinaryOperatorConditionOptions {
  type: 'operator'
  leftValue: RunTimeValue
  rightValue: RunTimeValue
  operatorId: string
}

/**
 * Configures an operator-based condition.
 */
export type OperatorConditionOptions =
  | UnaryOperatorConditionOptions
  | BinaryOperatorConditionOptions

/**
 * Configures any supported condition tree node.
 */
export type ConditionOptions =
  | AllConditionOptions
  | AnyConditionOptions
  | NotConditionOptions
  | OperatorConditionOptions

/**
 * Rehydrates condition classes from serialized condition options.
 */
export class ConditionFactory {
  /**
   * Creates a condition tree from its JSON representation.
   */
  static create<TValueTypes extends DefaultValueTypes = DefaultValueTypes> (
    options: ConditionOptions
  ): Condition<TValueTypes> {
    switch (options.type) {
      case 'all':
        return new AllCondition<TValueTypes>(options.conditions.map(c => this.create<TValueTypes>(c)))
      case 'any':
        return new AnyCondition<TValueTypes>(options.conditions.map(c => this.create<TValueTypes>(c)))
      case 'not':
        return new NotCondition<TValueTypes>(this.create<TValueTypes>(options.condition))
      case 'operator':
        return new OperatorCondition<TValueTypes>(options)
    }
  }
}

/**
 * Runtime condition contract implemented by every condition node.
 */
export interface Condition<TValueTypes extends DefaultValueTypes = DefaultValueTypes> {
  /**
   * Evaluates the condition using the current almanac and operator registry.
   */
  evaluate (
    almanac: Almanac<TValueTypes>,
    operatorMap: Map<string, AnyOperator<string, TValueTypes>>
  ): boolean

  /**
   * Serializes the condition back to its JSON representation.
   */
  toJSON (): ConditionOptions
}

/**
 * Evaluates nested conditions using logical AND semantics.
 */
export class AllCondition<TValueTypes extends DefaultValueTypes = DefaultValueTypes> implements Condition<TValueTypes> {
  constructor (
    readonly conditions: Condition<TValueTypes>[]
  ) { }

  evaluate (
    almanac: Almanac<TValueTypes>,
    operatorMap: Map<string, AnyOperator<string, TValueTypes>>
  ): boolean {
    for (const condition of this.conditions) {
      if (!condition.evaluate(almanac, operatorMap)) {
        return false
      }
    }

    return true
  }

  toJSON (): AllConditionOptions {
    return {
      type: 'all',
      conditions: this.conditions.map(c => c.toJSON())
    }
  }
}

/**
 * Evaluates nested conditions using logical OR semantics.
 */
export class AnyCondition<TValueTypes extends DefaultValueTypes = DefaultValueTypes> implements Condition<TValueTypes> {
  constructor (
    readonly conditions: Condition<TValueTypes>[]
  ) { }

  evaluate (
    almanac: Almanac<TValueTypes>,
    operatorMap: Map<string, AnyOperator<string, TValueTypes>>
  ): boolean {
    for (const condition of this.conditions) {
      if (condition.evaluate(almanac, operatorMap)) {
        return true
      }
    }

    return false
  }

  toJSON (): AnyConditionOptions {
    return {
      type: 'any',
      conditions: this.conditions.map(c => c.toJSON())
    }
  }
}

/**
 * Negates a nested condition.
 */
export class NotCondition<TValueTypes extends DefaultValueTypes = DefaultValueTypes> implements Condition<TValueTypes> {
  constructor (
    readonly condition: Condition<TValueTypes>
  ) { }

  evaluate (
    almanac: Almanac<TValueTypes>,
    operatorMap: Map<string, AnyOperator<string, TValueTypes>>
  ): boolean {
    return !this.condition.evaluate(almanac, operatorMap)
  }

  toJSON (): NotConditionOptions {
    return {
      type: 'not',
      condition: this.condition.toJSON()
    }
  }
}

/**
 * Evaluates a unary or binary operator against runtime values.
 */
export class OperatorCondition<TValueTypes extends DefaultValueTypes = DefaultValueTypes> implements Condition<TValueTypes> {
  constructor (
    readonly options: OperatorConditionOptions
  ) { }

  evaluate (
    almanac: Almanac<TValueTypes>,
    operatorMap: Map<string, AnyOperator<string, TValueTypes>>
  ): boolean {
    const operator = operatorMap.get(this.options.operatorId)
    if (operator === undefined) {
      throw new Error(`unknown operator ${this.options.operatorId}`)
    }

    if (this.options.rightValue === undefined) {
      if (this.isUnaryOperator(operator)) {
        return this.evaluateUnaryOperator(operator, almanac, this.options.leftValue)
      }

      throw new Error(`right value required for operator ${operator.id}`)
    }

    if (!this.isBinaryOperator(operator)) {
      throw new Error(`operator ${operator.id} does not support a right value`)
    }

    return this.evaluateBinaryOperator(
      operator,
      almanac,
      this.options.leftValue,
      this.options.rightValue
    )
  }

  toJSON (): OperatorConditionOptions {
    return this.options
  }

  private isUnaryOperator (
    operator: AnyOperator<string, TValueTypes>
  ): operator is UnaryOperator<TValueTypes> {
    return !('rightValueType' in operator)
  }

  private isBinaryOperator (
    operator: AnyOperator<string, TValueTypes>
  ): operator is BinaryOperator<TValueTypes> {
    return 'rightValueType' in operator
  }

  private evaluateUnaryOperator (
    operator: UnaryOperator<TValueTypes>,
    almanac: Almanac<TValueTypes>,
    leftRuntimeValue: RunTimeValue
  ): boolean {
    const leftValue = almanac.resolve(operator.leftValueType, leftRuntimeValue)
    return operator.evaluate(leftValue)
  }

  private evaluateBinaryOperator (
    operator: BinaryOperator<TValueTypes>,
    almanac: Almanac<TValueTypes>,
    leftRuntimeValue: RunTimeValue,
    rightRuntimeValue: RunTimeValue
  ): boolean {
    const leftValue = almanac.resolve(operator.leftValueType, leftRuntimeValue)
    const rightValue = almanac.resolve(operator.rightValueType, rightRuntimeValue)
    return operator.evaluate(leftValue, rightValue)
  }
}
