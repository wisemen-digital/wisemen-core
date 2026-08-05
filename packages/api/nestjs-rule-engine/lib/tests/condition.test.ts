import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { createAlmanac, createOperatorMap } from './test-fixtures.js'
import { ConditionFactory } from '#src/condition.js'

describe('ConditionFactory', () => {
  it('creates nested conditions that evaluate correctly', () => {
    const condition = ConditionFactory.create({
      type: 'all',
      conditions: [
        {
          type: 'operator',
          operatorId: 'boolean.truthy',
          leftValue: { type: 'fact', factId: 'isActive' }
        },
        {
          type: 'any',
          conditions: [
            {
              type: 'operator',
              operatorId: 'string.equals',
              leftValue: { type: 'fact', factId: 'name' },
              rightValue: { type: 'value', value: 'Kobe' }
            },
            {
              type: 'not',
              condition: {
                type: 'operator',
                operatorId: 'number.greater-than',
                leftValue: { type: 'fact', factId: 'age' },
                rightValue: { type: 'value', value: 50 }
              }
            }
          ]
        }
      ]
    })

    assert.equal(condition.evaluate(createAlmanac(), createOperatorMap()), true)
    assert.deepEqual(condition.toJSON(), {
      type: 'all',
      conditions: [
        {
          type: 'operator',
          operatorId: 'boolean.truthy',
          leftValue: { type: 'fact', factId: 'isActive' }
        },
        {
          type: 'any',
          conditions: [
            {
              type: 'operator',
              operatorId: 'string.equals',
              leftValue: { type: 'fact', factId: 'name' },
              rightValue: { type: 'value', value: 'Kobe' }
            },
            {
              type: 'not',
              condition: {
                type: 'operator',
                operatorId: 'number.greater-than',
                leftValue: { type: 'fact', factId: 'age' },
                rightValue: { type: 'value', value: 50 }
              }
            }
          ]
        }
      ]
    })
  })

  it('throws when an operator is unknown', () => {
    const condition = ConditionFactory.create({
      type: 'operator',
      operatorId: 'missing',
      leftValue: { type: 'value', value: true }
    })

    assert.throws(
      () => condition.evaluate(createAlmanac(), createOperatorMap()),
      /unknown operator missing/
    )
  })

  it('throws when a binary operator is missing its right value', () => {
    const condition = ConditionFactory.create({
      type: 'operator',
      operatorId: 'string.equals',
      leftValue: { type: 'fact', factId: 'name' }
    })

    assert.throws(
      () => condition.evaluate(createAlmanac(), createOperatorMap()),
      /right value required for operator string.equals/
    )
  })

  it('throws when a unary operator receives a right value', () => {
    const condition = ConditionFactory.create({
      type: 'operator',
      operatorId: 'boolean.truthy',
      leftValue: { type: 'fact', factId: 'isActive' },
      rightValue: { type: 'value', value: true }
    })

    assert.throws(
      () => condition.evaluate(createAlmanac(), createOperatorMap()),
      /operator boolean.truthy does not support a right value/
    )
  })
})
