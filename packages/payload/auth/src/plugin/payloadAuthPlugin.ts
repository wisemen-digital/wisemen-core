/* eslint-disable unicorn/consistent-function-scoping */
import type { Plugin } from 'payload'

import { createPayloadCollectionAuth } from '#plugin/payloadCollectionAuth.ts'
import type {
  BaseUserRecordWithId,
  CreatePayloadAuthPluginParams,
  PayloadAuthPluginResult,
  PublicAuthConfig,
} from '#shared/payloadAuth.types.ts'

function mergePublicAuthConfig(
  publicAuth: PublicAuthConfig,
  overrides?: Partial<PublicAuthConfig>,
) {
  return {
    clientId: overrides?.authClientId ?? publicAuth.authClientId,
    organizationId: overrides?.authOrganizationId ?? publicAuth.authOrganizationId,
    authBaseUrl: overrides?.authBaseUrl ?? publicAuth.authBaseUrl,
    cmsBaseUrl: overrides?.cmsBaseUrl ?? publicAuth.cmsBaseUrl,
    provider: overrides?.provider ?? publicAuth.provider,
  }
}

export function createPayloadAuthPlugin<TUser extends BaseUserRecordWithId>({
  isUserAllowed,
  authConfig,
  canLogin,
  createFirstUser,
  provider,
  shouldSkipUserSync,
  strategyName,
  tenantCollectionSlug,
  tokenRefreshBufferMs,
  userCollectionSlug,
}: CreatePayloadAuthPluginParams<TUser>): PayloadAuthPluginResult {
  const strategy = provider.createStrategy({
    isUserAllowed,
    canLogin,
    createFirstUser: createFirstUser === false
      ? undefined
      : createFirstUser ?? {
        tenantCollectionSlug,
        userData: ({
          email,
        }) => ({
          email,
        }),
      },
    strategyName,
    userCollectionSlug,
  })

  const userHook = provider.createUserHook({
    shouldSkip: shouldSkipUserSync,
  })

  const publicAuth = provider.getPublicConfig()

  return {
    auth: publicAuth,
    createCollectionAuth: (overrides) => createPayloadCollectionAuth({
      ...authConfig,
      ...overrides,
      strategy,
    }),
    getCallbackViewProps: (overrides) => mergePublicAuthConfig(publicAuth, overrides),
    getLoginButtonProps: (overrides) => mergePublicAuthConfig(publicAuth, overrides),
    middleware: async (middlewareState) => {
      const {
        withPayloadTokenAuth,
      } = await import('#server/withPayloadTokenAuth.ts')

      return withPayloadTokenAuth(middlewareState, {
        auth: provider.getMiddlewareAuthConfig(),
        tokenRefreshBufferMs,
      })
    },
    plugin: (): Plugin => (incomingConfig) => incomingConfig,
    strategy,
    userHook,
  }
}
