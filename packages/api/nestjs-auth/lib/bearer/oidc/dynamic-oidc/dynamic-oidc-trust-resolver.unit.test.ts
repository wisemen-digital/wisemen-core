import { describe, it } from 'node:test'
import { expect } from 'expect'
import { createStubInstance, useFakeTimers } from 'sinon'
import { DynamicOidcTrust } from './dynamic-oidc-trust.entity.js'
import { DynamicOidcTrustRepository } from './dynamic-oidc-trust.repository.js'
import { DynamicOidcTrustResolver } from './dynamic-oidc-trust-resolver.js'

describe('DynamicOidcTrustResolver', () => {
  it('reuses a locally cached verifier until its TTL expires', async () => {
    const repository = createStubInstance(DynamicOidcTrustRepository)
    repository.findByIssuerAndAudiences.resolves(createTrust())
    const resolver = new DynamicOidcTrustResolver(repository, 60)
    const clock = useFakeTimers()

    try {
      const firstTrust = await resolver.resolve(createToken())
      const cachedTrust = await resolver.resolve(createToken())

      expect(cachedTrust.verifier).toBe(firstTrust.verifier)
      expect(repository.findByIssuerAndAudiences.calledOnceWithExactly(
        'https://auth.example.test',
        ['backoffice-api']
      )).toBe(true)

      await clock.tickAsync(60_000)
      await resolver.resolve(createToken())

      expect(repository.findByIssuerAndAudiences.callCount).toBe(2)
    } finally {
      clock.restore()
    }
  })
})

function createTrust (): DynamicOidcTrust {
  return {
    id: 'trust-uuid' as never,
    issuer: 'https://auth.example.test',
    audiences: ['backoffice-api'],
    jwksEndpoint: 'https://auth.example.test/.well-known/jwks.json',
    claims: {
      sub: 'sub',
      additional: []
    }
  } as unknown as DynamicOidcTrust
}

function createToken (): string {
  return [
    toBase64Url({ alg: 'none' }),
    toBase64Url({ iss: 'https://auth.example.test', aud: 'backoffice-api' }),
    'signature'
  ].join('.')
}

function toBase64Url (content: object): string {
  return Buffer.from(JSON.stringify(content)).toString('base64url')
}
