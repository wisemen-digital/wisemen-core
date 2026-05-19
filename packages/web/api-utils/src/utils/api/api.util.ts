import type { Result } from 'neverthrow'
import {
  err,
  ok,
  ResultAsync,
} from 'neverthrow'

import type { AsyncResult } from '@/async-result/asyncResult'
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

  static getResultError(
    result: AsyncResult<unknown, ApiError> | Result<unknown, ApiError> | null,
  ): ApiError<RegisteredErrorCodes> | null {
    if (result === null) {
      return null
    }

    if (!result.isErr()) {
      return null
    }

    if (ApiUtil.isAsyncResult(result)) {
      return result.getError()
    }

    return result.error
  }

  private static isAsyncResult(value: unknown): value is AsyncResult<unknown, ApiError> {
    return (value as AsyncResult<unknown, ApiError>).getResult !== undefined
  }

  static void<T, TApiResult extends ApiResult<void>>(result: ApiResult<T>): TApiResult {
    if (result.isErr()) {
      return err(result.error) as TApiResult
    }

    return ok() as TApiResult
  }
}
