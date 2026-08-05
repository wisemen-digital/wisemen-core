import 'reflect-metadata'
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { IsDefined } from 'class-validator'
import { DEFAULT_OPERATORS } from '#src/default-operators.js'
import { ValueTypeRegistry, DEFAULT_VALUE_TYPE_REGISTRY } from '#src/value-types.js'
import { DEFAULT_BOOLEAN_OPERATORS } from '#src/value-types/boolean.js'
import { DEFAULT_NUMBER_OPERATORS } from '#src/value-types/number.js'
import { DEFAULT_STRING_OPERATORS } from '#src/value-types/string.js'

function getOperator<
  TOperators extends readonly { id: string }[],
  TId extends TOperators[number]['id']
> (
  operators: TOperators,
  id: TId
): Extract<TOperators[number], { id: TId }> {
  const operator = operators.find(candidate => candidate.id === id)

  assert.notEqual(operator, undefined)

  return operator as Extract<TOperators[number], { id: TId }>
}

describe('ValueTypeRegistry', () => {
  it('registers custom value types', () => {
    const registry = new ValueTypeRegistry<{ upper: string }>()

    registry.register('upper', {
      transformer: (value: unknown) => String(value).toUpperCase(),
      dtoDecorators: [IsDefined()]
    })

    assert.equal(registry.resolve('upper', 'hello'), 'HELLO')
    assert.equal(registry.getDtoDecorators('upper').length, 1)
  })

  it('throws when resolving an unknown type', () => {
    const registry = new ValueTypeRegistry()

    assert.throws(
      () => registry.resolve('string', 'hello'),
      /value type string was not registered/
    )
  })
})

describe('DEFAULT_VALUE_TYPE_REGISTRY', () => {
  it('resolves built-in types', () => {
    assert.equal(DEFAULT_VALUE_TYPE_REGISTRY.resolve('string', 'hello'), 'hello')
    assert.equal(DEFAULT_VALUE_TYPE_REGISTRY.resolve('boolean', true), true)
    assert.equal(DEFAULT_VALUE_TYPE_REGISTRY.resolve('number', 42), 42)
  })

  it('rejects invalid built-in values', () => {
    assert.throws(
      () => DEFAULT_VALUE_TYPE_REGISTRY.resolve('number', '42'),
      /expected 42 to be a number/
    )
  })
})

describe('DEFAULT_OPERATORS', () => {
  it('includes useful built-in operators across the default value types', () => {
    const operatorIds = new Set(DEFAULT_OPERATORS.map(operator => operator.id))

    assert.equal(operatorIds.has('boolean.falsy'), true)
    assert.equal(operatorIds.has('number.divisible-by'), true)
    assert.equal(operatorIds.has('number.less-than-or-equal'), true)
    assert.equal(operatorIds.has('string.contains-ignore-case'), true)
    assert.equal(operatorIds.has('string.contains'), true)
    assert.equal(operatorIds.has('string.length.greater-than-or-equal'), true)
    assert.equal(operatorIds.has('string.length.greater-than'), true)
  })
})

describe('DEFAULT_BOOLEAN_OPERATORS', () => {
  it('evaluates the built-in boolean operators', () => {
    assert.equal(getOperator(DEFAULT_BOOLEAN_OPERATORS, 'boolean.truthy').evaluate(true), true)
    assert.equal(getOperator(DEFAULT_BOOLEAN_OPERATORS, 'boolean.falsy').evaluate(false), true)
    assert.equal(getOperator(DEFAULT_BOOLEAN_OPERATORS, 'boolean.equals').evaluate(true, true), true)
    assert.equal(getOperator(DEFAULT_BOOLEAN_OPERATORS, 'boolean.not-equals').evaluate(true, false), true)
  })
})

describe('DEFAULT_NUMBER_OPERATORS', () => {
  it('evaluates the built-in number operators', () => {
    assert.equal(getOperator(DEFAULT_NUMBER_OPERATORS, 'number.greater-than-or-equal').evaluate(5, 5), true)
    assert.equal(getOperator(DEFAULT_NUMBER_OPERATORS, 'number.divisible-by').evaluate(12, 3), true)
    assert.equal(getOperator(DEFAULT_NUMBER_OPERATORS, 'number.non-negative').evaluate(0), true)
    assert.equal(getOperator(DEFAULT_NUMBER_OPERATORS, 'number.even').evaluate(8), true)
    assert.equal(getOperator(DEFAULT_NUMBER_OPERATORS, 'number.odd').evaluate(7), true)
  })
})

describe('DEFAULT_STRING_OPERATORS', () => {
  it('evaluates the built-in string operators', () => {
    assert.equal(getOperator(DEFAULT_STRING_OPERATORS, 'string.equals-ignore-case').evaluate('Kobe', 'kobe'), true)
    assert.equal(getOperator(DEFAULT_STRING_OPERATORS, 'string.contains-ignore-case').evaluate('Kobe Bryant', 'bry'), true)
    assert.equal(getOperator(DEFAULT_STRING_OPERATORS, 'string.blank').evaluate('   '), true)
    assert.equal(getOperator(DEFAULT_STRING_OPERATORS, 'string.not-blank').evaluate('Kobe'), true)
    assert.equal(getOperator(DEFAULT_STRING_OPERATORS, 'string.length.greater-than-or-equal').evaluate('Kobe', 4), true)
    assert.equal(getOperator(DEFAULT_STRING_OPERATORS, 'string.length.less-than-or-equal').evaluate('Kobe', 4), true)
  })
})
