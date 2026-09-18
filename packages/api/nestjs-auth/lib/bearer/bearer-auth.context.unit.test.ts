import { describe, it } from 'node:test'
import { expect } from 'expect'
import { BearerAuthContext } from './bearer-auth.context.js'
import { NoAuthenticationContextError } from './errors/no-authentication-context.error.js'
import { NoAuthorizationHeaderError } from './errors/no-authorization-header.error.js'
import type { AuthenticatedApiKey, AuthenticatedIdentity } from './principal/auth-principal.js'

const identity = {
  type: 'identity',
  uuid: 'identity-uuid',
  issuer: 'https://auth.example.test',
  subject: 'subject-1',
  oidcTrustId: 'backoffice',
  claims: {}
} as unknown as AuthenticatedIdentity

const apiKey = {
  type: 'api-key',
  uuid: 'api-key-uuid',
  name: 'CI deployment'
} as unknown as AuthenticatedApiKey

describe('BearerAuthContext', () => {
  it('reports no principal outside a request scope', () => {
    const context = new BearerAuthContext()

    expect(context.getPrincipal()).toBeNull()
    expect(() => context.getPrincipalOrFail()).toThrow(NoAuthenticationContextError)
  })

  it('exposes the authenticated principal inside the scope it runs', () => {
    const context = new BearerAuthContext()

    context.run(identity, () => {
      expect(context.getPrincipal()).toBe(identity)
      expect(context.getPrincipalOrFail()).toBe(identity)
    })
  })

  it('exposes an authenticated API key the same way as an identity', () => {
    const context = new BearerAuthContext()

    context.run(apiKey, () => {
      expect(context.getPrincipalOrFail()).toBe(apiKey)
    })
  })

  // Failed authentication is retained rather than thrown in the middleware, so
  // public routes still resolve while protected ones raise at the boundary.
  it('retains a failed authentication and raises it only on getPrincipalOrFail', () => {
    const context = new BearerAuthContext()
    const error = new NoAuthorizationHeaderError()

    context.runWithError(error, () => {
      expect(context.getPrincipal()).toBeNull()
      expect(() => context.getPrincipalOrFail()).toThrow(error)
    })
  })

  it('does not leak a principal outside the scope it ran in', () => {
    const context = new BearerAuthContext()

    context.run(identity, () => {
      expect(context.getPrincipal()).toBe(identity)
    })

    expect(context.getPrincipal()).toBeNull()
  })

  it('keeps the principal available across an await inside the scope', async () => {
    const context = new BearerAuthContext()

    await new Promise<void>((resolve) => {
      context.run(identity, () => {
        void (async () => {
          await Promise.resolve()
          expect(context.getPrincipalOrFail()).toBe(identity)
          resolve()
        })()
      })
    })
  })
})
