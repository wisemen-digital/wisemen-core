import type {
  ApiResult,
  OffsetPaginationResult,
} from '@wisemen/vue-core-api-utils'
import { ok } from 'neverthrow'

interface PaginationOptions {
  limit?: number
  offset?: number
  total?: number
}

export function mockAsyncResult<T>(value: T): ApiResult<T, never> {
  return ok(value)
}

export function mockAsyncPaginatedResult<T>(
  data: T[],
  {
    limit = 20,
    offset = 0,
    total = data.length,
  }: PaginationOptions = {},
): OffsetPaginationResult<T, never> {
  return mockAsyncResult({
    data,
    meta: {
      limit,
      offset,
      total,
    },
  })
}

export function mockAsyncVoidResult(): ApiResult<void, never> {
  // eslint-disable-next-line unicorn/no-useless-undefined
  return mockAsyncResult(undefined)
}
