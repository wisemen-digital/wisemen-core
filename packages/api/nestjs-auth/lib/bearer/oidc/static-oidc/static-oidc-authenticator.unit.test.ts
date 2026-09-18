import { describe, it } from 'node:test'
import { expect } from 'expect'
import { createStubInstance, stub } from 'sinon'
import type { JwtVerifier } from '@wisemen/nestjs-jwt-verifier'
import type { AuthenticatedIdentity } from '../../principal/auth-principal.js'
import type { OidcTrust } from '../oidc-trust.js'
import { OidcIdentityAuthenticator } from '../identity/oidc-identity-authenticator.js'
import { StaticOidcAuthenticator } from './static-oidc-authenticator.js'

describe('StaticOidcAuthenticator', () => {
  it('delegates verified token content to the identity manager for its trust', async () => {
    const trust = createTrust()
    const tokenContent = { user_id: 'user-123', email: 'user@example.test' }
    const identity = { type: 'identity' } as AuthenticatedIdentity
    const identityManager = createStubInstance(OidcIdentityAuthenticator)
    identityManager.authenticate.resolves(identity)
    const authenticator = createAuthenticator({ identityManager, trust, verifier: {
      verify: stub().resolves(tokenContent)
    } as unknown as JwtVerifier })

    await expect(authenticator.authenticate('token')).resolves.toBe(identity)

    expect(identityManager.authenticate.calledOnceWithExactly(trust, tokenContent)).toBe(true)
  })

  it('does not manage identities when token verification fails', async () => {
    const identityManager = createStubInstance(OidcIdentityAuthenticator)
    const authenticator = createAuthenticator({ identityManager, verifier: {
      verify: stub().rejects(new Error('invalid token'))
    } as unknown as JwtVerifier })

    await expect(authenticator.authenticate('token')).rejects.toThrow('invalid token')

    expect(identityManager.authenticate.called).toBe(false)
  })
})

function createAuthenticator (overrides: {
  identityManager?: OidcIdentityAuthenticator
  trust?: OidcTrust
  verifier?: JwtVerifier
} = {}): StaticOidcAuthenticator {
  return new StaticOidcAuthenticator(
    overrides.trust ?? createTrust(),
    overrides.verifier ?? {
      verify: stub().resolves({ user_id: 'user-123' })
    } as unknown as JwtVerifier,
    overrides.identityManager ?? createStubInstance(OidcIdentityAuthenticator)
  )
}

function createTrust (): OidcTrust {
  return {
    id: 'backoffice',
    issuer: 'https://auth.example.test',
    audiences: ['backoffice-api'],
    jwksEndpoint: 'https://auth.example.test/.well-known/jwks.json',
    claims: {
      sub: 'user_id',
      additional: ['email']
    }
  }
}
