import { Inject, Injectable } from '@nestjs/common'
import { DomainEventEmitter } from '@wisemen/nestjs-domain-events'
import { EntityInsert, InjectDataSource, InjectRepository, transaction, TypeOrmRepository } from '@wisemen/nestjs-typeorm'
import type { DataSource } from 'typeorm'
import { ApiKey } from './api-key/api-key.entity.js'
import type { ApiKeyUuid } from './api-key/api-key.uuid.js'
import { ApiKeyCreatedEvent, ApiKeyDeletedEvent } from './api-key/api-key.events.js'
import { DynamicOidcTrust } from './oidc/dynamic-oidc/dynamic-oidc-trust.entity.js'
import { DynamicOidcTrustCreatedEvent, DynamicOidcTrustDeletedEvent, DynamicOidcTrustUpdatedEvent } from './oidc/dynamic-oidc/dynamic-oidc-trust.events.js'
import type { OidcTrustUuid } from './oidc/oidc-trust.uuid.js'
import { ApiKeyAuthCache } from './api-key/api-key-auth-cache.js'
import { DynamicOidcTrustResolver } from './oidc/dynamic-oidc/dynamic-oidc-trust-resolver.js'
import { DOMAIN_EVENT_EMITTER } from './bearer-auth.tokens.js'

export type ApiKeyInsert = EntityInsert<Omit<ApiKey, 'deletedAt'>>

export type DynamicOidcTrustInsert = EntityInsert<Omit<DynamicOidcTrust, 'id' | 'createdAt' | 'updatedAt'>>
export type DynamicOidcTrustUpdate = Partial<DynamicOidcTrustInsert>

@Injectable()
export class BearerAuthService {
  constructor (
    @InjectDataSource()
    private dataSource: DataSource,
    @InjectRepository(DynamicOidcTrust) 
    private oidcRepo: TypeOrmRepository<DynamicOidcTrust>,
    @InjectRepository(ApiKey)
    private apiKeyRepo: TypeOrmRepository<ApiKey>,
    @Inject(DOMAIN_EVENT_EMITTER)
    private emitter: DomainEventEmitter,
    private apiKeyAuthCache: ApiKeyAuthCache,
    private dynamicOidcTrustResolver: DynamicOidcTrustResolver
  ) { }

  /**
   * Creates an API key and emits `api-key.created` in the same transaction.
   *
   * @returns The persisted API key.
   */
  async createApiKey (insert: ApiKeyInsert): Promise<ApiKey> {
    const apiKey = this.apiKeyRepo.create(insert)

    return await transaction(this.dataSource, async () => {
      await this.apiKeyRepo.insert(apiKey)
      await this.emitter.emitOne(new ApiKeyCreatedEvent(apiKey.uuid))

      return apiKey
    })
  }

  /**
   * Finds a non-deleted API key by UUID.
   *
   * @returns The API key, or `null` when it does not exist or was deleted.
   */
  async findApiKey (uuid: ApiKeyUuid): Promise<ApiKey | null> {
    return await this.apiKeyRepo.findOneBy({ uuid })
  }

  /**
   * Soft-deletes an API key, emits `api-key.deleted` in the transaction, and
   * invalidates its authentication cache entry after the transaction commits.
   *
   * @returns `true` when the API key was deleted, otherwise `false`.
   */
  async deleteApiKey (uuid: ApiKeyUuid): Promise<boolean> {
    const secretHash = await transaction(this.dataSource, async () => {
      const apiKey = await this.apiKeyRepo.findOneBy({ uuid })
      if (apiKey == null) {
        return null
      }

      const result = await this.apiKeyRepo.softDelete({ uuid })
      if (result.affected !== 1) {
        return null
      }

      await this.emitter.emitOne(new ApiKeyDeletedEvent(uuid))

      return apiKey.secretHash
    })

    if (secretHash == null) {
      return false
    }

    await this.apiKeyAuthCache.deleteAuthorizedApiKey(secretHash)
    return true
  }

  /**
   * Creates a dynamic OIDC trust and emits `dynamic-oidc-trust.created` in the
   * same transaction.
   *
   * @returns The persisted dynamic OIDC trust.
   */
  async createDynamicOidcTrust (insert: DynamicOidcTrustInsert): Promise<DynamicOidcTrust> {
    const trust = this.oidcRepo.create(insert)

    return await transaction(this.dataSource, async () => {
      await this.oidcRepo.insert(trust)
      await this.emitter.emitOne(new DynamicOidcTrustCreatedEvent(trust.id))

      return trust
    })
  }

  /**
   * Finds a dynamic OIDC trust by its persistent ID.
   *
   * @returns The trust, or `null` when it does not exist.
   */
  async findDynamicOidcTrust (id: OidcTrustUuid): Promise<DynamicOidcTrust | null> {
    return await this.oidcRepo.findOneBy({ id })
  }

  /**
   * Updates a dynamic OIDC trust, emits `dynamic-oidc-trust.updated` in the
   * transaction, and clears that trust's cached verifiers after commit.
   *
   * @returns `true` when the trust was updated, otherwise `false`.
   */
  async updateDynamicOidcTrust (
    id: OidcTrustUuid,
    update: DynamicOidcTrustUpdate
  ): Promise<boolean> {
    const updated = await transaction(this.dataSource, async () => {
      const result = await this.oidcRepo.update(id, update)
      if (result.affected !== 1) {
        return false
      }

      await this.emitter.emitOne(new DynamicOidcTrustUpdatedEvent(id))
      return true
    })

    if (updated) {
      this.dynamicOidcTrustResolver.clearTrustCache(id)
    }

    return updated
  }

  /**
   * Deletes a dynamic OIDC trust, emits `dynamic-oidc-trust.deleted` in the
   * transaction, and clears that trust's cached verifiers after commit.
   *
   * @returns `true` when the trust was deleted, otherwise `false`.
   */
  async deleteDynamicOidcTrust (id: OidcTrustUuid): Promise<boolean> {
    const deleted = await transaction(this.dataSource, async () => {
      const result = await this.oidcRepo.delete(id)
      if (result.affected !== 1) {
        return false
      }

      await this.emitter.emitOne(new DynamicOidcTrustDeletedEvent(id))
      return true
    })

    if (deleted) {
      this.dynamicOidcTrustResolver.clearTrustCache(id)
    }

    return deleted
  }
}
