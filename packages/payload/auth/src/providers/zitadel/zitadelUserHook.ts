import type { CollectionAfterChangeHook } from 'payload'

import type {
  BaseUserRecordWithId,
  CreateZitadelUserHookParams,
} from '#shared/payloadAuth.types.ts'

function getZitadelAccessToken(authServiceUser: string): string {
  if (!authServiceUser) {
    throw new Error('Missing authServiceUser')
  }

  return authServiceUser
}

async function doesZitadelUserExist({
  accessToken,
  authBaseUrl,
  email,
}: {
  accessToken: string
  authBaseUrl: string
  email: string
}): Promise<boolean> {
  const searchResponse = await fetch(`${authBaseUrl}/v2/users`, {
    body: JSON.stringify({
      queries: [
        {
          emailQuery: {
            emailAddress: email,
            method: 'TEXT_QUERY_METHOD_EQUALS',
          },
        },
      ],
    }),
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })

  if (!searchResponse.ok) {
    throw new Error(`Failed to search Zitadel users: ${await searchResponse.text()}`)
  }

  const searchBody = await searchResponse.json() as {
    result?: unknown[]
  }

  return Array.isArray(searchBody.result) && searchBody.result.length > 0
}

export function createZitadelUserHook<TUser extends BaseUserRecordWithId>({
  env, shouldSkip,
}: CreateZitadelUserHookParams<TUser>): CollectionAfterChangeHook<TUser> {
  return async ({
    data, operation,
  }) => {
    if (operation !== 'create') {
      return
    }

    if (shouldSkip?.(data)) {
      return
    }

    const email = data.email

    if (!email) {
      throw new Error('Cannot create Zitadel user without email')
    }

    const accessToken = getZitadelAccessToken(env.authServiceUser)
    const userExists = await doesZitadelUserExist({
      accessToken,
      authBaseUrl: env.authBaseUrl,
      email,
    })

    if (userExists) {
      return
    }

    const displayName = [
      data.firstName,
      data.lastName,
    ].filter(Boolean).join(' ') || email

    const createResponse = await fetch(`${env.authBaseUrl}/v2/users/human`, {
      body: JSON.stringify({
        email: {
          email,
          sendCode: {},
        },
        organization: {
          orgId: env.authOrganizationId,
        },
        profile: {
          displayName,
          familyName: data.lastName || email,
          givenName: data.firstName || email,
        },
      }),
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    if (!createResponse.ok) {
      throw new Error(`Failed to create Zitadel user: ${await createResponse.text()}`)
    }
  }
}
