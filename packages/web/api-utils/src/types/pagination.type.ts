import type { RegisteredErrorCodes } from '@/register'

import type {
  ApiResult,
  AsyncApiResult,
} from './apiError.type'
import type { QueryParams } from './queryOptions'

export interface OffsetPaginationParams {
  limit: number
  offset: number
}

export type OffsetPagination<T extends QueryParams = Record<string, never>> = {
  pagination: OffsetPaginationParams
} & T

export interface KeysetPaginationParams {
  key?: any
  limit: number
}

export type KeysetPagination<T extends QueryParams> = {
  pagination: KeysetPaginationParams
} & T

export interface OffsetPaginationResponse<TData> {
  data: TData[]
  meta: {
    limit: number
    offset: number
    total: number
  }
}

export interface KeysetPaginationResponse<TData> {
  data: TData[]
  meta: {
    next: unknown
  }
}
export type OffsetPaginationResult<TData, TErrorCode extends string = RegisteredErrorCodes>
  = ApiResult<OffsetPaginationResponse<TData>, TErrorCode>
export type KeysetPaginationResult<TData, TErrorCode extends string = RegisteredErrorCodes>
  = ApiResult<KeysetPaginationResponse<TData>, TErrorCode>

export type KeysetPaginationAsyncResult<TData, TErrorCode extends string = RegisteredErrorCodes>
  = AsyncApiResult<KeysetPaginationResponse<TData>, TErrorCode>

export type OffsetPaginationAsyncResult<TData, TErrorCode extends string = RegisteredErrorCodes>
  = AsyncApiResult<OffsetPaginationResponse<TData>, TErrorCode>

export interface PaginatedDataDto<TSchema> {
  items: TSchema[]
  meta: {
    limit: number
    offset: number
    total: number
  }
}
