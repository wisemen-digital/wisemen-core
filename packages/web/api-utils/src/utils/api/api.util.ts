import type { Result } from 'neverthrow'
import {
  err,
  ok,
  ResultAsync,
} from 'neverthrow'

import type { RegisteredErrorCodes } from '@/register'
import type {
  ApiError,
  ApiResult,
} from '@/types/apiError.type'
import type { KeysetPaginationResponse } from '@/types/pagination.type'
import { ApiErrorUtil } from '@/utils/api-error/apiError.util'

export class ApiUtil {
  static async fromPromise<T>(promise: PromiseLike<T>, message?: string): Promise<ApiResult<T, RegisteredErrorCodes>> {
    return await ResultAsync.fromPromise(promise, (error) => {
      return ApiErrorUtil.handleApiError({
        error,
        message,
      })
    }) as ApiResult<T, RegisteredErrorCodes>
  }

  static getKeysetPaginationNextOffset(keysetPaginationMeta: KeysetPaginationResponse<any>['meta']): number | null {
    return (keysetPaginationMeta.next as { offset?: number })?.offset ?? null
  }

  static getResultError(result: Result<unknown, ApiError> | null): ApiError<RegisteredErrorCodes> | null {
    if (result === null) {
      return null
    }

    return result.isErr()
      ? result.error as ApiError<RegisteredErrorCodes>
      : null
  }

  static void<T, TApiResult extends ApiResult<void>>(result: ApiResult<T>): TApiResult {
    if (result.isErr()) {
      return err(result.error) as TApiResult
    }

    return ok() as TApiResult
  }
}
