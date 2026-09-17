import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { normalizeSchema } from '../normalize-schema.js'

describe('normalizeSchema', () => {
  it('allows null alongside enum and composition constraints', () => {
    for (const constraints of [
      { type: 'string', enum: ['passed', 'failed'] },
      { $ref: '#/components/schemas/Exercise' },
      { allOf: [{ $ref: '#/components/schemas/Grade' }] },
      { type: 'string', oneOf: [{ const: 'value' }] },
      { anyOf: [{ type: 'number' }] },
      { not: { type: 'null' } }
    ]) {
      assert.deepEqual(normalizeSchema({ ...constraints, nullable: true, description: 'Nullable value' }), {
        description: 'Nullable value', anyOf: [constraints, { type: 'null' }]
      })
    }
  })

  it('visits nested schemas without modifying payload examples, defaults or input objects', () => {
    const example = { nullable: true, properties: { nullable: true } }
    const input = {
      type: 'object', nullable: false, example, default: example,
      properties: {
        nullable: { type: 'boolean', nullable: true },
        values: { type: 'array', items: { type: 'string', nullable: true } }
      },
      additionalProperties: { type: 'number', nullable: true },
      'x-custom': example
    }
    const original = structuredClone(input)

    assert.deepEqual(normalizeSchema(input), {
      type: 'object', example, default: example,
      properties: {
        nullable: { type: ['boolean', 'null'] },
        values: { type: 'array', items: { type: ['string', 'null'] } }
      },
      additionalProperties: { type: ['number', 'null'] },
      'x-custom': example
    })
    assert.deepEqual(input, original)
  })

  it('preserves existing unions and boolean schemas when applied repeatedly', () => {
    const schema = { type: ['string', 'null'], nullable: true }
    const normalized = normalizeSchema(schema)

    assert.deepEqual(normalized, { type: ['string', 'null'] })
    assert.deepEqual(normalizeSchema(normalized), normalized)
    assert.equal(normalizeSchema(false), false)
    assert.equal(normalizeSchema(true), true)
  })
})
