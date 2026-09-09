import type { DomainEventEmitter } from '@wisemen/nestjs-domain-events'
import { transaction } from '@wisemen/nestjs-typeorm'
import { TypeORMError, type DataSource } from 'typeorm'
import { IdentityNotFoundAfterCreationError } from '../../errors/identity-not-found-after-creation.error.js'
import { InvalidOidcSubjectClaimError } from '../../errors/invalid-oidc-subject-claim.error.js'
import type { IdentityAuthCache } from './identity-auth-cache.js'
import { IdentityCreatedEvent } from './identity-created.event.js'
import { Identity } from './identity.entity.js'
import type { IdentityRepository } from './identity-repository.js'
import type { AuthenticatedIdentity } from '../../principal/auth-principal.js'
import { selectOidcCustomClaims, type OidcTrust } from '../oidc-trust.js'

type OidcTokenContent = Record<string, unknown>

/**
 * Resolves and provisions identities for verified OIDC token content.
 *
 * OIDC authenticators delegate here after their trust-specific verification
 * has completed.
 */
export class OidcIdentityAuthenticator {
  constructor (
    private cache: IdentityAuthCache,
    private domainEventEmitter: DomainEventEmitter,
    private dataSource: DataSource,
    private identityRepository: IdentityRepository
  ) { }

  async authenticate<TClaims extends object = object> (
    trust: OidcTrust,
    tokenContent: OidcTokenContent
  ): Promise<AuthenticatedIdentity<TClaims>> {
    const subject = tokenContent[trust.claims.sub]
    if (typeof subject !== 'string') {
      throw new InvalidOidcSubjectClaimError()
    }

    const cachedIdentity = await this.cache.getAuthenticatedIdentity(trust.issuer, subject)
    if (cachedIdentity != null) {
      cachedIdentity.oidcTrustId = trust.id
      return cachedIdentity as AuthenticatedIdentity<TClaims>
    }

    const identity = await this.getOrCreateIdentity(trust, subject, tokenContent)
    const authenticatedIdentity = identity as AuthenticatedIdentity
    authenticatedIdentity.type = 'identity'
    authenticatedIdentity.oidcTrustId = trust.id

    await this.cache.setAuthenticatedIdentity(trust.issuer, subject, authenticatedIdentity)

    return authenticatedIdentity as AuthenticatedIdentity<TClaims>
  }

  private async getOrCreateIdentity (
    trust: OidcTrust,
    subject: string,
    tokenContent: OidcTokenContent
  ): Promise<Identity> {
    let identity = await this.identityRepository.findByIssuerAndSubject(trust.issuer, subject)

    if (identity != null) {
      return identity
    }

    identity = new Identity()
    identity.issuer = trust.issuer
    identity.subject = subject
    identity.claims = selectOidcCustomClaims(tokenContent, trust.claims)

    try {
      await transaction(this.dataSource, async () => {
        await this.identityRepository.insert(identity)
        await this.domainEventEmitter.emitOne(new IdentityCreatedEvent(identity.uuid))
      })
    } catch (error) {
      if (this.identityHasBeenCreatedSimultaneously(error)) {
        return await this.refetchIdentity(trust.issuer, subject)
      }

      throw error
    }

    return identity
  }

  private async refetchIdentity (issuer: string, subject: string): Promise<Identity> {
    const identity = await this.identityRepository.findByIssuerAndSubject(issuer, subject)

    if (identity != null) {
      return identity
    }

    throw new IdentityNotFoundAfterCreationError()
  }

  private identityHasBeenCreatedSimultaneously (error: unknown): error is TypeORMError {
    return error instanceof TypeORMError
      && error.name === 'QueryFailedError'
      && error.message.startsWith('duplicate key')
  }
}
