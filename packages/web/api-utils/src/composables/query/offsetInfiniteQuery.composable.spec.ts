/* eslint-disable test/no-conditional-expect */
/* eslint-disable test/no-conditional-in-test */
import {
  err,
  ok,
} from 'neverthrow'
import {
  describe,
  expect,
  it,
} from 'vitest'
import { nextTick } from 'vue'

import { useOffsetInfiniteQuery } from '@/composables/query/offsetInfiniteQuery.composable'
import { flushPromises } from '@/test/flushPromises'
import { runInSetup } from '@/test/runInSetup'
import type { ApiError } from '@/types/apiError.type'

interface TestItem {
  id: string
  name: string
}

describe('useOffsetInfiniteQuery with AsyncResult', () => {
  it('should be defined', () => {
    expect(useOffsetInfiniteQuery).toBeDefined()
  })

  it('result should start in loading state', () => {
    const query = runInSetup(() => {
      return useOffsetInfiniteQuery<TestItem>({
        queryFn: async () => {
          // Never resolves during the test
          return await new Promise(() => {})
        },
        queryKey: {
          test: {},
        },
      })
    })

    expect(query.result.value.isLoading()).toBeTruthy()
    expect(query.result.value.isOk()).toBeFalsy()
    expect(query.result.value.isErr()).toBeFalsy()
  })

  it('result should transition to ok state with paginated data', async () => {
    const items: TestItem[] = [
      {
        id: '1',
        name: 'Item 1',
      },
      {
        id: '2',
        name: 'Item 2',
      },
    ]

    const query = runInSetup(() => {
      return useOffsetInfiniteQuery<TestItem>({
        queryFn: async ({
          limit, offset,
        }) => {
          return await Promise.resolve(ok({
            data: items.slice(offset, offset + limit),
            meta: {
              limit,
              offset,
              total: items.length,
            },
          }))
        },
        queryKey: {
          test: {},
        },
      })
    })

    // Wait for query to resolve
    await flushPromises()
    await nextTick()

    expect(query.result.value.isLoading()).toBeFalsy()
    expect(query.result.value.isOk()).toBeTruthy()
    expect(query.result.value.isErr()).toBeFalsy()

    if (query.result.value.isOk()) {
      const result = query.result.value.getValue()

      expect(result.data).toHaveLength(2)
      expect(result.data[0].name).toBe('Item 1')
    }
  })

  it('result should transition to err state on failure', async () => {
    const apiError: ApiError = {
      name: 'TestError',
      errors: [],
      message: 'Internal Server Error',
    }

    const query = runInSetup(() => {
      return useOffsetInfiniteQuery<TestItem>({
        queryFn: async () => await Promise.resolve(err(apiError)),
        queryKey: {
          test: {},
        },
      })
    })

    // Wait for query to resolve
    await flushPromises()
    await nextTick()

    expect(query.result.value.isLoading()).toBeFalsy()
    expect(query.result.value.isOk()).toBeFalsy()
    expect(query.result.value.isErr()).toBeTruthy()

    if (query.result.value.isErr()) {
      expect(query.result.value.getError()).toEqual(apiError)
    }
  })

  it('result.match() should work for all states', async () => {
    const items: TestItem[] = [
      {
        id: '1',
        name: 'Item 1',
      },
    ]

    const query = runInSetup(() => {
      return useOffsetInfiniteQuery<TestItem>({
        queryFn: async ({
          limit, offset,
        }) => {
          return await Promise.resolve(ok({
            data: items.slice(offset, offset + limit),
            meta: {
              limit,
              offset,
              total: items.length,
            },
          }))
        },
        queryKey: {
          test: {},
        },
      })
    })

    // Before resolving - loading state
    const loadingMessage = query.result.value.match({
      err: () => 'error',
      loading: () => 'loading',
      ok: () => 'success',
    })

    expect(loadingMessage).toBe('loading')

    // Wait for query to resolve
    await flushPromises()
    await nextTick()

    // After resolving - ok state
    const successMessage = query.result.value.match({
      err: () => 'error',
      loading: () => 'loading',
      ok: (data) => `Got ${data.data.length} items`,
    })

    expect(successMessage).toBe('Got 1 items')
  })

  it('should properly paginate with offset', async () => {
    const items: TestItem[] = Array.from({
      length: 10,
    }, (_, i) => ({
      id: `${i + 1}`,
      name: `Item ${i + 1}`,
    }))

    const query = runInSetup(() => {
      return useOffsetInfiniteQuery<TestItem>({
        limit: 3,
        queryFn: async ({
          limit, offset,
        }) => {
          return await Promise.resolve(ok({
            data: items.slice(offset, offset + limit),
            meta: {
              limit,
              offset,
              total: items.length,
            },
          }))
        },
        queryKey: {
          test: {},
        },
      })
    })

    // Wait for initial query
    await flushPromises()
    await nextTick()

    expect(query.hasNextPage.value).toBeTruthy()

    if (query.result.value.isOk()) {
      const data = query.result.value.getValue()

      expect(data.data).toHaveLength(3)
      expect(data.data[0].id).toBe('1')
      expect(data.meta.offset).toBe(0)
      expect(data.meta.limit).toBe(3)
      expect(data.meta.total).toBe(10)
    }

    // Fetch next page
    await query.fetchNextPage()
    await flushPromises()
    await nextTick()

    if (query.result.value.isOk()) {
      const data = query.result.value.getValue()

      expect(data.data).toHaveLength(6) // Accumulated: 3 + 3
    }
  })

  it('should indicate no next page when at end', async () => {
    const items: TestItem[] = [
      {
        id: '1',
        name: 'Item 1',
      },
      {
        id: '2',
        name: 'Item 2',
      },
    ]

    const query = runInSetup(() => {
      return useOffsetInfiniteQuery<TestItem>({
        limit: 5,
        queryFn: async ({
          limit, offset,
        }) => {
          return await Promise.resolve(ok({
            data: items.slice(offset, offset + limit),
            meta: {
              limit,
              offset,
              total: items.length,
            },
          }))
        },
        queryKey: {
          test: {},
        },
      })
    })

    // Wait for query to resolve
    await flushPromises()
    await nextTick()

    expect(query.hasNextPage.value).toBeFalsy()
  })
})
