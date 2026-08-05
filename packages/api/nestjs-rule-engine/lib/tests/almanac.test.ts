import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { createAlmanac } from './test-fixtures.js'

describe('Almanac', () => {
  it('resolves literal runtime values through the registry', () => {
    const almanac = createAlmanac()

    assert.equal(almanac.resolve('string', { type: 'value', value: 'hello' }), 'hello')
    assert.equal(almanac.resolve('boolean', { type: 'value', value: true }), true)
  })

  it('resolves fact references from the provided runtime facts', () => {
    const almanac = createAlmanac({
      name: 'Ada',
      isActive: false,
      age: 27
    })

    assert.equal(almanac.resolve('string', { type: 'fact', factId: 'name' }), 'Ada')
    assert.equal(almanac.resolve('number', { type: 'fact', factId: 'age' }), 27)
  })

  it('throws when a referenced fact is missing', () => {
    const almanac = createAlmanac()

    assert.throws(
      () => almanac.resolve('string', { type: 'fact', factId: 'unknown' }),
      /fact unknown not found/
    )
  })

  it('throws when the referenced fact type does not match the requested type', () => {
    const almanac = createAlmanac()

    assert.throws(
      () => almanac.resolve('number', { type: 'fact', factId: 'name' }),
      /value type mismatch/
    )
  })
})
