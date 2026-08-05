import 'reflect-metadata'
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { getMetadataArgsStorage } from 'typeorm'
import { RulesColumn } from '#src/typeorm/rules.column.js'

describe('RulesColumn', () => {
  it('creates a jsonb column decorator', () => {
    const initialColumns = getMetadataArgsStorage().columns.length

    class Entity {
      @RulesColumn({ nullable: false })
      declare rules: object[]
    }
    void Entity

    const newColumns = getMetadataArgsStorage().columns.slice(initialColumns)

    assert.equal(newColumns.length, 1)
    assert.equal(newColumns[0]?.propertyName, 'rules')
    assert.equal(newColumns[0]?.options.type, 'jsonb')
    assert.equal(newColumns[0]?.options.nullable, false)
  })
})
