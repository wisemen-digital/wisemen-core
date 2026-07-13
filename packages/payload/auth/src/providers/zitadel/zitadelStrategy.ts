import { getPayload } from '@wisemen/payload-core-utils'
import {
  createRemoteJWKSet,
  jwtVerify,
} from 'jose'
import type {
  AuthStrategy,
  AuthStrategyResult,
} from 'payload'
import { APIError } from 'payload'

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
  canLogin,
  isUserAllowed,
  createFirstUser: createFirstUserConfig,
  env,
  strategyName = 'zitadel',
  userCollectionSlug,
}: CreateZitadelAuthStrategyParams<TUser>): AuthStrategy {
  return {
    name: strategyName,
    authenticate: async (ctx) => {
      const authorizationHeader = ctx.headers.get('Authorization')
      const bearerToken = authorizationHeader?.split(' ')[1]

      if (bearerToken == null) {
        return USER_NOT_AUTHENTICATED
      }

      const jwk = createRemoteJWKSet(new URL(env.authJwksEndpoint))

      let jwtVerifyResponse: Awaited<ReturnType<typeof jwtVerify>>

      try {
        jwtVerifyResponse = await jwtVerify(bearerToken, jwk, {
          issuer: env.authIssuer,
          audience: env.authClientId,
        })
      }
      catch {
        return getUnauthenticatedResult(Boolean(ctx.canSetHeaders))
      }

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
          createFirstUserConfig: createFirstUserConfig === false
            ? undefined
            : createFirstUserConfig,
          userCollectionSlug,
          userEmail,
        })
      }

      if (!isUserAllowed(singleUser)) {
        return USER_NOT_AUTHENTICATED
      }

      const loginDecision = await canLogin?.(singleUser)

      if (loginDecision != null && !loginDecision.allowed) {
        throw new APIError(
          loginDecision.reason,
          loginDecision.status ?? 403,
        )
      }

      return {
        user: {
          ...singleUser,
          collection: userCollectionSlug,
        } as AuthStrategyResult['user'],
      }
    },
  }
}
