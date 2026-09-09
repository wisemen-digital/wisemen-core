import { DynamicModule, Module, type Provider } from '@nestjs/common'
import type { DomainEventEmitter } from '@wisemen/nestjs-domain-events'
import { JwtVerifierModule, type JwtVerifier, type JwtVerifierOptions } from '@wisemen/nestjs-jwt-verifier'
import { API_KEY_AUTH_CACHE_TTL_IN_SECONDS, API_KEY_CACHE_CLIENT, ApiKeyAuthCache, DEFAULT_API_KEY_AUTH_CACHE_TTL_IN_SECONDS } from './api-key/api-key-auth-cache.js'
import { ApiKeyAuthenticator } from './api-key/api-key-authenticator.js'
import { getDataSourceToken, TypeOrmModule } from '@wisemen/nestjs-typeorm'
import type { DataSource } from 'typeorm'
import { ApiKey } from './api-key/api-key.entity.js'
import { Identity } from './oidc/identity/identity.entity.js'
import { DEFAULT_IDENTITY_AUTH_CACHE_TTL_IN_SECONDS, IDENTITY_AUTH_CACHE_TTL_IN_SECONDS, IDENTITY_CACHE_CLIENT, IdentityAuthCache } from './oidc/identity/identity-auth-cache.js'
import { IdentityRepository } from './oidc/identity/identity-repository.js'
import { Authenticator } from './authenticator/authenticator.js'
import type { BearerAuthConfig, BearerAuthModuleAsyncOptions, BearerAuthModuleOptions, OidcTrustAsyncOptions } from './bearer-auth-module-options.js'
import { DynamicOidcAuthenticator } from './oidc/dynamic-oidc/dynamic-oidc-authenticator.js'
import { OidcIdentityAuthenticator } from './oidc/identity/oidc-identity-authenticator.js'
import { DynamicOidcTrust } from './oidc/dynamic-oidc/dynamic-oidc-trust.entity.js'
import { DynamicOidcTrustRepository } from './oidc/dynamic-oidc/dynamic-oidc-trust.repository.js'
import { DEFAULT_DYNAMIC_OIDC_TRUST_CACHE_TTL_IN_SECONDS, DynamicOidcTrustResolver } from './oidc/dynamic-oidc/dynamic-oidc-trust-resolver.js'
import { resolveOidcTrust, type OidcTrust, type OidcTrustId, type OidcTrustOptions } from './oidc/oidc-trust.js'
import { getOidcAuthenticatorToken, getOidcTrustToken, getOidcTrustVerifierToken } from './oidc/oidc-trust.tokens.js'
import { StaticOidcAuthenticator } from './oidc/static-oidc/static-oidc-authenticator.js'
import { getAuthenticatorToken } from './authenticator/authenticator.tokens.js'
import { BearerAuthContext } from './bearer-auth.context.js'
import { BearerAuthMiddleware } from './middleware/bearer-auth.middleware.js'
import { getMiddlewareToken } from './middleware/middleware.tokens.js'
import { BearerAuthService } from './bearer-auth.service.js'
import {
  AUTH_CONFIG,
  DOMAIN_EVENT_EMITTER,
  DYNAMIC_OIDC_TRUST_CACHE_TTL_IN_SECONDS
} from './bearer-auth.tokens.js'

export {
  AUTH_CONFIG,
  DOMAIN_EVENT_EMITTER,
  DYNAMIC_OIDC_TRUST_CACHE_TTL_IN_SECONDS
} from './bearer-auth.tokens.js'

@Module({})
export class BearerAuthModule {
  static forRoot (options: BearerAuthModuleOptions): DynamicModule {
    const oidcTrustEntries = Object.entries(options.oidcTrusts ?? {})

    return this.createModuleDefinition({
      authConfigProvider: {
        provide: AUTH_CONFIG,
        useValue: {
          redisClient: options.redisClient,
          domainEventEmitter: options.domainEventEmitter,
          apiKeyAuthCacheTtlInSeconds: options.apiKeyAuthCacheTtlInSeconds,
          identityAuthCacheTtlInSeconds: options.identityAuthCacheTtlInSeconds,
          dynamicOidcTrustCacheTtlInSeconds: options.dynamicOidcTrustCacheTtlInSeconds
        }
      },
      imports: oidcTrustEntries.map(([id, trust]) =>
        JwtVerifierModule.register({
          name: this.getVerifierName(id),
          issuer: trust.issuer,
          audiences: trust.audiences,
          jwksEndpoint: trust.jwksEndpoint
        })
      ),
      oidcTrustProviders: oidcTrustEntries.map(([id, trust]) =>
        this.createStaticOidcTrustProvider(id, trust)
      ),
      oidcAuthenticatorProviders: oidcTrustEntries.map(([id]) =>
        this.createStaticOidcAuthenticatorProvider(id)
      ),
      authenticatorProviders: oidcTrustEntries.map(([id]) =>
        this.createAuthenticatorProvider(id)
      ),
      oidcTrustIds: oidcTrustEntries.map(([id]) => id)
    })
  }

  static forRootAsync (options: BearerAuthModuleAsyncOptions): DynamicModule {
    const oidcTrustEntries = Object.entries(options.oidcTrusts ?? {})

    return this.createModuleDefinition({
      authConfigProvider: {
        provide: AUTH_CONFIG,
        inject: options.inject ?? [],
        useFactory: options.useFactory
      },
      imports: [
        ...(options.imports ?? []),
        ...oidcTrustEntries.map(([id, trust]) =>
          JwtVerifierModule.registerAsync({
            name: this.getVerifierName(id),
            imports: trust.imports,
            inject: trust.inject,
            useFactory: async (...dependencies: unknown[]): Promise<JwtVerifierOptions> =>
              this.toJwtVerifierOptions(await trust.useFactory(...dependencies))
          })
        )
      ],
      oidcTrustProviders: oidcTrustEntries.map(([id, trust]) =>
        this.createAsyncOidcTrustProvider(id, trust)
      ),
      oidcAuthenticatorProviders: oidcTrustEntries.map(([id]) =>
        this.createStaticOidcAuthenticatorProvider(id)
      ),
      authenticatorProviders: oidcTrustEntries.map(([id]) =>
        this.createAuthenticatorProvider(id)
      ),
      oidcTrustIds: oidcTrustEntries.map(([id]) => id)
    })
  }

  private static createModuleDefinition (options: {
    authConfigProvider: Provider
    imports: DynamicModule['imports']
    oidcTrustProviders: Provider[]
    oidcAuthenticatorProviders: Provider[]
    authenticatorProviders: Provider[]
    oidcTrustIds: OidcTrustId[]
  }): DynamicModule {
    return {
      module: BearerAuthModule,
      imports: [
        ...(options.imports ?? []),
        TypeOrmModule.forFeature([ApiKey, Identity, DynamicOidcTrust])
      ],
      providers: [
        options.authConfigProvider,
        {
          provide: API_KEY_CACHE_CLIENT,
          inject: [AUTH_CONFIG],
          useFactory: (cfg: BearerAuthConfig) => {
            return cfg.redisClient
          }
        },
        {
          provide: API_KEY_AUTH_CACHE_TTL_IN_SECONDS,
          inject: [AUTH_CONFIG],
          useFactory: (cfg: BearerAuthConfig): number =>
            cfg.apiKeyAuthCacheTtlInSeconds ?? DEFAULT_API_KEY_AUTH_CACHE_TTL_IN_SECONDS
        },
        {
          provide: IDENTITY_CACHE_CLIENT,
          inject: [AUTH_CONFIG],
          useFactory: (cfg: BearerAuthConfig) => {
            return cfg.redisClient
          }
        },
        {
          provide: IDENTITY_AUTH_CACHE_TTL_IN_SECONDS,
          inject: [AUTH_CONFIG],
          useFactory: (cfg: BearerAuthConfig): number =>
            cfg.identityAuthCacheTtlInSeconds ?? DEFAULT_IDENTITY_AUTH_CACHE_TTL_IN_SECONDS
        },
        {
          provide: DOMAIN_EVENT_EMITTER,
          inject: [AUTH_CONFIG],
          useFactory: (cfg: BearerAuthConfig): DomainEventEmitter => cfg.domainEventEmitter
        },
        {
          provide: DYNAMIC_OIDC_TRUST_CACHE_TTL_IN_SECONDS,
          inject: [AUTH_CONFIG],
          useFactory: (cfg: BearerAuthConfig): number =>
            cfg.dynamicOidcTrustCacheTtlInSeconds ?? DEFAULT_DYNAMIC_OIDC_TRUST_CACHE_TTL_IN_SECONDS
        },
        ApiKeyAuthCache,
        IdentityAuthCache,
        IdentityRepository,
        BearerAuthContext,
        BearerAuthService,
        DynamicOidcTrustRepository,
        {
          provide: OidcIdentityAuthenticator,
          inject: [IdentityAuthCache, DOMAIN_EVENT_EMITTER, getDataSourceToken(), IdentityRepository],
          useFactory: (
            identityAuthCache: IdentityAuthCache,
            domainEventEmitter: DomainEventEmitter,
            dataSource: DataSource,
            identityRepository: IdentityRepository
          ): OidcIdentityAuthenticator =>
            new OidcIdentityAuthenticator(
              identityAuthCache,
              domainEventEmitter,
              dataSource,
              identityRepository
            )
        },
        {
          provide: DynamicOidcTrustResolver,
          inject: [DynamicOidcTrustRepository, DYNAMIC_OIDC_TRUST_CACHE_TTL_IN_SECONDS],
          useFactory: (
            dynamicOidcTrustRepository: DynamicOidcTrustRepository,
            cacheTtlInSeconds: number
          ): DynamicOidcTrustResolver =>
            new DynamicOidcTrustResolver(dynamicOidcTrustRepository, cacheTtlInSeconds)
        },
        {
          provide: DynamicOidcAuthenticator,
          inject: [
            DynamicOidcTrustResolver,
            OidcIdentityAuthenticator
          ],
          useFactory: (
            dynamicOidcTrustResolver: DynamicOidcTrustResolver,
            oidcIdentityAuthenticator: OidcIdentityAuthenticator
          ): DynamicOidcAuthenticator =>
            new DynamicOidcAuthenticator(
              dynamicOidcTrustResolver,
              oidcIdentityAuthenticator
            )
        },
        ApiKeyAuthenticator,
        {
          provide: Authenticator,
          inject: [ApiKeyAuthenticator, DynamicOidcAuthenticator],
          useFactory: (
            apiKeyAuthenticator: ApiKeyAuthenticator,
            dynamicOidcAuthenticator: DynamicOidcAuthenticator
          ): Authenticator => new Authenticator(apiKeyAuthenticator, dynamicOidcAuthenticator)
        },
        {
          provide: BearerAuthMiddleware,
          inject: [Authenticator, BearerAuthContext],
          useFactory: (
            authenticator: Authenticator,
            context: BearerAuthContext
          // oxlint-disable-next-line typescript/no-unsafe-function-type
          ): Function => {
            const instance = new BearerAuthMiddleware(authenticator, context)
            return instance.use.bind(instance)
          }
        },
        ...options.oidcTrustProviders,
        ...options.oidcAuthenticatorProviders,
        ...options.authenticatorProviders,
        ...options.oidcTrustIds.map(id => this.createMiddlewareProvider(id))
      ],
      exports: [
        ApiKeyAuthenticator,
        Authenticator,
        DynamicOidcAuthenticator,
        BearerAuthContext,
        BearerAuthService,
        BearerAuthMiddleware,
        ...options.oidcTrustIds.flatMap(id => [getAuthenticatorToken(id)]),
        ...options.oidcTrustIds.flatMap(id => [getMiddlewareToken(id)])
      ]
    }
  }

  private static createStaticOidcTrustProvider (
    id: OidcTrustId,
    options: OidcTrustOptions
  ): Provider {
    return {
      provide: getOidcTrustToken(id),
      useValue: this.createOidcTrust(id, options)
    }
  }

  private static createAsyncOidcTrustProvider (
    id: OidcTrustId,
    options: OidcTrustAsyncOptions
  ): Provider {
    return {
      provide: getOidcTrustToken(id),
      inject: options.inject ?? [],
      useFactory: async (...dependencies: unknown[]): Promise<OidcTrust> =>
        this.createOidcTrust(id, await options.useFactory(...dependencies))
    }
  }

  private static createStaticOidcAuthenticatorProvider (id: OidcTrustId): Provider {
    return {
      provide: getOidcAuthenticatorToken(id),
      inject: [
        getOidcTrustToken(id),
        getOidcTrustVerifierToken(id),
        OidcIdentityAuthenticator
      ],
      useFactory: (
        trust: OidcTrust,
        verifier: JwtVerifier,
        oidcIdentityAuthenticator: OidcIdentityAuthenticator
      ): StaticOidcAuthenticator =>
        new StaticOidcAuthenticator(
          trust,
          verifier,
          oidcIdentityAuthenticator
        )
    }
  }

  private static createAuthenticatorProvider (id: OidcTrustId): Provider {
    return {
      provide: getAuthenticatorToken(id),
      inject: [ApiKeyAuthenticator, getOidcAuthenticatorToken(id)],
      useFactory: (
        apiKeyAuthenticator: ApiKeyAuthenticator,
        oidcAuthenticator: StaticOidcAuthenticator
      ): Authenticator => new Authenticator(apiKeyAuthenticator, oidcAuthenticator)
    }
  }

  private static createMiddlewareProvider (id: OidcTrustId): Provider {
    return {
      provide: getMiddlewareToken(id),
      inject: [getOidcAuthenticatorToken(id), BearerAuthContext],
      useFactory: (
        authenticator: Authenticator,
        authContext: BearerAuthContext
      // oxlint-disable-next-line typescript/no-unsafe-function-type
      ): Function => {
        const instance = new BearerAuthMiddleware(authenticator, authContext)
        return instance.use.bind(instance)
      }
    }
  }

  private static createOidcTrust (id: OidcTrustId, options: OidcTrustOptions): OidcTrust {
    return resolveOidcTrust(id, options)
  }

  private static getVerifierName (id: OidcTrustId): string {
    return `oidc-trust.${id}`
  }

  private static toJwtVerifierOptions (options: OidcTrustOptions): JwtVerifierOptions {
    return {
      issuer: options.issuer,
      audiences: options.audiences,
      jwksEndpoint: options.jwksEndpoint
    }
  }
}
