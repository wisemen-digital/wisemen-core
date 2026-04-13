/* eslint-disable test/no-conditional-expect */
/* eslint-disable test/no-conditional-in-test */
import { ok } from 'neverthrow'
import {
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import {
  computed,
  nextTick,
} from 'vue'

import { createApiUtils } from '@/factory/createApiUtils'
import { flushPromises } from '@/test/flushPromises'
import { runInSetup } from '@/test/runInSetup'

interface PrefetchUser {
  id: string
  email: string
}

interface PrefetchQueryKeys {
  userIndex: {
    entity: PrefetchUser[]
    params: {
      search: string
    }
  }
}

function createPrefetchUserItems(count: number): PrefetchUser[] {
  return Array.from({
    length: count,
  }, (_, i) => ({
    id: String(i + 1),
    email: `user${i + 1}@example.com`,
  }))
}

describe('createApiUtils - prefetch infinite queries', () => {
  it('prefetches offset infinite query and avoids extra fetch', async () => {
    const items = createPrefetchUserItems(5)

    const queryFn = vi.fn(({
      limit, offset,
    }: { limit: number
      offset: number }) => {
      return Promise.resolve(ok({
        data: items.slice(offset, offset + limit),
        meta: {
          limit,
          offset,
          total: items.length,
        },
      }))
    })

    const setup = runInSetup(() => {
      const {
        useOffsetInfiniteQuery, usePrefetchOffsetInfiniteQuery,
      } = createApiUtils<PrefetchQueryKeys>()

      return {
        prefetch: usePrefetchOffsetInfiniteQuery('userIndex', {
          staleTime: 999_999,
          limit: 2,
          params: {
            search: computed<string>(() => 'user'),
          },
          queryFn: ({
            limit, offset,
          }) => queryFn({
            limit,
            offset,
          }),
        }),
        query: useOffsetInfiniteQuery('userIndex', {
          staleTime: 999_999,
          limit: 2,
          params: {
            search: computed<string>(() => 'user'),
          },
          queryFn: ({
            limit, offset,
          }) => queryFn({
            limit,
            offset,
          }),
        }),
      }
    })

    await setup.prefetch.execute()
    await flushPromises()
    await nextTick()

    expect(queryFn).toHaveBeenCalledTimes(1)

    await flushPromises()
    await nextTick()

    expect(setup.query.result.value.isOk()).toBeTruthy()

    if (setup.query.result.value.isOk()) {
      const result = setup.query.result.value.getValue()

      expect(result.data).toHaveLength(2)
      expect(result.meta.total).toBe(5)
      expect(result.data[0]?.email).toBe('user1@example.com')
    }
  })

  it('prefetches keyset infinite query and avoids extra fetch', async () => {
    const items = createPrefetchUserItems(5)

    const queryFn = vi.fn(({
      key, limit,
    }: { key: string | undefined
      limit: number }) => {
      const startIdx = key ? Number.parseInt(String(key)) : 0

      return Promise.resolve(ok({
        data: items.slice(startIdx, startIdx + limit),
        meta: {
          next: startIdx + limit < items.length ? String(startIdx + limit) : null,
        },
      }))
    })

    const setup = runInSetup(() => {
      const {
        useKeysetInfiniteQuery, usePrefetchKeysetInfiniteQuery,
      } = createApiUtils<PrefetchQueryKeys>()

      return {
        prefetch: usePrefetchKeysetInfiniteQuery('userIndex', {
          staleTime: 999_999,
          limit: 2,
          params: {
            search: computed<string>(() => 'user'),
          },
          queryFn: ({
            key, limit,
          }) => queryFn({
            key,
            limit,
          }),
        }),
        query: useKeysetInfiniteQuery('userIndex', {
          staleTime: 999_999,
          limit: 2,
          params: {
            search: computed<string>(() => 'user'),
          },
          queryFn: ({
            key, limit,
          }) => queryFn({
            key,
            limit,
          }),
        }),
      }
    })

    await setup.prefetch.execute()
    await flushPromises()
    await nextTick()

    expect(queryFn).toHaveBeenCalledTimes(1)

    await flushPromises()
    await nextTick()

    expect(setup.query.result.value.isOk()).toBeTruthy()

    if (setup.query.result.value.isOk()) {
      const result = setup.query.result.value.getValue()

      expect(result.data).toHaveLength(2)
      expect(result.meta.next).toBe('2')
      expect(result.data[0]?.email).toBe('user1@example.com')
    }
  })
})
