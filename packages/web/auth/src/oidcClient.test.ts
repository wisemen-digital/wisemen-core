import {
  describe,
  expect,
  it,
} from 'vitest'

import { OidcClient } from './oidcClient'

describe('oidcClient', () => {
  it('uses explicit state without mutating scopes', async () => {
    const scopes = [
      'openid',
      'profile',
    ]
    const client = new OidcClient({
      clientId: 'client-id',
      baseUrl: 'https://auth.example.com',
      loginRedirectUri: 'https://app.example.com/auth/callback',
      postLogoutRedirectUri: 'https://app.example.com/auth/logout',
      scopes,
    })

    const loginUrl = await client.getLoginUrl(undefined, {
      state: 'auth-txn-state',
    })

    expect(loginUrl).toContain('state=auth-txn-state')
    expect(scopes).toEqual([
      'openid',
      'profile',
    ])
  })
})
