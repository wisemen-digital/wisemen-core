import {
  useMutation as useTanstackQueryMutation,
  useQueryClient,
} from '@tanstack/vue-query'
import type { ComputedRef } from 'vue'
import { computed } from 'vue'

import { AsyncResult } from '@/async-result/asyncResult'
import type {
  ApiError,
  ApiResult,
  AsyncApiResult,
} from '@/types/apiError.type'

type RequestParams<TReqData, TParams> = TReqData extends void
  ? TParams extends void
    ? void
    : { params: TParams }
  : TParams extends void
    ? { body: TReqData }
    : { body: TReqData
        params: TParams }

interface UseMutationOptions<TReqData, TResData, TParams = void, TErrorCode extends string = string> {
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
   * Object where each key is a query key to invalidate after mutation succeeds.
   * Each query key can optionally have nested parameter extractors.
   * @example
   * ```typescript
   * queryKeysToInvalidate: {
   *   contactDetail: {
   *     contactUuid: (params, result) => params.contactUuid,
   *   },
   *   contactIndex: {},
   * }
   * ```
   */
  queryKeysToInvalidate?: Record<
    string,
    Record<string, (params: TParams, data: TResData) => any> | undefined
  >
}

export interface UseMutationReturnType<TReqData, TResData, TParams = void, TErrorCode extends string = string> {
  /**
   * Whether mutation is loading
   * @deprecated - use `result.value.isLoading()` instead
   */
  isLoading: ComputedRef<boolean>
  /**
   * Response data from the mutation
   * @deprecated - use `result.value.getValue()` instead
   */
  data: ComputedRef<TResData | null>
  /**
   * Function to execute the mutation
   * @param data - Parameters and body for the mutation
   * @returns Promise with ApiResult containing either the response data or an error
   */
  execute: (data: RequestParams<TReqData, TParams>) => Promise<ApiResult<TResData, TErrorCode>>
  /**
   * Computed result of the mutation
   * Returns an AsyncResult with three states:
   * - loading: use `result.value.isLoading()`
   * - ok: use `result.value.isOk()` and `result.value.getValue()`
   * - err: use `result.value.isErr()` and `result.value.getError()`
   */
  result: ComputedRef<AsyncResult<TResData, ApiError<TErrorCode>>>
}

export function useMutation<
  TReqData = void,
  TResData = void,
  TParams = void,
  TErrorCode extends string = string,
>(
  options: UseMutationOptions<TReqData, TResData, TParams, TErrorCode>,
): UseMutationReturnType<TReqData, TResData, TParams, TErrorCode> {
  const isDebug = options.isDebug ?? false
  const queryClient = useQueryClient()

  async function onSuccess(responseData: TResData, params: TParams): Promise<void> {
    if (!options.queryKeysToInvalidate) {
      return
    }

    await Promise.all(
      Object.entries(options.queryKeysToInvalidate).map(async ([
        queryKey,
        queryKeyParams,
      ]) => {
        if (!queryKeyParams) {
          // If no params specified, just invalidate the query key directly
          if (isDebug) {
            // eslint-disable-next-line no-console
            console.log(`[MUTATION] Invalidating ${queryKey}`)
          }

          await queryClient.invalidateQueries({
            queryKey: [
              queryKey,
            ],
          })

          return
        }

        const qkp = queryKeyParams as Record<string, (params: TParams, data: TResData) => unknown>
        const paramEntries = Object.entries(qkp)

        if (paramEntries.length === 0) {
          // If params object is empty, just invalidate the query key directly
          if (isDebug) {
            // eslint-disable-next-line no-console
            console.log(`[MUTATION] Invalidating ${queryKey}`)
          }

          await queryClient.invalidateQueries({
            queryKey: [
              queryKey,
            ],
          })

          return
        }

        const paramsWithValues = paramEntries.reduce((acc, [
          key,
          value,
        ]) => {
          acc[key] = value(params, responseData)

          return acc
        }, {} as Record<string, any>)

        if (isDebug) {
          // eslint-disable-next-line no-console
          console.log(`[MUTATION] Invalidating ${queryKey}`, paramsWithValues)
        }

        await queryClient.invalidateQueries({
          exact: false,
          queryKey: [
            queryKey,
            paramsWithValues,
          ],
        })
      }),
    )
  }

  const mutation = useTanstackQueryMutation<
    ApiResult<TResData, TErrorCode>,
    unknown,
    RequestParams<TReqData, TParams>
  >({
    mutationFn: options.queryFn,
    onSuccess: async (result, variables: RequestParams<TReqData, TParams>) => {
      if (!result.isOk()) {
        return
      }

      const data = result.value
      const hasParams = variables !== undefined && 'params' in variables

      if (hasParams) {
        await onSuccess(data, variables.params)

        return
      }

      await onSuccess(data, {} as TParams)
    },
  })

  async function execute(data: RequestParams<TReqData, TParams>): Promise<ApiResult<TResData, TErrorCode>> {
    return await mutation.mutateAsync(data)
  }

  const result = computed<AsyncApiResult<TResData, TErrorCode>>(() => {
    if (mutation.isPending.value) {
      return AsyncResult.loading<TResData, ApiError<TErrorCode>>()
    }

    if (mutation.isError.value) {
      return AsyncResult.err<TResData, ApiError<TErrorCode>>(mutation.error.value as ApiError<TErrorCode>)
    }

    if (mutation.isSuccess.value && mutation.data.value !== undefined) {
      const apiResult = mutation.data.value

      if (apiResult.isOk()) {
        return AsyncResult.ok<TResData, ApiError<TErrorCode>>(apiResult.value)
      }

      if (apiResult.isErr()) {
        return AsyncResult.err<TResData, ApiError<TErrorCode>>(apiResult.error)
      }
    }

    return AsyncResult.loading<TResData, ApiError<TErrorCode>>()
  })

  return {
    isLoading: computed<boolean>(() => mutation.isPending.value),
    data: computed<TResData | null>(() => {
      if (mutation.data.value?.isOk()) {
        return mutation.data.value.value
      }

      return null
    }),
    execute,
    result,
  }
}
