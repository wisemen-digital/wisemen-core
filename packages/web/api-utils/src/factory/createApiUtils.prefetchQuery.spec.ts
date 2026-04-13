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

import { FactoryUserBuilder } from '@/builders/factoryUserBuilder'
import { createApiUtils } from '@/factory/createApiUtils'
import type {
  FactoryQueryKeys,
  UserUuid,
} from '@/factory/createApiUtils.setup'
import { flushPromises } from '@/test/flushPromises'
import { runInSetup } from '@/test/runInSetup'

describe('createApiUtils - usePrefetchQuery', () => {
  it('prefetches data and makes it available to useQuery', async () => {
    const user = new FactoryUserBuilder().build()

    const queryFn = vi.fn(() => {
      return Promise.resolve(ok(user))
    })

    const setup = runInSetup(() => {
      const {
        usePrefetchQuery, useQuery,
      } = createApiUtils<FactoryQueryKeys>()

      return {
        prefetch: usePrefetchQuery('userDetail', {
          staleTime: 999_999,
          params: {
            userUuid: computed<UserUuid>(() => 'uuid-123'),
          },
          queryFn,
        }),
        query: useQuery('userDetail', {
          staleTime: 999_999,
          params: {
            userUuid: computed<UserUuid>(() => 'uuid-123'),
          },
          queryFn,
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

    setup.query.result.value.match({
      err: () => {
        throw new Error('Expected ok state after prefetch')
      },
      loading: () => {
        throw new Error('Expected ok state after prefetch')
      },
      ok: (user) => {
        expect(user.email).toBe('john@example.com')
      },
    })
  })
})
