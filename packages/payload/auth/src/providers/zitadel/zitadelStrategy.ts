import { getPayload } from '@wisemen/payload-core-utils'
import {
  createRemoteJWKSet,
  errors,
  jwtVerify,
} from 'jose'
import type {
  AuthStrategy,
  AuthStrategyResult,
} from 'payload'

import {
  getUnauthenticatedResult,
  USER_NOT_AUTHENTICATED,
} from '#shared/payloadAuth.shared.ts'
import type {
  BaseUserRecordWithId,
  CreateFirstUserConfig,
  CreateZitadelAuthStrategyParams,
} from '#shared/payloadAuth.types.ts'

async function findUserByEmail<TUser>({
  userCollectionSlug, userEmail,
}: {
  userCollectionSlug: string
  userEmail: string
}): Promise<TUser | undefined> {
  const payload = await getPayload()

  const users = await payload.find({
    collection: userCollectionSlug,
    limit: 1,
    overrideAccess: true,
    where: {
      email: {
        equals: userEmail,
      },
    },
  })

  return users.docs[0] as TUser | undefined
}

async function createFirstUser({
  createFirstUserConfig,
  userCollectionSlug,
  userEmail,
}: {
  createFirstUserConfig?: CreateFirstUserConfig
  userCollectionSlug: string
  userEmail: string
}): Promise<AuthStrategyResult> {
  const payload = await getPayload()

  if (createFirstUserConfig == null) {
    return USER_NOT_AUTHENTICATED
  }

  const existingUserWithEmail = await findUserByEmail({
    userCollectionSlug,
    userEmail,
  })

  if (existingUserWithEmail != null) {
    return {
      user: {
        ...existingUserWithEmail,
        collection: userCollectionSlug,
      } as unknown as AuthStrategyResult['user'],
    }
  }

  const existingUsers = await payload.find({
    collection: userCollectionSlug,
    limit: 1,
    overrideAccess: true,
  })

  if (existingUsers.docs.length > 0) {
    return USER_NOT_AUTHENTICATED
  }

  const existingTenants = await payload.find({
    collection: createFirstUserConfig.tenantCollectionSlug,
    limit: 1,
    overrideAccess: true,
  })

  let existingTenant = existingTenants.docs[0]

  existingTenant ??= await payload.create({
    collection: createFirstUserConfig.tenantCollectionSlug,
    data: createFirstUserConfig.createTenantData?.() ?? {
      title: 'Default',
    },
    overrideAccess: true,
  })

  if (existingTenant == null) {
    throw new Error('Failed to resolve tenant for first user creation')
  }

  try {
    const createdUser = await payload.create({
      collection: userCollectionSlug,
      data: createFirstUserConfig.userData({
        tenantId: existingTenant.id,
        isFirstUser: true,
        email: userEmail,
      }),
      draft: false,
      overrideAccess: true,
    })

    return {
      user: {
        ...createdUser,
        collection: userCollectionSlug,
      } as unknown as AuthStrategyResult['user'],
    }
  }
  catch (error) {
    const userCreatedConcurrently = await findUserByEmail({
      userCollectionSlug,
      userEmail,
    })

    if (userCreatedConcurrently != null) {
      return {
        user: {
          ...userCreatedConcurrently,
          collection: userCollectionSlug,
        } as AuthStrategyResult['user'],
      }
    }

    throw error
  }
}

export function createZitadelAuthStrategy<TUser extends BaseUserRecordWithId>({
  isUserAllowed,
  createFirstUser: createFirstUserConfig,
  env,
  userCollectionSlug,
}: CreateZitadelAuthStrategyParams<TUser>): AuthStrategy {
  return {
    name: 'zitadel',
    authenticate: async (ctx) => {
      const authorizationHeader = ctx.headers.get('Authorization')
      const bearerToken = authorizationHeader?.split(' ')[1]

      if (bearerToken == null) {
        return USER_NOT_AUTHENTICATED
      }

      const jwk = createRemoteJWKSet(new URL(env.authJwksEndpoint))

      try {
        const jwtVerifyResponse = await jwtVerify(bearerToken, jwk, {
          issuer: env.authIssuer,
          audience: env.authClientId,
        })

        const userEmail = jwtVerifyResponse.payload.email

        if (typeof userEmail !== 'string' || userEmail.length === 0) {
          return USER_NOT_AUTHENTICATED
        }

        const singleUser = await findUserByEmail<TUser>({
          userCollectionSlug,
          userEmail,
        })

        if (singleUser == null) {
          return createFirstUser({
            createFirstUserConfig,
            userCollectionSlug,
            userEmail,
          })
        }

        if (!isUserAllowed(singleUser)) {
          return USER_NOT_AUTHENTICATED
        }

        return {
          user: {
            ...singleUser,
            collection: userCollectionSlug,
          } as AuthStrategyResult['user'],
        }
      }
      catch (error) {
        if (error instanceof errors.JWTExpired) {
          return getUnauthenticatedResult(Boolean(ctx.canSetHeaders))
        }

        return getUnauthenticatedResult(Boolean(ctx.canSetHeaders))
      }
    },
  }
}
