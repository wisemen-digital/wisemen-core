import type { TypeWithID } from 'payload'

import { createZitadelAuthStrategy } from '#providers/zitadel/zitadelStrategy.ts'
import { createZitadelUserHook } from '#providers/zitadel/zitadelUserHook.ts'
import type {
  AuthEnv,
  BaseUserRecord,
  CreateAuthStrategyParams,
  CreateAuthUserHookParams,
  PayloadAuthProvider,
  PublicAuthConfig,
} from '#shared/payloadAuth.types.ts'

export function createZitadelAuthProvider<TUser extends BaseUserRecord & TypeWithID>(
  env: AuthEnv,
): PayloadAuthProvider<TUser> {
  return {
    createStrategy: (params: CreateAuthStrategyParams<TUser>) => createZitadelAuthStrategy<TUser>({
      ...params,
      env,
    }),
    createUserHook: (params: CreateAuthUserHookParams<TUser>) => createZitadelUserHook<TUser>({
      ...params,
      env,
    }),
    getMiddlewareAuthConfig: () => ({
      authClientId: env.authClientId,
      authOrganizationId: env.authOrganizationId,
      authBaseUrl: env.authBaseUrl,
      provider: 'zitadel',
    }),
    getPublicConfig: (): PublicAuthConfig => ({
      authClientId: env.authClientId,
      authOrganizationId: env.authOrganizationId,
      authBaseUrl: env.authBaseUrl,
      cmsBaseUrl: env.cmsBaseUrl,
      provider: 'zitadel',
    }),
  }
}
