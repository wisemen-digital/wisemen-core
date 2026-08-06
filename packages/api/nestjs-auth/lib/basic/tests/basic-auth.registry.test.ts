import { describe, it } from 'node:test'
import { expect } from 'expect'
import { BasicAuthRegistry } from '../basic-auth.registry.js'

describe('BasicAuthRegistry', () => {
  it('merges definitions from multiple registrations', () => {
    const registry = new BasicAuthRegistry()

    registry.register({
      admin: {
        username: 'alice',
        password: 'secret'
      }
    })
    registry.register({
      docs: {
        username: 'bob',
        password: 'password'
      }
    })

    expect(registry.definitions).toEqual({
      admin: {
        username: 'alice',
        password: 'secret'
      },
      docs: {
        username: 'bob',
        password: 'password'
      }
    })
  })

  it('allows registering the same definition more than once', () => {
    const registry = new BasicAuthRegistry()

    registry.register({
      admin: {
        username: 'alice',
        password: 'secret'
      }
    })

    expect(() => registry.register({
      admin: {
        username: 'alice',
        password: 'secret'
      }
    })).not.toThrow()
  })

  it('throws when the same definition name is reused with different credentials', () => {
    const registry = new BasicAuthRegistry()

    registry.register({
      admin: {
        username: 'alice',
        password: 'secret'
      }
    })

    expect(() => registry.register({
      admin: {
        username: 'alice',
        password: 'different'
      }
    })).toThrow('Basic Auth definition "admin" is already registered')
  })
})
