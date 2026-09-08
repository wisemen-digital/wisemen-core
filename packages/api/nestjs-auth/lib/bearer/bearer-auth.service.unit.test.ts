import { describe, it } from 'node:test'
import { expect } from 'expect'
import { generateUuid } from '@wisemen/nestjs-common'
import { DomainEventEmitter } from '@wisemen/nestjs-domain-events'
import type { TypeOrmRepository } from '@wisemen/nestjs-typeorm'
import type { DataSource, EntityManager } from 'typeorm'
import { stub } from 'sinon'
import { ApiKey } from './api-key/api-key.entity.js'
import { ApiKeyCreatedEvent } from './api-key/api-key.events.js'
import { ApiKeyAuthCache } from './api-key/api-key-auth-cache.js'
import { BearerAuthService } from './bearer-auth.service.js'
import { DynamicOidcTrust } from './oidc/dynamic-oidc/dynamic-oidc-trust.entity.js'
import { DynamicOidcTrustDeletedEvent } from './oidc/dynamic-oidc/dynamic-oidc-trust.events.js'
import { DynamicOidcTrustResolver } from './oidc/dynamic-oidc/dynamic-oidc-trust-resolver.js'

describe('BearerAuthService', () => {
  it('persists an API key and emits its UUID within the transaction', async () => {
    const apiKey = buildApiKey()
    const apiKeyRepo = {
      create: stub().returns(apiKey),
      insert: stub().resolves()
    }
    const eventEmitter = { emitOne: stub().resolves() }
    const service = createService({ apiKeyRepo, eventEmitter })

    const result = await service.createApiKey({
      name: apiKey.name,
      secretHash: apiKey.secretHash,
      secretLastChars: apiKey.secretLastChars,
      expiresAt: apiKey.expiresAt
    })

    expect(result).toBe(apiKey)
    expect(apiKeyRepo.insert.calledOnceWithExactly(apiKey)).toBe(true)
    expect(eventEmitter.emitOne.calledOnce).toBe(true)

    const event = eventEmitter.emitOne.firstCall.firstArg as unknown as ApiKeyCreatedEvent
    expect(event).toBeInstanceOf(ApiKeyCreatedEvent)
    expect(event.content).toEqual({ apiKeyUuid: apiKey.uuid })
  })

  it('emits the dynamic-trust ID and clears its cached verifiers after commit', async () => {
    const trust = buildDynamicOidcTrust()
    const oidcRepo = {
      delete: stub().resolves({ affected: 1 })
    }
    const eventEmitter = { emitOne: stub().resolves() }
    const dynamicOidcTrustResolver = { clearTrustCache: stub() }
    const service = createService({ oidcRepo, eventEmitter, dynamicOidcTrustResolver })

    const result = await service.deleteDynamicOidcTrust(trust.id)

    expect(result).toBe(true)
    expect(oidcRepo.delete.calledOnceWithExactly(trust.id)).toBe(true)
    const event = eventEmitter.emitOne.firstCall.firstArg as unknown as DynamicOidcTrustDeletedEvent
    expect(event).toBeInstanceOf(DynamicOidcTrustDeletedEvent)
    expect(event.content).toEqual({ oidcTrustId: trust.id })
    expect(dynamicOidcTrustResolver.clearTrustCache.calledOnceWithExactly(trust.id)).toBe(true)
  })
})

function createService (overrides: {
  apiKeyRepo?: object
  oidcRepo?: object
  eventEmitter?: object
  apiKeyAuthCache?: object
  dynamicOidcTrustResolver?: object
}): BearerAuthService {
  const dataSource = {
    transaction: async <T> (runInTransaction: (manager: EntityManager) => Promise<T>): Promise<T> =>
      await runInTransaction({} as EntityManager)
  } as DataSource

  return new BearerAuthService(
    dataSource,
    (overrides.oidcRepo ?? {}) as TypeOrmRepository<DynamicOidcTrust>,
    (overrides.apiKeyRepo ?? {}) as TypeOrmRepository<ApiKey>,
    (overrides.eventEmitter ?? {}) as DomainEventEmitter,
    (overrides.apiKeyAuthCache ?? {}) as ApiKeyAuthCache,
    (overrides.dynamicOidcTrustResolver ?? {}) as DynamicOidcTrustResolver
  )
}

function buildApiKey (): ApiKey {
  return {
    uuid: generateUuid(),
    createdAt: new Date('2026-09-08T10:00:00.000Z'),
    deletedAt: null,
    expiresAt: new Date('2026-10-08T10:00:00.000Z'),
    name: 'Primary key',
    secretHash: 'previous-secret-hash',
    secretLastChars: 'cret'
  }
}

function buildDynamicOidcTrust (): DynamicOidcTrust {
  return {
    id: generateUuid(),
    createdAt: new Date('2026-09-08T10:00:00.000Z'),
    updatedAt: new Date('2026-09-08T10:01:00.000Z'),
    issuer: 'https://issuer.example.test',
    audiences: ['api.example.test'],
    jwksEndpoint: 'https://issuer.example.test/.well-known/jwks.json',
    claims: {
      sub: 'sub',
      additional: ['email']
    }
  }
}
