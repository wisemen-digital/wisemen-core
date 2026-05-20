import { useQuery as useTanstackQuery } from '@tanstack/vue-query'
import type {
  ComputedRef,
  MaybeRef,
  MaybeRefOrGetter,
} from 'vue'
import { computed } from 'vue'

import { AsyncResult } from '@/async-result/asyncResult'
import type {
  RegisteredErrorCodes,
  RegisteredQueryKeyEntity,
  RegisteredQueryKeyParams,
  RegisteredQueryKeys,
} from '@/register'
import type {
  ApiError,
  ApiResult,
} from '@/types/apiError.type'

type NestedMaybeRefOrGetter<T> = {
  [K in keyof T]: MaybeRefOrGetter<T[K]>
}

type WithParams<TKey extends PropertyKey>
  = RegisteredQueryKeyParams<TKey> extends undefined
    ? { params?: undefined }
    : { params: NestedMaybeRefOrGetter<RegisteredQueryKeyParams<TKey>> }

export type UseQueryOptions<
  TKey extends keyof RegisteredQueryKeys,
  TData,
  TErrorCode extends string = RegisteredErrorCodes,
> = {
  /**
   * The time in milliseconds after which the query will be considered stale
   * @default 0
   */
  staleTime?: number
  /**
   * Whether to enable debug mode
   * @default false
   */
  isDebug?: boolean
  /**
   * Whether the query is enabled
   * @default true
   */
  isEnabled?: MaybeRef<boolean>
  /**
   * Function that will be called when query is executed
   */
  queryFn: () => Promise<ApiResult<TData, TErrorCode>>
} & WithParams<TKey>

export interface UseQueryReturnType<TResData, TErrorCode extends string = RegisteredErrorCodes> {
  /**
   * Whether query has errored at least once
   * @deprecated - use `result.value.isErr()` instead
   */
  isError: ComputedRef<boolean>
  /**
   * Whether query is currently fetching data, regardless of cache status
   */
  isFetching: ComputedRef<boolean>
  /**
   * Whether query is initially loading
   * @deprecated - use `result.value.isLoading()` instead
   */
  isLoading: ComputedRef<boolean>
  /**
   * Whether query has been executed successfully
   * @deprecated - use `result.value.isOk()` instead
   */
  isSuccess: ComputedRef<boolean>
  /**
   * Refetch the query
   */
  refetch: () => Promise<void>
  /**
   * Computed result of the query
   * Returns an AsyncResult with three states:
   * - loading: use `result.value.isLoading()`
   * - ok: use `result.value.isOk()` and `result.value.getValue()`
   * - err: use `result.value.isErr()` and `result.value.getError()`
   *
   * Use `result.value.match({ loading, ok, err })` for exhaustive handling
   */
  result: ComputedRef<AsyncResult<TResData, ApiError<TErrorCode>>>
}

export function useQuery<
  TKey extends keyof RegisteredQueryKeys,
  TData = RegisteredQueryKeyEntity<TKey>,
  TErrorCode extends string = RegisteredErrorCodes,
>(
  key: TKey,
  options: UseQueryOptions<TKey, TData, TErrorCode>,
): UseQueryReturnType<TData, TErrorCode> {
  const isDebug = options.isDebug ?? false
  const params = (options as { params?: unknown }).params

  const query = useTanstackQuery({
    staleTime: options.staleTime,
    enabled: options.isEnabled,
    placeholderData: (data) => data,
    queryFn: async () => {
      return AsyncResult.fromResult(await options.queryFn())
    },
    queryKey: [
      key,
      params,
    ],
  })

  if (isDebug) {
    // eslint-disable-next-line no-console
    console.debug(`Create query with key ${String(key)}`, params)
  }

  async function refetch(): Promise<void> {
    await query.refetch()
  }

  return {
    isError: computed<boolean>(() => query.data.value?.isErr() ?? false),
    isFetching: computed<boolean>(() => query.isFetching.value),
    isLoading: computed<boolean>(() => query.isLoading.value),
    isSuccess: computed<boolean>(() => query.data.value?.isOk() ?? false),
    refetch,
    result: computed<AsyncResult<TData, ApiError<TErrorCode>>>(() => {
      if (query.isLoading.value) {
        return AsyncResult.loading<TData, ApiError<TErrorCode>>()
      }

      if (query.data.value?.isOk()) {
        return AsyncResult.ok(query.data.value.getValue())
      }

      if (query.data.value?.isErr()) {
        return AsyncResult.err<TData, ApiError<TErrorCode>>(query.data.value.getError())
      }

      return AsyncResult.loading<TData, ApiError<TErrorCode>>()
    }),
  }
}
