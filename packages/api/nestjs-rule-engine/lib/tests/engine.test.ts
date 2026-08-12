import 'reflect-metadata'
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { testEvents, testFacts, testOperators } from './test-fixtures.js'
import { Engine } from '#src/engine.js'

describe('Engine', () => {
  it('uses the built-in default operators when none are provided', () => {
    const engine = new Engine({
      facts: testFacts,
      events: testEvents
    })

    const result = engine.run(
      {
        name: 'Kobe',
        isActive: false,
        age: 35
      },
      [
        {
          condition: {
            type: 'all',
            conditions: [
              {
                type: 'operator',
                operatorId: 'string.contains-ignore-case',
                leftValue: { type: 'fact', factId: 'name' },
                rightValue: { type: 'value', value: 'OB' }
              },
              {
                type: 'operator',
                operatorId: 'number.odd',
                leftValue: { type: 'fact', factId: 'age' }
              },
              {
                type: 'operator',
                operatorId: 'boolean.falsy',
                leftValue: { type: 'fact', factId: 'isActive' }
              }
            ]
          },
          event: {
            id: 'warning',
            data: {
              message: { type: 'fact', factId: 'name' }
            }
          }
        }
      ]
    )

    assert.deepEqual(result, [
      {
        id: 'warning',
        data: { message: 'Kobe' }
      }
    ])
  })

  it('runs matching rules and returns emitted events', () => {
    const engine = new Engine({
      facts: testFacts,
      operators: testOperators,
      events: testEvents,
    })

    const result = engine.run(
      {
        name: 'Kobe',
        isActive: true,
        age: 35
      },
      [
        {
          condition: {
            type: 'operator',
            operatorId: 'boolean.truthy',
            leftValue: { type: 'fact', factId: 'isActive' }
          },
          event: {
            id: 'warning',
            data: {
              message: { type: 'fact', factId: 'name' }
            }
          }
        },
        {
          condition: {
            type: 'operator',
            operatorId: 'number.greater-than',
            leftValue: { type: 'fact', factId: 'age' },
            rightValue: { type: 'value', value: 99 }
          },
          event: {
            id: 'status',
            data: {
              active: { type: 'fact', factId: 'isActive' },
              age: { type: 'fact', factId: 'age' }
            }
          }
        }
      ]
    )

    assert.deepEqual(result, [
      {
        id: 'warning',
        data: { message: 'Kobe' }
      }
    ])
  })

  it('creates DTOs from the registered facts, operators, and events', () => {
    const engine = new Engine({
      facts: testFacts,
      operators: testOperators,
      events: testEvents,
    })

    const dtos = engine.createDtos('Account')

    assert.equal(dtos.EngineSchemaDto.name, 'AccountEngineSchemaDto')
    assert.equal(dtos.CreateRulesCommandDto.name, 'AccountCreateRulesCommandDto')
  })
})
