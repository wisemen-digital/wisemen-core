import { describe, it } from 'node:test'
import { expect } from 'expect'
import { canonicalize } from './json-canonicalize.js'

describe('canonicalize', () => {
  it('produces the same output regardless of key order', () => {
    const a = canonicalize({ b: 2, a: 1 })
    const b = canonicalize({ a: 1, b: 2 })

    expect(a).toBe(b)
    expect(a).toBe('{"a":1,"b":2}')
  })

  it('sorts keys recursively in nested objects', () => {
    expect(canonicalize({ z: { d: 1, c: 2 }, a: 1 })).toBe('{"a":1,"z":{"c":2,"d":1}}')
  })

  it('preserves array order', () => {
    expect(canonicalize({ list: [3, 1, 2] })).toBe('{"list":[3,1,2]}')
  })

  it('drops keys with an undefined value', () => {
    expect(canonicalize({ a: 1, b: undefined })).toBe('{"a":1}')
  })

  it('turns undefined array entries into null', () => {
    expect(canonicalize({ list: [1, undefined, 2] })).toBe('{"list":[1,null,2]}')
  })

  it('throws on a circular reference by default', () => {
    const circular: { self?: unknown } = {}
    circular.self = circular

    expect(() => canonicalize(circular)).toThrow('Circular reference detected')
  })

  it('allows a circular reference when explicitly enabled', () => {
    const circular: { self?: unknown } = {}
    circular.self = circular

    expect(() => canonicalize(circular, true)).not.toThrow()
  })
})
