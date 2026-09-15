import { describe, it } from 'node:test'
import { expect } from 'expect'
import { createStubInstance, stub } from 'sinon'
import type { JwtVerifier } from '@wisemen/nestjs-jwt-verifier'
import type { AuthenticatedIdentity } from '../../principal/auth-principal.js'
import { DynamicOidcTrust } from './dynamic-oidc-trust.entity.js'
import { DynamicOidcAuthenticator } from './dynamic-oidc-authenticator.js'
import { OidcIdentityAuthenticator } from '../identity/oidc-identity-authenticator.js'
import { DynamicOidcTrustResolver } from './dynamic-oidc-trust-resolver.js'

describe('DynamicOidcAuthenticator', () => {
  it('delegates verified token content to the identity manager for its resolved trust', async () => {
    const resolvedTrust = createResolvedTrust()
    const identity = { type: 'identity' } as AuthenticatedIdentity
    const identityManager = createStubInstance(OidcIdentityAuthenticator)
    identityManager.authenticate.resolves(identity)
    const trustResolver = createStubInstance(DynamicOidcTrustResolver)
    trustResolver.resolve.resolves(resolvedTrust)
    const authenticator = createAuthenticator({ identityManager, trustResolver })

    await expect(authenticator.authenticate('token')).resolves.toBe(identity)

    expect(identityManager.authenticate.calledOnceWithExactly(
      resolvedTrust.trust,
      { sub: 'user-123', email: 'user@example.test' }
    )).toBe(true)
  })

  it('does not manage identities when token verification fails', async () => {
    const resolvedTrust = createResolvedTrust()
    resolvedTrust.verifier.verify = stub().rejects(new Error('invalid token'))
    const identityManager = createStubInstance(OidcIdentityAuthenticator)
    const authenticator = createAuthenticator({
      identityManager,
      trustResolver: {
        resolve: stub().resolves(resolvedTrust)
      } as unknown as DynamicOidcTrustResolver
    })

    await expect(authenticator.authenticate('token')).rejects.toThrow('invalid token')

    expect(identityManager.authenticate.called).toBe(false)
  })
})

function createAuthenticator (overrides: {
  identityManager?: OidcIdentityAuthenticator
  trustResolver?: DynamicOidcTrustResolver
} = {}): DynamicOidcAuthenticator {
  return new DynamicOidcAuthenticator(
    overrides.trustResolver ?? createTrustResolver(),
    overrides.identityManager ?? createStubInstance(OidcIdentityAuthenticator)
  )
}

function createTrustResolver (): DynamicOidcTrustResolver {
  const resolver = createStubInstance(DynamicOidcTrustResolver)
  resolver.resolve.resolves(createResolvedTrust())

  return resolver
}

function createResolvedTrust (): {
  trust: DynamicOidcTrust
  verifier: JwtVerifier
} {
  return {
    trust: {
      id: 'trust-uuid' as never,
      issuer: 'https://auth.example.test',
      audiences: ['backoffice-api'],
      jwksEndpoint: 'https://auth.example.test/.well-known/jwks.json',
      claims: {
        sub: 'sub',
        additional: ['email']
      }
    } as unknown as DynamicOidcTrust,
    verifier: {
      verify: stub().resolves({ sub: 'user-123', email: 'user@example.test' })
    } as unknown as JwtVerifier
  }
}
