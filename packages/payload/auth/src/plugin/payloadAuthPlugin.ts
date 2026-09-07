/* eslint-disable unicorn/consistent-function-scoping */
import type { Plugin } from 'payload'

import { createPayloadCollectionAuth } from '#plugin/payloadCollectionAuth.ts'
import {
  AccessControl,
  initializeAccessControl,
  resolveAccessControl,
} from '#shared/accessControl.ts'
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

export function createPayloadAuthPlugin<
  TUser extends BaseUserRecordWithId,
  TCollectionSlug extends string = string,
>({
  isAllowedPrivateAccess,
  isUserAllowed,
  authConfig,
  canLogin,
  createFirstUser,
  operationsToCreate,
  provider,
  shouldSkipUserSync,
  strategyName,
  tenantCollectionSlug,
  tokenRefreshBufferMs,
  userCollectionSlug,
  verificationUrlTemplate,
}: CreatePayloadAuthPluginParams<TUser, TCollectionSlug>): PayloadAuthPluginResult {
  initializeAccessControl(isAllowedPrivateAccess)

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
    operationsToCreate,
    shouldSkip: shouldSkipUserSync,
    verificationUrlTemplate,
  })

  const publicAuth = provider.getPublicConfig()

  return {
    accessControl: AccessControl,
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
    plugin: (): Plugin => (incomingConfig) => {
      resolveAccessControl(incomingConfig.collections)

      return incomingConfig
    },
    strategy,
    userHook,
  }
}
