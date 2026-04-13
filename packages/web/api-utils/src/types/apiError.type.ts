import type { Result } from 'neverthrow'

import type { AsyncResult } from '@/async-result/asyncResult'

export interface ApiKnownErrorObject<TCode extends string = string> {
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

export type ApiErrorObject<TCode extends string = string> = ApiKnownErrorObject<TCode> | ApiUnknownErrorObject

export interface ApiExpectedError<TCode extends string = string> {
  errors: ApiErrorObject<TCode>[]
}

export type ApiUnexpectedError = Error
export type ApiError<TCode extends string = string> = ApiExpectedError<TCode> | ApiUnexpectedError
export type ApiResult<T, TCode extends string = string> = Result<T, ApiError<TCode>>

export type AsyncApiResult<T, TCode extends string = string> = AsyncResult<T, ApiError<TCode>>
