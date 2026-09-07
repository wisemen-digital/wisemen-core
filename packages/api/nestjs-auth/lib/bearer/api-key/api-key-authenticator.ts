import { Injectable } from '@nestjs/common'
import { ApiKey } from './api-key.entity.js'
import { AuthenticatedApiKey } from '../principal/auth-principal.js'
import { InjectRepository, TypeOrmRepository } from '@wisemen/nestjs-typeorm'
import { ApiKeySecret } from './api-key-secret.js'
import { ApiKeyAuthCache } from './api-key-auth-cache.js'
import { InvalidOrExpiredApiKeyError } from '../errors/invalid-or-expired-api-key.error.js'

@Injectable()
export class ApiKeyAuthenticator {
  constructor (
    @InjectRepository(ApiKey)
    private repository: TypeOrmRepository<ApiKey>,
    private cache: ApiKeyAuthCache
  ) {}

  async authenticate (token: string): Promise<AuthenticatedApiKey> {
    const secret = new ApiKeySecret(token)
    const cachedApiKey = await this.cache.getAuthenticatedApiKey(secret.hash)

    if (cachedApiKey != null) {
      return cachedApiKey
    }

    const authorizedApiKey = await this.fetchApiKey(secret)

    await this.cache.setAuthenticatedApiKey(secret.hash, authorizedApiKey)

    return authorizedApiKey
  }

  private async fetchApiKey (secret: ApiKeySecret): Promise<AuthenticatedApiKey> {
    const apiKey = await this.repository.findOneBy({ secretHash: secret.hash })

    if (apiKey == null || apiKey.deletedAt != null || this.isExpired(apiKey.expiresAt)) {
      throw new InvalidOrExpiredApiKeyError()
    }

    const authenticatedKey = apiKey as AuthenticatedApiKey
    authenticatedKey.type = 'api-key'

    return authenticatedKey
  }

  private isExpired (expiresAt: Date | null): boolean {
    return expiresAt != null && expiresAt < new Date()
  }
}
