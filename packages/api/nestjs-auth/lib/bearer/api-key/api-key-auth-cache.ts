import { Inject, Injectable } from '@nestjs/common'
import { AuthenticatedApiKey } from '../principal/auth-principal.js'
import { RedisCache, RedisClient } from '@wisemen/nestjs-redis'

export const API_KEY_CACHE_CLIENT = 'wisemen.api-key-cache-client'
export const API_KEY_AUTH_CACHE_TTL_IN_SECONDS = 'wisemen.api-key-auth-cache-ttl-in-seconds'
export const DEFAULT_API_KEY_AUTH_CACHE_TTL_IN_SECONDS = 300

@Injectable()
export class ApiKeyAuthCache extends RedisCache {
  readonly prefix = 'api-key-auth'

  constructor (
    @Inject(API_KEY_CACHE_CLIENT) private client: RedisClient,
    @Inject(API_KEY_AUTH_CACHE_TTL_IN_SECONDS) private ttlInSeconds: number
  ) {
    super()
  }

  async getAuthenticatedApiKey (secretHash: string): Promise<AuthenticatedApiKey | null> {
    const cacheKey = this.buildCacheKey(secretHash)
    return await this.client.getCachedValue<AuthenticatedApiKey>(cacheKey)
  }

  async setAuthenticatedApiKey (secretHash: string, apiKey: AuthenticatedApiKey): Promise<void> {
    const cacheKey = this.buildCacheKey(secretHash)
    await this.client.putCachedValue(cacheKey, apiKey, this.ttlInSeconds)
  }

  async deleteAuthorizedApiKey (secretHash: string): Promise<void> {
    const cacheKey = this.buildCacheKey(secretHash)
    await this.client.deleteCachedValue(cacheKey)
  }
}
