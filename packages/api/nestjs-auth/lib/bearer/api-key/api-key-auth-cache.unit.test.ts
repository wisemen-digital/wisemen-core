import { describe, it } from 'node:test'
import { expect } from 'expect'
import { createStubInstance } from 'sinon'
import { RedisClient } from '@wisemen/nestjs-redis'
import { generateUuid } from '@wisemen/nestjs-common'
import { ApiKeyAuthCache, DEFAULT_API_KEY_AUTH_CACHE_TTL_IN_SECONDS } from './api-key-auth-cache.js'
import { AuthenticatedApiKey } from '../principal/auth-principal.js'

describe('ApiKeyAuthCache unit tests', () => {
  it('returns the cached authorized api key', async () => {
    const redisClient = createStubInstance(RedisClient)
    const cache = new ApiKeyAuthCache(redisClient, DEFAULT_API_KEY_AUTH_CACHE_TTL_IN_SECONDS)

    const authorizedApiKey: AuthenticatedApiKey = {
      type: 'api-key' as const,
      uuid: generateUuid(),
      name: 'test-key',
      secretHash: '123',
      secretLastChars: '123',
      createdAt: new Date(),
      expiresAt: null,
      deletedAt: null
    }

    redisClient.getCachedValue.resolves(authorizedApiKey)

    const result = await cache.getAuthenticatedApiKey('secret-hash')

    expect(result).toEqual(authorizedApiKey)
  })

  it('stores the authorized api key under its secret hash with a 5 minute ttl', async () => {
    const redisClient = createStubInstance(RedisClient)
    const cache = new ApiKeyAuthCache(redisClient, DEFAULT_API_KEY_AUTH_CACHE_TTL_IN_SECONDS)

    const authorizedApiKey: AuthenticatedApiKey = {
      type: 'api-key' as const,
      uuid: generateUuid(),
      name: 'test-key',
      secretHash: '123',
      secretLastChars: '123',
      createdAt: new Date(),
      expiresAt: null,
      deletedAt: null
    }

    redisClient.putCachedValue.resolves()

    await cache.setAuthenticatedApiKey('secret-hash', authorizedApiKey)

    expect(redisClient.putCachedValue.calledOnceWithExactly(
      'api-key-auth.secret-hash',
      authorizedApiKey,
      300
    )).toBe(true)
  })

  it('uses the configured ttl when caching an authorized API key', async () => {
    const redisClient = createStubInstance(RedisClient)
    const cache = new ApiKeyAuthCache(redisClient, 60)
    const authorizedApiKey: AuthenticatedApiKey = {
      type: 'api-key' as const,
      uuid: generateUuid(),
      name: 'test-key',
      secretHash: '123',
      secretLastChars: '123',
      createdAt: new Date(),
      expiresAt: null,
      deletedAt: null
    }

    redisClient.putCachedValue.resolves()

    await cache.setAuthenticatedApiKey('secret-hash', authorizedApiKey)

    expect(redisClient.putCachedValue.calledOnceWithExactly(
      'api-key-auth.secret-hash',
      authorizedApiKey,
      60
    )).toBe(true)
  })

  it('deletes the cached authorized api key for its secret hash', async () => {
    const redisClient = createStubInstance(RedisClient)
    const cache = new ApiKeyAuthCache(redisClient, DEFAULT_API_KEY_AUTH_CACHE_TTL_IN_SECONDS)

    redisClient.deleteCachedValue.resolves()

    await cache.deleteAuthorizedApiKey('secret-hash')

    expect(redisClient.deleteCachedValue.calledOnceWithExactly('api-key-auth.secret-hash')).toBe(true)
  })
})
