import 'reflect-metadata'
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { plainToInstance } from 'class-transformer'
import { validateSync } from 'class-validator'
import { testEvents, testFacts, testOperators } from './test-fixtures.js'
import { DtoFactory } from '#src/dto-factory.js'
import { DEFAULT_VALUE_TYPE_REGISTRY } from '#src/value-types.js'

describe('DtoFactory', () => {
  it('builds named DTOs that hydrate discriminated rule payloads', () => {
    const { CreateRulesCommandDto, EngineSchemaDto } = DtoFactory.buildDtos(
      'Contact',
      [...testFacts],
      [...testOperators],
      [...testEvents],
      DEFAULT_VALUE_TYPE_REGISTRY
    )

    const command = plainToInstance(CreateRulesCommandDto, {
      rules: [{
        condition: {
          type: 'operator',
          operatorId: 'string.equals',
          leftValue: { type: 'fact', factId: 'name' },
          rightValue: { type: 'value', value: 'Kobe' }
        },
        event: {
          id: 'warning',
          data: {
            message: { type: 'fact', factId: 'name' }
          }
        }
      }]
    }) as {
      rules: Array<{
        condition: {
          leftValue: { constructor: { name: string }, type: string, factId: string }
          rightValue: { type: string, value: string }
        }
        event: {
          constructor: { name: string }
          data: {
            message: { type: string, factId: string }
          }
        }
      }>
    }

    assert.equal(CreateRulesCommandDto.name, 'ContactCreateRulesCommandDto')
    assert.equal(EngineSchemaDto.name, 'ContactEngineSchemaDto')
    assert.equal(command.rules[0].condition.constructor.name, 'ContactStringEqualsOperatorConditionDto')
    assert.equal(command.rules[0].event.constructor.name, 'ContactWarningRuleEventDto')
    assert.equal(command.rules[0].condition.leftValue.constructor.name, 'ContactStringRuntimeValueDto')
    assert.equal(command.rules[0].condition.leftValue.type, 'fact')
    assert.equal(command.rules[0].condition.leftValue.factId, 'name')
    assert.equal(command.rules[0].condition.rightValue.type, 'value')
    assert.equal(command.rules[0].condition.rightValue.value, 'Kobe')
    assert.equal(command.rules[0].event.data.message.type, 'fact')
    assert.equal(command.rules[0].event.data.message.factId, 'name')
    assert.deepEqual(validateSync(command as object), [])
  })

  it('validates operator-specific DTO requirements', () => {
    const { CreateRulesCommandDto } = DtoFactory.buildDtos(
      'Contact',
      [...testFacts],
      [...testOperators],
      [...testEvents],
      DEFAULT_VALUE_TYPE_REGISTRY
    )

    const command = plainToInstance(CreateRulesCommandDto, {
      rules: [{
        condition: {
          type: 'operator',
          operatorId: 'string.equals',
          leftValue: { type: 'fact', factId: 'name' }
        },
        event: {
          id: 'warning',
          data: {
            message: { type: 'value', value: 'hello' }
          }
        }
      }]
    })

    assert.match(JSON.stringify(validateSync(command as object)), /rightValue/)
  })
})
