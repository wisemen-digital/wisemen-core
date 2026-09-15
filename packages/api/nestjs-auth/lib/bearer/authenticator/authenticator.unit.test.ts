import { describe, it } from 'node:test'
import { expect } from 'expect'
import { ApiKeyAuthenticator } from '../api-key/api-key-authenticator.js'
import type { OidcAuthenticator } from '../oidc/oidc-authenticator.js'
import { Authenticator } from './authenticator.js'

describe('Authenticator', () => {
  it('delegates API-key bearer tokens to the API-key authenticator', async () => {
    const apiKeyAuthenticator = createApiKeyAuthenticator({ type: 'api-key' })
    const oidcAuthenticator = createOidcAuthenticator({ type: 'identity' })
    const authenticator = new Authenticator(apiKeyAuthenticator, oidcAuthenticator)

    const result = await authenticator.authenticate('Bearer ak_secret')

    expect(result).toEqual({ type: 'api-key' })
  })

  it('delegates non-API-key bearer tokens to its OIDC authenticator', async () => {
    const apiKeyAuthenticator = createApiKeyAuthenticator({ type: 'api-key' })
    const oidcAuthenticator = createOidcAuthenticator({ type: 'identity' })
    const authenticator = new Authenticator(apiKeyAuthenticator, oidcAuthenticator)

    const result = await authenticator.authenticate('Bearer oidc-token')

    expect(result).toEqual({ type: 'identity' })
  })

})

function createApiKeyAuthenticator (result: object): ApiKeyAuthenticator {
  return {
    authenticate: () => Promise.resolve(result)
  } as unknown as ApiKeyAuthenticator
}

function createOidcAuthenticator (result: object): OidcAuthenticator {
  return {
    authenticate: () => Promise.resolve(result)
  } as OidcAuthenticator
}
