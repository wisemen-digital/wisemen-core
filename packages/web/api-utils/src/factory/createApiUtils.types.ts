/* eslint-disable ts/no-empty-object-type */
import type { MaybeRef } from 'vue'

import type { UseMutationReturnType } from '@/composables/mutation/mutation.composable'
import type { ApiResult } from '@/types/apiError.type'
import type {
  KeysetPaginationParams,
  KeysetPaginationResult,
  OffsetPaginationParams,
  OffsetPaginationResult,
} from '@/types/pagination.type'
import type {
  QueryKeyEntityFromConfig,
  QueryKeyParamsFromConfig,
  QueryKeyRawParamsFromConfig,
  QueryKeysWithEntityFromConfig,
} from '@/types/queryKeys.type'

/**
 * Helper type to build the invalidation config for a specific query key
 * Maps the query key's params to optional parameter extractors
 */
type QueryKeyInvalidationConfig<
  TQueryKeys extends object,
  TKey extends keyof TQueryKeys,
  TParams,
  TResData,
> = QueryKeyRawParamsFromConfig<TQueryKeys, TKey & string> extends void
  ? {} // Allow empty object for void params
  : QueryKeyRawParamsFromConfig<TQueryKeys, TKey & string> extends object
    ? {
        [ParamKey in keyof QueryKeyRawParamsFromConfig<TQueryKeys, TKey & string>]?: (
          params: TParams,
          data: TResData,
        ) => QueryKeyRawParamsFromConfig<TQueryKeys, TKey & string>[ParamKey]
      }
    : {}

export type QueryKeysWithArrayEntityFromConfig<TQueryKeys extends object> = (
  {
    [K in keyof TQueryKeys]: TQueryKeys[K] extends { entity: any[] }
      ? K
      : never
  }[keyof TQueryKeys]
) & string

export type QueryKeyArrayItemFromConfig<
  TQueryKeys extends object,
  TKey extends PropertyKey,
> = QueryKeyEntityFromConfig<TQueryKeys, TKey> extends (infer TItem)[]
  ? TItem
  : never

export type ApiUseQueryOptions<
  TQueryKeys extends object,
  TKey extends QueryKeysWithEntityFromConfig<TQueryKeys>,
  TErrorCode extends string = string,
> = {
  staleTime?: number
  isDebug?: boolean
  isEnabled?: MaybeRef<boolean>
  queryFn: () => Promise<ApiResult<QueryKeyEntityFromConfig<TQueryKeys, TKey>, TErrorCode>>
} & (
  QueryKeyParamsFromConfig<TQueryKeys, TKey> extends void
    ? { params?: QueryKeyParamsFromConfig<TQueryKeys, TKey> }
    : { params: QueryKeyParamsFromConfig<TQueryKeys, TKey> }
)

export type ApiUsePrefetchQueryOptions<
  TQueryKeys extends object,
  TKey extends QueryKeysWithEntityFromConfig<TQueryKeys>,
  TErrorCode extends string = string,
> = {
  staleTime?: number
  queryFn: () => Promise<ApiResult<QueryKeyEntityFromConfig<TQueryKeys, TKey>, TErrorCode>>
} & (
  QueryKeyParamsFromConfig<TQueryKeys, TKey> extends void
    ? { params?: QueryKeyParamsFromConfig<TQueryKeys, TKey> }
    : { params: QueryKeyParamsFromConfig<TQueryKeys, TKey> }
)

export type ApiUseOffsetInfiniteQueryOptions<
  TQueryKeys extends object,
  TKey extends QueryKeysWithArrayEntityFromConfig<TQueryKeys>,
  TErrorCode extends string = string,
> = {
  staleTime?: number
  isEnabled?: MaybeRef<boolean>
  limit?: number
  queryFn: (paginationParams: OffsetPaginationParams)
  => Promise<OffsetPaginationResult<QueryKeyArrayItemFromConfig<TQueryKeys, TKey>, TErrorCode>>
} & (
  QueryKeyParamsFromConfig<TQueryKeys, TKey> extends void
    ? { params?: QueryKeyParamsFromConfig<TQueryKeys, TKey> }
    : { params: QueryKeyParamsFromConfig<TQueryKeys, TKey> }
)

export type ApiUseOffsetInfinitePrefetchQueryOptions<
  TQueryKeys extends object,
  TKey extends QueryKeysWithArrayEntityFromConfig<TQueryKeys>,
  TErrorCode extends string = string,
> = {
  staleTime?: number
  limit?: number
  queryFn: (paginationParams: OffsetPaginationParams)
  => Promise<OffsetPaginationResult<QueryKeyArrayItemFromConfig<TQueryKeys, TKey>, TErrorCode>>
} & (
  QueryKeyParamsFromConfig<TQueryKeys, TKey> extends void
    ? { params?: QueryKeyParamsFromConfig<TQueryKeys, TKey> }
    : { params: QueryKeyParamsFromConfig<TQueryKeys, TKey> }
)

export type ApiUseKeysetInfiniteQueryOptions<
  TQueryKeys extends object,
  TKey extends QueryKeysWithArrayEntityFromConfig<TQueryKeys>,
  TErrorCode extends string = string,
> = {
  staleTime?: number
  isEnabled?: MaybeRef<boolean>
  limit?: number
  queryFn: (paginationParams: KeysetPaginationParams)
  => Promise<KeysetPaginationResult<QueryKeyArrayItemFromConfig<TQueryKeys, TKey>, TErrorCode>>
} & (
  QueryKeyParamsFromConfig<TQueryKeys, TKey> extends void
    ? { params?: QueryKeyParamsFromConfig<TQueryKeys, TKey> }
    : { params: QueryKeyParamsFromConfig<TQueryKeys, TKey> }
)

export type ApiUseKeysetInfinitePrefetchQueryOptions<
  TQueryKeys extends object,
  TKey extends QueryKeysWithArrayEntityFromConfig<TQueryKeys>,
  TErrorCode extends string = string,
> = {
  staleTime?: number
  limit?: number
  queryFn: (paginationParams: KeysetPaginationParams)
  => Promise<KeysetPaginationResult<QueryKeyArrayItemFromConfig<TQueryKeys, TKey>, TErrorCode>>
} & (
  QueryKeyParamsFromConfig<TQueryKeys, TKey> extends void
    ? { params?: QueryKeyParamsFromConfig<TQueryKeys, TKey> }
    : { params: QueryKeyParamsFromConfig<TQueryKeys, TKey> }
)

type RequestParams<TReqData, TParams> = TReqData extends void
  ? TParams extends void
    ? void
    : { params: TParams }
  : TParams extends void
    ? { body: TReqData }
    : { body: TReqData
        params: TParams }

export interface ApiUseMutationOptions<
  TQueryKeys extends object,
  TReqData,
  TResData,
  TParams = void,
  TErrorCode extends string = string,
> {
  /**
   * Whether to enable debug mode
   */
  isDebug?: boolean
  /**
   * Function that will be called to perform the mutation
   * @param options - Parameters and body for the mutation
   * @returns Promise with ApiResult containing either the response data or an error
   */
  queryFn: (options: RequestParams<TReqData, TParams>) => Promise<ApiResult<TResData, TErrorCode>>
  /**
   * Query keys which should be invalidated after mutation is successful
   * Each key is optional and maps to the query key's specific parameters
   * @example
   * ```typescript
   * queryKeysToInvalidate: {
   *   userDetail: {
   *     userUuid: (params, result) => params.userUuid,
   *   },
   *   userList: {},
   * }
   * ```
   */
  queryKeysToInvalidate?: {
    [TKey in keyof TQueryKeys]?: QueryKeyInvalidationConfig<TQueryKeys, TKey, TParams, TResData>
  }
}

export interface CreateApiMutationUtilsReturnType<TQueryKeys extends object, TErrorCode extends string = string> {
  useMutation: <TReqData = void, TResData = void, TParams = void>(
    options: ApiUseMutationOptions<TQueryKeys, TReqData, TResData, TParams, TErrorCode>,
  ) => UseMutationReturnType<TReqData, TResData, TParams>
}
