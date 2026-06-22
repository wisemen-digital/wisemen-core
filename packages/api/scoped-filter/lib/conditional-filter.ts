import { ApiProperty } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'

export interface ConditionalFilter<TCondition extends string, TValue> {
  condition: TCondition
  value: TValue
}

export interface ConditionalFilterConstructor<TCondition extends string, TValue> {
  new (condition: TCondition, value: TValue): ConditionalFilter<TCondition, TValue>
}

export function buildConditionalFilter<TCondition extends string, TValue> (
  name: string,
  conditionEnum: Record<string, TCondition>,
  conditionEnumName: string,
  valueApiProperty: PropertyDecorator,
  valueValidator: PropertyDecorator
): ConditionalFilterConstructor<TCondition, TValue> {
  const C: ConditionalFilterConstructor<TCondition, TValue> = class {
    condition: TCondition
    value: TValue

    constructor (condition: TCondition, value: TValue) {
      this.condition = condition
      this.value = value
    }
  }

  Object.defineProperty(C, 'name', { value: name })

  const prototype = C.prototype as object

  ApiProperty({ enum: conditionEnum, enumName: conditionEnumName })(prototype, 'condition')
  IsEnum(conditionEnum)(prototype, 'condition')

  valueApiProperty(prototype, 'value')
  valueValidator(prototype, 'value')

  return C
}
