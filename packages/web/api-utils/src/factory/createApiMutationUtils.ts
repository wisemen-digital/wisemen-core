import type { UseMutationReturnType } from '@/composables/mutation/mutation.composable'
import { useMutation as useMutationComposable } from '@/composables/mutation/mutation.composable'

import type { ApiUseMutationOptions } from './createApiUtils.types'

export interface CreateApiMutationUtilsReturnType<TQueryKeys extends object, TErrorCode extends string = string> {
  useMutation: <TReqData = void, TResData = void, TParams = void>(
    options: ApiUseMutationOptions<TQueryKeys, TReqData, TResData, TParams, TErrorCode>,
  ) => UseMutationReturnType<TReqData, TResData, TParams, TErrorCode>
}

export function createApiMutationUtils<TQueryKeys extends object, TErrorCode extends string = string>():
CreateApiMutationUtilsReturnType<TQueryKeys, TErrorCode> {
  function useMutation<TReqData = void, TResData = void, TParams = void>(
    options: ApiUseMutationOptions<TQueryKeys, TReqData, TResData, TParams, TErrorCode>,
  ): UseMutationReturnType<TReqData, TResData, TParams, TErrorCode> {
    return useMutationComposable({
      isDebug: options.isDebug,
      queryFn: options.queryFn,
      queryKeysToInvalidate: (options.queryKeysToInvalidate ?? {}) as any,
    })
  }

  return {
    useMutation,
  }
}
