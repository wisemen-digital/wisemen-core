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
import { ApiErrorUtil } from '@/utils/api-error/apiError.util'

export class ApiUtil {
  static async fromPromise<T>(promise: PromiseLike<T>, message?: string): Promise<ApiResult<T, RegisteredErrorCodes>> {
    return await ResultAsync.fromPromise(promise, (error) => {
      return ApiErrorUtil.handleApiError({
        error,
        message,
      })
    })
  }

  static getResultError<T>(
    result: AsyncResult<T, ApiError> | Result<T, ApiError> | null,
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

  static void<T>(result: ApiResult<T>): ApiResult<void> {
    if (result.isErr()) {
      return err(result.error)
    }

    return ok()
  }
}
