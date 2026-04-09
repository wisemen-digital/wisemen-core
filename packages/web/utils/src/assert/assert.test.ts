import {
  describe,
  expect,
  it,
} from 'vitest'

import {
  assert,
  assertDefined,
  assertNever,
} from './assert'

describe('assert', () => {
  it('does not throw when the condition is truthy', () => {
    expect(() => assert(true, 'should not throw')).not.toThrowError()
    expect(() => assert(1, 'should not throw')).not.toThrowError()
    expect(() => assert('hello', 'should not throw')).not.toThrowError()
  })

  it('throws an Error when the condition is falsy', () => {
    expect(() => assert(false, 'value was false')).toThrowError('Assertion failed: value was false')
  })

  it('throws for 0, empty string, null, and undefined', () => {
    expect(() => assert(0, 'zero')).toThrowError('Assertion failed: zero')
    expect(() => assert('', 'empty string')).toThrowError('Assertion failed: empty string')
    expect(() => assert(null, 'null')).toThrowError('Assertion failed: null')
    expect(() => assert(undefined, 'undefined')).toThrowError('Assertion failed: undefined')
  })
})

describe('assertDefined', () => {
  it('does not throw for a defined value', () => {
    expect(() => assertDefined('hello', 'must be defined')).not.toThrowError()
    expect(() => assertDefined(0, 'must be defined')).not.toThrowError()
    expect(() => assertDefined(false, 'must be defined')).not.toThrowError()
  })

  it('throws for null', () => {
    expect(() => assertDefined(null, 'value is null')).toThrowError('Assertion failed: value is null')
  })

  it('throws for undefined', () => {
    expect(() => assertDefined(undefined, 'value is undefined')).toThrowError('Assertion failed: value is undefined')
  })
})

describe('assertNever', () => {
  it('throws with the unexpected value in the message', () => {
    expect(() => assertNever('unexpected' as never)).toThrowError('Unexpected value reached assertNever')
  })
})
