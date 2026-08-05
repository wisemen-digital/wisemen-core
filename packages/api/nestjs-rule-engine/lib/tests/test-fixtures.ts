import { Almanac } from '#src/almanac.js'
import { Event } from '#src/event.js'
import { Fact } from '#src/fact.js'
import { AnyOperator } from '#src/operator.js'
import { RuntimeFacts } from '#src/runtime-fact.js'
import { DEFAULT_VALUE_TYPE_REGISTRY } from '#src/value-types.js'

export const testFacts = [
  { id: 'name', valueType: 'string' },
  { id: 'isActive', valueType: 'boolean' },
  { id: 'age', valueType: 'number' }
] as const satisfies readonly Fact[]

export const testOperators = [
  {
    id: 'string.equals',
    leftValueType: 'string',
    rightValueType: 'string',
    evaluate: (leftValue: string, rightValue: string) => leftValue === rightValue
  },
  {
    id: 'string.not-equals',
    leftValueType: 'string',
    rightValueType: 'string',
    evaluate: (leftValue: string, rightValue: string) => leftValue !== rightValue
  },
  {
    id: 'boolean.truthy',
    leftValueType: 'boolean',
    evaluate: (leftValue: boolean) => leftValue
  },
  {
    id: 'number.greater-than',
    leftValueType: 'number',
    rightValueType: 'number',
    evaluate: (leftValue: number, rightValue: number) => leftValue > rightValue
  }
] as const satisfies readonly AnyOperator[]

export const testEvents = [
  {
    id: 'warning',
    data: { message: 'string' }
  },
  {
    id: 'status',
    data: { active: 'boolean', age: 'number' }
  }
] as const satisfies readonly Event[]

export type TestFacts = typeof testFacts
export type TestEvents = typeof testEvents

export function createAlmanac (
  runtimeFacts: RuntimeFacts<TestFacts> = {
    name: 'Kobe',
    isActive: true,
    age: 35
  }
): Almanac {
  return new Almanac(
    DEFAULT_VALUE_TYPE_REGISTRY,
    new Map(testFacts.map(fact => [fact.id, fact])),
    runtimeFacts
  )
}

export function createOperatorMap (): Map<string, AnyOperator> {
  return new Map(testOperators.map(operator => [operator.id, operator]))
}

export function createEventMap (): Map<TestEvents[number]['id'], TestEvents[number]> {
  return new Map(testEvents.map(event => [event.id, event]))
}
