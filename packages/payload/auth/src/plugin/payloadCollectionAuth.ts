import type {
  AuthStrategy,
  CollectionConfig,
} from 'payload'

import {
  DEFAULT_ACCESS_TOKEN_EXPIRATION,
  DEFAULT_LOCK_TIME,
  DEFAULT_MAX_LOGIN_ATTEMPTS,
} from '#shared/constants.ts'
import type { CreatePayloadCollectionAuthParams } from '#shared/payloadAuth.types.ts'

export function createPayloadCollectionAuth({
  lockTime = DEFAULT_LOCK_TIME,
  maxLoginAttempts = DEFAULT_MAX_LOGIN_ATTEMPTS,
  strategy,
  tokenExpiration = DEFAULT_ACCESS_TOKEN_EXPIRATION,
  verify = false,
}: CreatePayloadCollectionAuthParams & {
  strategy: AuthStrategy
}): NonNullable<CollectionConfig['auth']> {
  return {
    lockTime,
    disableLocalStrategy: true,
    maxLoginAttempts,
    strategies: [
      strategy,
    ],
    tokenExpiration,
    verify,
  }
}
