import { describe, it } from 'node:test'
import { expect } from 'expect'
import type { OidcTrustId } from './oidc-trust.js'
import { resolveOidcTrust, selectOidcCustomClaims } from './oidc-trust.js'

describe('resolveOidcTrust', () => {
  it('defaults the subject claim and saves no additional claims', () => {
    const trust = resolveOidcTrust('backoffice' as OidcTrustId, {
      audiences: ['backoffice-api'],
      issuer: 'https://auth.example.test',
      jwksEndpoint: 'https://auth.example.test/.well-known/jwks.json'
    })

    expect(trust.claims).toEqual({
      sub: 'sub',
      additional: []
    })
  })

  it('configures additional claim names to retain', () => {
    const trust = resolveOidcTrust('backoffice' as OidcTrustId, {
      audiences: ['backoffice-api'],
      claims: {
        sub: 'user_id',
        additional: ['email', 'name']
      },
      issuer: 'https://auth.example.test',
      jwksEndpoint: 'https://auth.example.test/.well-known/jwks.json'
    })

    expect(trust.claims).toEqual({
      sub: 'user_id',
      additional: ['email', 'name']
    })
  })
})

describe('selectOidcCustomClaims', () => {
  it('retains configured claims and represents absent claims as null', () => {
    const customClaims = selectOidcCustomClaims(
      { email: 'user@example.test' },
      {
        sub: 'sub',
        additional: ['email', 'name']
      }
    )

    expect(customClaims).toEqual({
      email: 'user@example.test',
      name: null
    })
  })
})
