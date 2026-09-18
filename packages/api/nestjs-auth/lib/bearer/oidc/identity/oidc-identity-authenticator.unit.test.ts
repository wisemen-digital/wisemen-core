import { describe, it } from 'node:test'
import { expect } from 'expect'
import { createStubInstance } from 'sinon'
import { DomainEventEmitter } from '@wisemen/nestjs-domain-events'
import { TypeORMError, type DataSource, type EntityManager } from 'typeorm'
import { InvalidOidcSubjectClaimError } from '../../errors/invalid-oidc-subject-claim.error.js'
import { IdentityAuthCache } from './identity-auth-cache.js'
import { IdentityCreatedEvent } from './identity-created.event.js'
import { Identity } from './identity.entity.js'
import { IdentityRepository } from './identity-repository.js'
import type { OidcTrust } from '../oidc-trust.js'
import { OidcIdentityAuthenticator } from './oidc-identity-authenticator.js'

describe('OidcIdentityAuthenticator', () => {
  it('rejects a token whose configured subject claim is absent', async () => {
    const manager = createManager()

    await expect(manager.authenticate(createTrust(), { sub: 'not-the-configured-claim' }))
      .rejects.toThrow(InvalidOidcSubjectClaimError)
  })

  it('returns a cached identity for the token issuer and subject', async () => {
    const cache = createStubInstance(IdentityAuthCache)
    const cachedIdentity = { type: 'identity' } as const
    cache.getAuthenticatedIdentity.resolves(cachedIdentity as never)
    const identityRepository = createStubInstance(IdentityRepository)
    const manager = createManager({ cache, identityRepository })

    const identity = await manager.authenticate(createTrust(), { user_id: 'user-123' })

    expect(identity).toBe(cachedIdentity)
    expect(cache.getAuthenticatedIdentity.calledOnceWithExactly(
      'https://auth.example.test',
      'user-123'
    )).toBe(true)
    expect(identity.oidcTrustId).toBe('backoffice')
    expect(identityRepository.findByIssuerAndSubject.called).toBe(false)
  })

  it('creates, emits, and caches an identity when it does not exist', async () => {
    const cache = createStubInstance(IdentityAuthCache)
    cache.getAuthenticatedIdentity.resolves(null)
    cache.setAuthenticatedIdentity.resolves()
    const identityRepository = createStubInstance(IdentityRepository)
    identityRepository.findByIssuerAndSubject.resolves(null)
    identityRepository.insert.callsFake((identity: Identity) => {
      identity.uuid = 'identity-uuid' as never
      return Promise.resolve()
    })
    const domainEventEmitter = createStubInstance(DomainEventEmitter)
    domainEventEmitter.emitOne.resolves()
    const manager = createManager({ cache, domainEventEmitter, identityRepository })

    const identity = await manager.authenticate(createTrust(), {
      user_id: 'user-123',
      email: 'user@example.test'
    })

    expect(identity).toMatchObject({
      type: 'identity',
      issuer: 'https://auth.example.test',
      subject: 'user-123',
      claims: { email: 'user@example.test' }
    })
    expect(identityRepository.insert.calledOnce).toBe(true)
    const emittedEvent = domainEventEmitter.emitOne.firstCall.firstArg as IdentityCreatedEvent
    expect(emittedEvent).toBeInstanceOf(IdentityCreatedEvent)
    expect(emittedEvent.content).toEqual({ identityUuid: 'identity-uuid' })
    expect(cache.setAuthenticatedIdentity.calledOnceWithExactly(
      'https://auth.example.test',
      'user-123',
      identity
    )).toBe(true)
  })

  it('refetches an identity when another request creates it first', async () => {
    const cache = createStubInstance(IdentityAuthCache)
    cache.getAuthenticatedIdentity.resolves(null)
    cache.setAuthenticatedIdentity.resolves()
    const existingIdentity = new Identity()
    existingIdentity.uuid = 'identity-uuid' as never
    existingIdentity.issuer = 'https://auth.example.test'
    existingIdentity.subject = 'user-123'
    existingIdentity.claims = {}
    const identityRepository = createStubInstance(IdentityRepository)
    identityRepository.findByIssuerAndSubject.onFirstCall().resolves(null)
    identityRepository.findByIssuerAndSubject.onSecondCall().resolves(existingIdentity)
    const duplicateIdentityError = new TypeORMError('duplicate key value violates unique constraint')
    Object.defineProperty(duplicateIdentityError, 'name', { value: 'QueryFailedError' })
    identityRepository.insert.rejects(duplicateIdentityError)
    const domainEventEmitter = createStubInstance(DomainEventEmitter)
    const manager = createManager({ cache, domainEventEmitter, identityRepository })

    const identity = await manager.authenticate(createTrust(), { user_id: 'user-123' })

    expect(identity).toMatchObject({ type: 'identity', uuid: 'identity-uuid' })
    expect(identityRepository.findByIssuerAndSubject.callCount).toBe(2)
    expect(domainEventEmitter.emitOne.called).toBe(false)
  })
})

function createManager (overrides: {
  cache?: IdentityAuthCache
  domainEventEmitter?: DomainEventEmitter
  identityRepository?: IdentityRepository
} = {}): OidcIdentityAuthenticator {
  return new OidcIdentityAuthenticator(
    overrides.cache ?? createStubInstance(IdentityAuthCache),
    overrides.domainEventEmitter ?? createStubInstance(DomainEventEmitter),
    createDataSource(),
    overrides.identityRepository ?? createStubInstance(IdentityRepository)
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

function createDataSource (): DataSource {
  return {
    transaction: async <T>(runInTransaction: (manager: EntityManager) => Promise<T>): Promise<T> =>
      await runInTransaction({} as EntityManager)
  } as DataSource
}
