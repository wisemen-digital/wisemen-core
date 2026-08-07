import { describe, it } from 'node:test'
import { expect } from 'expect'
import { compareBasicAuth } from '../basic.auth.js'

describe('Basic auth compare test', () => {
  it('returns false when username does not match', () => {
    const result = compareBasicAuth({
      username: 'wronguser',
      password: 'password123'
    }, {
      username: 'admin',
      password: 'password123'
    })

    expect(result).toBe(false)
  })

  it('returns false when password does not match', () => {
    const result = compareBasicAuth({
      username: 'admin',
      password: 'wrongpassword'
    }, {
      username: 'admin',
      password: 'password123'
    })

    expect(result).toBe(false)
  })

  it('returns false when both username and password do not match', () => {
    const result = compareBasicAuth({
      username: 'wronguser',
      password: 'wrongpassword'
    }, {
      username: 'admin',
      password: 'password123'
    })

    expect(result).toBe(false)
  })

  it('returns false when both username and password match with padding but lengths are different', () => {
    const result = compareBasicAuth({
      username: 'admin\0\0',
      password: 'password123\0\0'
    }, {
      username: 'admin',
      password: 'password123'
    })

    expect(result).toBe(false)
  })

  it('returns true when both username and password match', () => {
    const result = compareBasicAuth({
      username: 'admin',
      password: 'password123'
    }, {
      username: 'admin',
      password: 'password123'
    })

    expect(result).toBe(true)
  })
})
