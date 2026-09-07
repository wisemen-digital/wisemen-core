import { createJwtVerifier, decodeJwtPayload, InvalidOrExpiredTokenError, type JwtVerifier } from '@wisemen/nestjs-jwt-verifier'
import { DynamicOidcTrust } from './dynamic-oidc-trust.entity.js'
import type { DynamicOidcTrustRepository } from './dynamic-oidc-trust.repository.js'

export const DEFAULT_DYNAMIC_OIDC_TRUST_CACHE_TTL_IN_SECONDS = 300

export interface ResolvedDynamicOidcTrust {
  trust: DynamicOidcTrust
  verifier: JwtVerifier
}

interface CachedDynamicOidcTrust extends ResolvedDynamicOidcTrust {
  expiresAt: number
}

/**
 * Resolves the unverified issuer and audience claims to a configured database
 * trust. Cached verifiers stay local because their remote-JWKS state is kept
 * in memory by `jose`.
 */
export class DynamicOidcTrustResolver {
  private cache = new Map<string, CachedDynamicOidcTrust>()

  constructor (
    private repository: DynamicOidcTrustRepository,
    private cacheTtlInSeconds: number
  ) { }

  async resolve (token: string): Promise<ResolvedDynamicOidcTrust> {
    const tokenContent = decodeJwtPayload(token)
    const issuer = this.getIssuer(tokenContent.iss)
    const audiences = this.getAudiences(tokenContent.aud)
    const cachedTrust = this.getCachedTrust(issuer, audiences)

    if (cachedTrust != null) {
      return cachedTrust
    }

    const trust = await this.repository.findByIssuerAndAudiences(issuer, audiences)
    if (trust == null) {
      throw new InvalidOrExpiredTokenError()
    }

    const resolvedTrust: ResolvedDynamicOidcTrust = {
      trust,
      verifier: createJwtVerifier(trust)
    }

    this.cacheTrust(resolvedTrust)

    return resolvedTrust
  }

  private getCachedTrust (
    issuer: string,
    audiences: readonly string[]
  ): ResolvedDynamicOidcTrust | null {
    for (const audience of audiences) {
      const cachedTrust = this.cache.get(this.getCacheKey(issuer, audience))

      if (cachedTrust == null) {
        continue
      }

      if (cachedTrust.expiresAt > Date.now()) {
        return {
          trust: cachedTrust.trust,
          verifier: cachedTrust.verifier
        }
      }

      this.cache.delete(this.getCacheKey(issuer, audience))
    }

    return null
  }

  private cacheTrust (resolvedTrust: ResolvedDynamicOidcTrust): void {
    const expiresAt = Date.now() + (this.cacheTtlInSeconds * 1000)

    for (const audience of resolvedTrust.trust.audiences) {
      this.cache.set(this.getCacheKey(resolvedTrust.trust.issuer, audience), {
        ...resolvedTrust,
        expiresAt
      })
    }
  }

  private getIssuer (issuer: unknown): string {
    if (typeof issuer !== 'string') {
      throw new InvalidOrExpiredTokenError()
    }

    return issuer
  }

  private getAudiences (audience: unknown): string[] {
    if (typeof audience === 'string') {
      return [audience]
    }

    if (Array.isArray(audience) && audience.length > 0 && audience.every(item => typeof item === 'string')) {
      return audience
    }

    throw new InvalidOrExpiredTokenError()
  }

  private getCacheKey (issuer: string, audience: string): string {
    return `${issuer}:${audience}`
  }
}
