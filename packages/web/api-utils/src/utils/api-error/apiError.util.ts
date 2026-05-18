import z from 'zod'

import type { RegisteredErrorCodes } from '@/register'
import type {
  ApiError,
  ApiExpectedError,
} from '@/types/apiError.type'

export class ApiErrorUtil {
  static getApiErrorCode(error: ApiExpectedError): string | null {
    return error.errors?.[0]?.code ?? null
  }

  static getApiErrorMessage(error: ApiExpectedError): string | null {
    return error.errors?.[0]?.detail ?? null
  }

  static getMessage(error: ApiExpectedError): string | null {
    return error.errors?.[0]?.detail ?? null
  }

  static handleApiError({
    error, message,
  }: {
    error: unknown
    message?: string
  }): ApiError<RegisteredErrorCodes> {
    if (ApiErrorUtil.isExpectedApiError(error)) {
      return error
    }

    console.error(`'Unexpected API error:' ${error}`)

    if (error instanceof Error) {
      return error
    }

    return new Error(message ?? 'An unknown error occurred')
  }

  static isExpectedApiError(error: unknown): error is ApiExpectedError<RegisteredErrorCodes> {
    return (error as ApiExpectedError)?.errors !== undefined
  }

  static isZodError(error: unknown): error is z.ZodError {
    return error instanceof z.ZodError
  }
}
