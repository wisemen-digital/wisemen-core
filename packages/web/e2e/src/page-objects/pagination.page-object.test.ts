import {
  describe,
  expect,
  it,
} from 'vitest'

import { PaginationTestUtil } from '@/page-objects/pagination.page-object'

describe('paginationTestUtil static response shapers', () => {
  it('wraps an array in an offset pagination envelope', () => {
    const result = PaginationTestUtil.toOffsetPaginationResponse([
      {
        id: 1,
      },
      {
        id: 2,
      },
      {
        id: 3,
      },
    ])

    expect(result).toEqual({
      items: [
        {
          id: 1,
        },
        {
          id: 2,
        },
        {
          id: 3,
        },
      ],
      meta: {
        limit: 3,
        offset: 0,
        total: 3,
      },
    })
  })

  it('wraps an array in a keyset pagination envelope', () => {
    const result = PaginationTestUtil.toKeysetPaginationResponse([
      {
        id: 1,
      },
    ])

    expect(result).toEqual({
      items: [
        {
          id: 1,
        },
      ],
      meta: {
        limit: 1,
        next: null,
      },
    })
  })

  it('handles empty collections', () => {
    expect(PaginationTestUtil.toOffsetPaginationResponse([]).meta).toEqual({
      limit: 0,
      offset: 0,
      total: 0,
    })
    expect(PaginationTestUtil.toKeysetPaginationResponse([]).meta.next).toBeNull()
  })
})
