/* eslint-disable eslint-plugin-wisemen/explicit-function-return-type-with-regex */
import { createApiInfiniteQueryUtils } from './createApiInfiniteQueryUtils'
import { createApiMutationUtils } from './createApiMutationUtils'
import { createApiPrefetchInfiniteQueryUtils } from './createApiPrefetchInfiniteQueryUtils'
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
export type { CreateApiPrefetchInfiniteQueryUtilsReturnType } from './createApiPrefetchInfiniteQueryUtils'
export { createApiPrefetchInfiniteQueryUtils } from './createApiPrefetchInfiniteQueryUtils'
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
  return {
    ...createApiQueryUtils<TQueryKeys, TErrorCode>(),
    ...createApiPrefetchQueryUtils<TQueryKeys, TErrorCode>(),
    ...createApiPrefetchInfiniteQueryUtils<TQueryKeys, TErrorCode>(),
    ...createApiInfiniteQueryUtils<TQueryKeys, TErrorCode>(),
    ...createApiMutationUtils<TQueryKeys, TErrorCode>(),
    ...createApiQueryClientUtils<TQueryKeys>(),
  }
}
