import { useInfiniteQuery } from '@tanstack/vue-query'
import type {
  ComputedRef,
  MaybeRef,
  MaybeRefOrGetter,
} from 'vue'
import { computed } from 'vue'

import { AsyncResult } from '@/async-result/asyncResult'
import { QUERY_CONFIG } from '@/config/config'
import type {
  RegisteredErrorCodes,
  RegisteredQueryKeyConfig,
  RegisteredQueryKeyParams,
  RegisteredQueryKeys,
} from '@/register'
import type { ApiError } from '@/types/apiError.type'
import type {
  KeysetPaginationAsyncResult,
  KeysetPaginationParams,
  KeysetPaginationResponse,
  KeysetPaginationResult,
} from '@/types/pagination.type'

type NestedMaybeRefOrGetter<T> = {
  [K in keyof T]: MaybeRefOrGetter<T[K]>
}

type ArrayItemOf<E> = E extends (infer I)[] ? I : E

type EntityItemOf<TKey extends PropertyKey>
  = RegisteredQueryKeyConfig<TKey> extends { entity: infer E } ? ArrayItemOf<E> : unknown

type WithParams<TKey extends PropertyKey>
  = RegisteredQueryKeyParams<TKey> extends undefined
    ? { params?: undefined }
    : { params: NestedMaybeRefOrGetter<RegisteredQueryKeyParams<TKey>> }

export type KeysetInfiniteQueryOptions<
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
   * Whether the query is enabled
   * @default true
   */
  isEnabled?: MaybeRef<boolean>
  /**
   * Maximum number of items to fetch per page
   * @default 20
   */
  limit?: number
  /**
   * Function that will be called when query is executed
   */
  queryFn: (paginationParams: KeysetPaginationParams) => Promise<KeysetPaginationResult<TData, TErrorCode>>
} & WithParams<TKey>

export interface UseKeysetInfiniteQueryReturnType<TData, TErrorCode extends string = RegisteredErrorCodes> {
  /**
   * Whether there is a next page available to fetch
   */
  hasNextPage: ComputedRef<boolean>
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
   * Whether query is currently fetching the next page
   */
  isFetchingNextPage: ComputedRef<boolean>
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
   * Fetch the next page of results using the keyset cursor
   */
  fetchNextPage: () => Promise<void>
  /**
   * Refetch the query
   */
  refetch: () => Promise<void>
  /**
   * Computed result of the query containing all accumulated pages
   * Returns an AsyncResult with three states:
   * - loading: use `result.value.isLoading()`
   * - ok: use `result.value.isOk()` and `result.value.getValue()`
   * - err: use `result.value.isErr()` and `result.value.getError()`
   *
   * Use `result.value.match({ loading, ok, err })` for exhaustive handling
   */
  result: ComputedRef<AsyncResult<KeysetPaginationResponse<TData>, ApiError<TErrorCode>>>
}

const DEFAULT_LIMIT = QUERY_CONFIG.limit

export function useKeysetInfiniteQuery<
  TKey extends keyof RegisteredQueryKeys,
  TData = EntityItemOf<TKey>,
  TErrorCode extends string = RegisteredErrorCodes,
>(
  key: TKey,
  options: KeysetInfiniteQueryOptions<TKey, TData, TErrorCode>,
): UseKeysetInfiniteQueryReturnType<TData, TErrorCode> {
  const params = (options as { params?: unknown }).params
  const queryKey = [
    key,
    params,
  ]

  const infiniteQuery = useInfiniteQuery({
    staleTime: options.staleTime,
    enabled: options.isEnabled,
    getNextPageParam: (lastPage: KeysetPaginationAsyncResult<TData, TErrorCode>) => {
      if (lastPage.isErr() || lastPage.isLoading()) {
        return null
      }

      return lastPage.getValue().meta.next ?? null
    },
    initialPageParam: undefined,
    placeholderData: (data) => data,
    queryFn: async ({
      pageParam,
    }) => {
      return AsyncResult.fromResult(await options.queryFn({
        key: pageParam as string,
        limit: options.limit ?? DEFAULT_LIMIT,
      }))
    },
    queryKey,
  })

  const hasError = computed<boolean>(() => {
    return Boolean(infiniteQuery.data.value?.pages.find((page) => page.isErr()))
  })

  const result = computed<AsyncResult<KeysetPaginationResponse<TData>, ApiError<TErrorCode>>>(() => {
    if (infiniteQuery.isLoading.value) {
      return AsyncResult.loading<KeysetPaginationResponse<TData>, ApiError<TErrorCode>>()
    }

    const firstError = infiniteQuery.data.value?.pages.find((page) => page.isErr())

    if (firstError) {
      return AsyncResult.err<KeysetPaginationResponse<TData>, ApiError<TErrorCode>>(firstError.getError())
    }

    const data = infiniteQuery.data.value?.pages
      .filter((page) => page.isOk())
      .flatMap((page) => page.getValue().data) ?? []

    const firstPage = infiniteQuery.data.value?.pages[0]
    const meta = firstPage?.isOk()
      ? firstPage.getValue().meta
      : {
          next: null,
        }

    const response: KeysetPaginationResponse<TData> = {
      data,
      meta: {
        next: infiniteQuery.hasNextPage.value ? meta.next : null,
      },
    }

    return AsyncResult.ok<KeysetPaginationResponse<TData>, ApiError<TErrorCode>>(response)
  })

  // eslint-disable-next-line eslint-plugin-wisemen/explicit-function-return-type-with-regex
  function fetchNextPage() {
    if (!infiniteQuery.hasNextPage.value || infiniteQuery.isFetchingNextPage.value) {
      return
    }

    return infiniteQuery.fetchNextPage()
  }

  return {
    hasNextPage: computed<boolean>(() => infiniteQuery.hasNextPage.value),
    isError: computed<boolean>(() => hasError.value),
    isFetching: computed<boolean>(() => infiniteQuery.isFetching.value),
    isFetchingNextPage: computed<boolean>(() => infiniteQuery.isFetchingNextPage.value),
    isLoading: computed<boolean>(() => infiniteQuery.isLoading.value),
    isSuccess: computed<boolean>(() => !hasError.value),
    fetchNextPage: async (): Promise<void> => {
      await fetchNextPage()
    },
    refetch: async (): Promise<void> => {
      await infiniteQuery.refetch()
    },
    result,
  }
}
