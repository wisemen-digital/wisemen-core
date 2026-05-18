/* eslint-disable eslint-plugin-wisemen/explicit-function-return-type-with-regex */
import type { ApiUtilType } from '@/utils/api/api.util'
import { createApiUtil } from '@/utils/api/api.util'
import type { ApiErrorUtilType } from '@/utils/api-error/apiError.util'
import { createApiErrorUtil } from '@/utils/api-error/apiError.util'

import { createApiInfiniteQueryUtils } from './createApiInfiniteQueryUtils'
import { createApiMutationUtils } from './createApiMutationUtils'
import { createApiPrefetchQueryUtils } from './createApiPrefetchQueryUtils'
import { createApiQueryClientUtils } from './createApiQueryClientUtils'
import { createApiQueryUtils } from './createApiQueryUtils'

export type {
  ApiUseKeysetInfiniteQueryReturnType,
  ApiUseOffsetInfiniteQueryReturnType,
  CreateApiInfiniteQueryUtilsReturnType,
} from './createApiInfiniteQueryUtils'
export { createApiInfiniteQueryUtils } from './createApiInfiniteQueryUtils'
export type { CreateApiMutationUtilsReturnType } from './createApiMutationUtils'
export { createApiMutationUtils } from './createApiMutationUtils'
export type { CreateApiPrefetchQueryUtilsReturnType } from './createApiPrefetchQueryUtils'
export { createApiPrefetchQueryUtils } from './createApiPrefetchQueryUtils'
export type { CreateApiQueryClientUtilsReturnType } from './createApiQueryClientUtils'
export { createApiQueryClientUtils } from './createApiQueryClientUtils'
export type { CreateApiQueryUtilsReturnType } from './createApiQueryUtils'
export { createApiQueryUtils } from './createApiQueryUtils'

/**
 * Factory that creates typed composables based on a user-provided query-keys config.
 *
 * Requires `initializeApiUtils(queryClient)` to be called first.
 *
 * @example
 * ```typescript
 * // In app setup (plugin or main.ts):
 * initializeApiUtils(queryClient)
 *
 * // In your api lib:
 * export const { useQuery, useMutation, useQueryClient } = createApiUtils<MyQueryKeys>()
 * ```
 */
export function createApiUtils<
  TQueryKeys extends object,
  TErrorCode extends string = string,
>() {
  const ApiUtil: ApiUtilType<TErrorCode> = createApiUtil<TErrorCode>()
  const ApiErrorUtil: ApiErrorUtilType<TErrorCode> = createApiErrorUtil<TErrorCode>()

  return {
    ...createApiQueryUtils<TQueryKeys, TErrorCode>(),
    ...createApiPrefetchQueryUtils<TQueryKeys, TErrorCode>(),
    ...createApiInfiniteQueryUtils<TQueryKeys, TErrorCode>(),
    ...createApiMutationUtils<TQueryKeys, TErrorCode>(),
    ...createApiQueryClientUtils<TQueryKeys>(),
    ApiErrorUtil,
    ApiUtil,
  }
}
