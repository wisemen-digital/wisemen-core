import type { FactoryProvider, ModuleMetadata } from '@nestjs/common'
import type { DomainEventEmitter } from '@wisemen/nestjs-domain-events'
import type { RedisClient } from '@wisemen/nestjs-redis'
import type { OidcTrustOptions, StaticOidcTrusts } from './oidc/oidc-trust.js'

/**
 * Runtime dependencies supplied by the consuming application. OIDC trusts are
 * registered separately so that their IDs are available while Nest builds the
 * module graph.
 */
export interface BearerAuthConfig {
  redisClient: RedisClient

  /**
   * Application-owned emitter used by OIDC authentication flows.
   *
   * The auth package does not install its own event-emitter module, ensuring
   * identity events use the same transaction middleware and subscribers as the
   * consuming application.
   */
  domainEventEmitter: DomainEventEmitter

  /**
   * TTL for cached API-key authentication results, in seconds.
   * Defaults to `300` seconds (5 minutes).
   */
  apiKeyAuthCacheTtlInSeconds?: number

  /**
   * TTL for cached identity authentication results, in seconds.
   * Defaults to `300` seconds (5 minutes).
   */
  identityAuthCacheTtlInSeconds?: number

  /**
   * TTL for locally cached dynamic trust verifiers, in seconds.
   * Defaults to `300` seconds (5 minutes).
   */
  dynamicOidcTrustCacheTtlInSeconds?: number
}

export interface BearerAuthModuleOptions extends BearerAuthConfig {
  oidcTrusts?: StaticOidcTrusts
}

/**
 * Async configuration for one statically known OIDC trust.
 */
export interface OidcTrustAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: FactoryProvider['inject']
  useFactory: (...dependencies: unknown[]) => Promise<OidcTrustOptions> | OidcTrustOptions
}

/**
 * Async root configuration for the auth package.
 *
 * Trust IDs are object keys, rather than factory output, so the module can
 * create a dedicated named verifier provider for every static trust.
 */
export interface BearerAuthModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: FactoryProvider['inject']
  useFactory: (...dependencies: unknown[]) => Promise<BearerAuthConfig> | BearerAuthConfig
  oidcTrusts?: Readonly<Record<string, OidcTrustAsyncOptions>>
}
