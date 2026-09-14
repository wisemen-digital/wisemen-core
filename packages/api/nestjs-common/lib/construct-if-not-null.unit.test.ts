import { describe, it } from 'node:test'
import { expect } from 'expect'
import { constructIfNotNull } from './construct-if-not-null.js'

class Wrapper {
  constructor (readonly value: string) {}
}

describe('constructIfNotNull', () => {
  it('constructs a value when the input is provided', () => {
    const result = constructIfNotNull(Wrapper, 'value')

    expect(result).toBeInstanceOf(Wrapper)
    expect(result?.value).toBe('value')
  })

  it('returns null when the input is null', () => {
    expect(constructIfNotNull(Wrapper, null)).toBeNull()
  })

  it('returns null when the input is undefined', () => {
    expect(constructIfNotNull(Wrapper, undefined)).toBeNull()
  })
})
