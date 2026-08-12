import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { createAlmanac, createEventMap, createOperatorMap } from './test-fixtures.js'
import { Rule } from '#src/rule.js'

describe('Rule', () => {
  it('returns null when the condition does not match', () => {
    const rule = new Rule({
      condition: {
        type: 'operator',
        operatorId: 'string.equals',
        leftValue: { type: 'fact', factId: 'name' },
        rightValue: { type: 'value', value: 'Ada' }
      },
      event: {
        id: 'warning',
        data: {
          message: { type: 'fact', factId: 'name' }
        }
      }
    })

    assert.equal(rule.evaluate(createAlmanac(), createOperatorMap(), createEventMap()), null)
  })

  it('returns resolved event data when the condition matches', () => {
    const rule = new Rule({
      condition: {
        type: 'operator',
        operatorId: 'boolean.truthy',
        leftValue: { type: 'fact', factId: 'isActive' }
      },
      event: {
        id: 'status',
        data: {
          active: { type: 'fact', factId: 'isActive' },
          age: { type: 'fact', factId: 'age' }
        }
      }
    })

    assert.deepEqual(rule.evaluate(createAlmanac(), createOperatorMap(), createEventMap()), {
      id: 'status',
      data: {
        active: true,
        age: 35
      }
    })
  })

  it('throws when the configured event does not exist', () => {
    const rule = new Rule({
      condition: {
        type: 'operator',
        operatorId: 'boolean.truthy',
        leftValue: { type: 'fact', factId: 'isActive' }
      },
      event: {
        id: 'missing',
        data: {}
      }
    })

    assert.throws(
      () => rule.evaluate(createAlmanac(), createOperatorMap(), createEventMap()),
      /event missing not found/
    )
  })

  it('serializes back to its original options', () => {
    const options = {
      condition: {
        type: 'operator' as const,
        operatorId: 'boolean.truthy',
        leftValue: { type: 'fact' as const, factId: 'isActive' }
      },
      event: {
        id: 'warning',
        data: {
          message: { type: 'value' as const, value: 'hello' }
        }
      }
    }
    const rule = new Rule(options)

    assert.deepEqual(rule.toJSON(), options)
  })
})
