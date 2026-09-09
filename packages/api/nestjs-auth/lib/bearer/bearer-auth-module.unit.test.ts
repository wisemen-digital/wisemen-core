import { describe, it } from 'node:test'
import type { Provider } from '@nestjs/common'
import type { DomainEventEmitter } from '@wisemen/nestjs-domain-events'
import type { RedisClient } from '@wisemen/nestjs-redis'
import { getDataSourceToken } from '@wisemen/nestjs-typeorm'
import { expect } from 'expect'
import { AUTH_CONFIG, BearerAuthModule, DOMAIN_EVENT_EMITTER } from './bearer-auth-module.js'
import { ApiKeyAuthenticator } from './api-key/api-key-authenticator.js'
import { Authenticator } from './authenticator/authenticator.js'
import { getAuthenticatorToken } from './authenticator/authenticator.tokens.js'
import { IdentityAuthCache } from './oidc/identity/identity-auth-cache.js'
import { IdentityRepository } from './oidc/identity/identity-repository.js'
import { DynamicOidcAuthenticator } from './oidc/dynamic-oidc/dynamic-oidc-authenticator.js'
import { BearerAuthService } from './bearer-auth.service.js'
import { OidcIdentityAuthenticator } from './oidc/identity/oidc-identity-authenticator.js'
import { getOidcAuthenticatorToken, getOidcTrustToken, getOidcTrustVerifierToken } from './oidc/oidc-trust.tokens.js'

describe('BearerAuthModule', () => {
  it('provides an API-key-plus-OIDC authenticator for every static trust', () => {
    const moduleDefinition = BearerAuthModule.forRoot({
      redisClient: {} as RedisClient,
      domainEventEmitter: {} as DomainEventEmitter,
      oidcTrusts: {
        backoffice: {
          audiences: ['backoffice-api'],
          issuer: 'https://auth.example.test',
          jwksEndpoint: 'https://auth.example.test/.well-known/jwks.json'
        }
      }
    })

    const token = getAuthenticatorToken('backoffice')

    expect(findProvider(moduleDefinition.providers, AUTH_CONFIG)).toMatchObject({
      useValue: {
        domainEventEmitter: expect.anything()
      }
    })
    expect(moduleDefinition.exports).toContain(Authenticator)
    expect(moduleDefinition.providers).toContain(BearerAuthService)
    expect(moduleDefinition.exports).toContain(BearerAuthService)
    expect(findProvider(moduleDefinition.providers, Authenticator)).toMatchObject({
      inject: [ApiKeyAuthenticator, DynamicOidcAuthenticator],
      provide: Authenticator
    })
    expect(moduleDefinition.exports).toContain(token)
    expect(findProvider(moduleDefinition.providers, token)).toMatchObject({
      inject: [
        ApiKeyAuthenticator,
        getOidcAuthenticatorToken('backoffice')
      ],
      provide: token
    })

    expect(findProvider(moduleDefinition.providers, getOidcAuthenticatorToken('backoffice'))).toMatchObject({
      inject: [
        getOidcTrustToken('backoffice'),
        getOidcTrustVerifierToken('backoffice'),
        OidcIdentityAuthenticator
      ]
    })

    expect(findProvider(moduleDefinition.providers, OidcIdentityAuthenticator)).toMatchObject({
      inject: [IdentityAuthCache, DOMAIN_EVENT_EMITTER, getDataSourceToken(), IdentityRepository]
    })

    expect(findProvider(moduleDefinition.providers, DOMAIN_EVENT_EMITTER)).toMatchObject({
      inject: [AUTH_CONFIG],
      provide: DOMAIN_EVENT_EMITTER
    })
  })
})

function findProvider (providers: Provider[] | undefined, token: unknown): Provider | undefined {
  return providers?.find(provider =>
    typeof provider === 'object'
    && provider !== null
    && 'provide' in provider
    && provider.provide === token
  )
}
