import type { Result } from 'neverthrow'

import type { AsyncResult } from '@/async-result/asyncResult'
import type { RegisteredErrorCodes } from '@/register'

export interface ApiKnownErrorObject<TCode extends string = RegisteredErrorCodes> {
  code: TCode
  detail: string
  source?: {
    pointer: string
  }
  status: string
}

export interface ApiUnknownErrorObject {
  code: string
  detail: string
  source?: {
    pointer: string
  }
  status: string
}

export type ApiErrorObject<TCode extends string = RegisteredErrorCodes>
  = ApiKnownErrorObject<TCode> | ApiUnknownErrorObject

export interface ApiExpectedError<TCode extends string = RegisteredErrorCodes> {
  errors: ApiErrorObject<TCode>[]
}

export type ApiUnexpectedError = Error
export type ApiError<TCode extends string = RegisteredErrorCodes> = ApiExpectedError<TCode> | ApiUnexpectedError
export type ApiResult<T, TCode extends string = RegisteredErrorCodes> = Result<T, ApiError<TCode>>

export type AsyncApiResult<T, TCode extends string = RegisteredErrorCodes> = AsyncResult<T, ApiError<TCode>>
