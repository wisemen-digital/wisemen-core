/* eslint-disable test/no-conditional-expect */
/* eslint-disable test/no-conditional-in-test */

import { ok } from 'neverthrow'
import {
  describe,
  expect,
  it,
} from 'vitest'
import {
  computed,
  nextTick,
} from 'vue'

import { createApiUtils } from '@/factory/createApiUtils'
import type { FactoryUser } from '@/factory/createApiUtils.setup'
import { flushPromises } from '@/test/flushPromises'
import { runInSetup } from '@/test/runInSetup'

interface InfiniteQueryKeys {
  userIndex: {
    entity: FactoryUser[]
    params: {
      search?: string
    }
  }
}

function createUserItems(count: number): FactoryUser[] {
  return Array.from({
    length: count,
  }, (_, i) => ({
    id: String(i + 1),
    uuid: `uuid-${i + 1}`,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
  }))
}

describe('createApiUtils - infinite queries', () => {
  it('useOffsetInfiniteQuery returns typed OffsetPaginationResponse<Item>', async () => {
    const items = createUserItems(5)

    const setup = runInSetup(() => {
      const {
        useOffsetInfiniteQuery, useQueryClient,
      } = createApiUtils<InfiniteQueryKeys>()

      return {
        query: useOffsetInfiniteQuery('userIndex', {
          limit: 2,
          params: {
            search: computed<string>(() => 'user'),
          },
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
        }),
        queryClient: useQueryClient(),
      }
    })

    await flushPromises()
    await nextTick()

    expect(setup.query.result.value.isOk()).toBeTruthy()

    if (setup.query.result.value.isOk()) {
      const result = setup.query.result.value.getValue()

      expect(result.data).toHaveLength(2)
      expect(result.meta.total).toBe(5)
      expect(result.data[0]?.email).toBe('user1@example.com')
    }

    setup.queryClient.update('userIndex', {
      by: (user) => user.id === '1',
      value: (user) => ({
        ...user,
        name: 'Updated User 1',
      }),
    })

    if (setup.query.result.value.isOk()) {
      expect(setup.query.result.value.getValue().data[0]?.name).toBe('Updated User 1')
    }

    await setup.query.fetchNextPage()
    await flushPromises()
    await nextTick()

    if (setup.query.result.value.isOk()) {
      expect(setup.query.result.value.getValue().data).toHaveLength(4)
    }
  })

  it('useKeysetInfiniteQuery returns typed KeysetPaginationResponse<Item>', async () => {
    const items = createUserItems(4)

    const setup = runInSetup(() => {
      const {
        useKeysetInfiniteQuery, useQueryClient,
      } = createApiUtils<InfiniteQueryKeys>()

      return {
        query: useKeysetInfiniteQuery('userIndex', {
          limit: 2,
          params: {
            search: computed<string>(() => 'user'),
          },
          queryFn: async ({
            key, limit,
          }) => {
            const startIdx = key ? Number.parseInt(String(key)) : 0

            return await Promise.resolve(ok({
              data: items.slice(startIdx, startIdx + limit),
              meta: {
                next: startIdx + limit < items.length ? String(startIdx + limit) : null,
              },
            }))
          },
        }),
        queryClient: useQueryClient(),
      }
    })

    await flushPromises()
    await nextTick()

    expect(setup.query.result.value.isOk()).toBeTruthy()
    expect(setup.query.hasNextPage.value).toBeTruthy()

    setup.queryClient.update('userIndex', {
      by: (user) => user.id === '2',
      value: (user) => ({
        ...user,
        email: 'updated2@example.com',
      }),
    })

    if (setup.query.result.value.isOk()) {
      expect(setup.query.result.value.getValue().data[1]?.email).toBe('updated2@example.com')
    }

    await setup.query.fetchNextPage()
    await flushPromises()
    await nextTick()

    if (setup.query.result.value.isOk()) {
      const result = setup.query.result.value.getValue()

      expect(result.data).toHaveLength(4)
      expect(result.data.map((u) => u.id)).toEqual([
        '1',
        '2',
        '3',
        '4',
      ])
    }

    expect(setup.query.hasNextPage.value).toBeFalsy()
  })
})
