import { Inject, Injectable } from '@nestjs/common'
import { RedisClient, RedisCache } from '@wisemen/nestjs-redis'
import { AuthenticatedIdentity } from '../../principal/auth-principal.js'

export const IDENTITY_CACHE_CLIENT = 'wisemen.identity-cache-client'
export const IDENTITY_AUTH_CACHE_TTL_IN_SECONDS = 'wisemen.identity-auth-cache-ttl-in-seconds'
export const DEFAULT_IDENTITY_AUTH_CACHE_TTL_IN_SECONDS = 300

@Injectable()
export class IdentityAuthCache extends RedisCache {
  readonly prefix = 'identity-auth'

  constructor (
    @Inject(IDENTITY_CACHE_CLIENT) private client: RedisClient,
    @Inject(IDENTITY_AUTH_CACHE_TTL_IN_SECONDS) private ttlInSeconds: number
  ) {
    super()
  }

  async getAuthenticatedIdentity (issuer: string, subject: string): Promise<AuthenticatedIdentity | null> {
    const cacheKey = this.buildCacheKey(this.getIdentityKey(issuer, subject))
    return await this.client.getCachedValue<AuthenticatedIdentity>(cacheKey)
  }

  async setAuthenticatedIdentity (issuer: string, subject: string, identity: AuthenticatedIdentity): Promise<void> {
    const cacheKey = this.buildCacheKey(this.getIdentityKey(issuer, subject))
    await this.client.putCachedValue(cacheKey, identity, this.ttlInSeconds)
  }

  private getIdentityKey (issuer: string, subject: string): string {
    return `${issuer}:${subject}`
  }
}
