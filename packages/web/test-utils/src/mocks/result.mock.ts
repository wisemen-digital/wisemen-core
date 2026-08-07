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

export const MockResult = {
  ok<T>(value: T): ApiResult<T, never> {
    return ok(value)
  },
  toOffsetPagination<T>(
    data: T[],
    {
      limit = 20,
      offset = 0,
      total = data.length,
    }: PaginationOptions = {},
  ): OffsetPaginationResult<T, never> {
    return MockResult.ok({
      data,
      meta: {
        limit,
        offset,
        total,
      },
    })
  },

  toVoid(): ApiResult<void, never> {
    // eslint-disable-next-line unicorn/no-useless-undefined
    return MockResult.ok(undefined)
  },
}
