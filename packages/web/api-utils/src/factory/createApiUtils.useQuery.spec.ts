import { ok } from 'neverthrow'
import {
  describe,
  expect,
  it,
} from 'vitest'
import { computed } from 'vue'

import { FactoryUserBuilder } from '@/builders/factoryUserBuilder'
import { createApiUtils } from '@/factory/createApiUtils'
import type {
  FactoryQueryKeys,
  UserUuid,
} from '@/factory/createApiUtils.setup'
import { runInSetup } from '@/test/runInSetup'

describe('createApiUtils - useQuery', () => {
  it('returns AsyncResult<User> for userDetail', async () => {
    const user = new FactoryUserBuilder().build()

    const query = runInSetup(() => {
      const {
        useQuery,
      } = createApiUtils<FactoryQueryKeys>()

      return useQuery('userDetail', {
        params: {
          userUuid: computed<UserUuid>(() => 'uuid-123'),
        },
        queryFn: () => Promise.resolve(ok(user)),
      })
    })

    expect(query.result.value.isLoading()).toBeTruthy()

    await query.refetch()

    expect(query.result.value.isOk()).toBeTruthy()

    query.result.value.match({
      err: () => {
        throw new Error('Expected ok state after refetch')
      },
      loading: () => {
        throw new Error('Expected ok state after refetch')
      },
      ok: (user) => {
        expect(user.email).toBe('john@example.com')
      },
    })
  })

  it('returns AsyncResult<User[]> for userIndex', async () => {
    const users = [
      new FactoryUserBuilder().build(),
      new FactoryUserBuilder().withId('124').withUuid('uuid-124').withName('Alice Smith').withEmail('test@test.be').build(),
      new FactoryUserBuilder().withId('125').withUuid('uuid-125').withName('Bob Johnson').withEmail('bob@example.com').build(),
    ]

    const query = runInSetup(() => {
      const {
        useQuery, useQueryClient,
      } = createApiUtils<FactoryQueryKeys>()

      return {
        query: useQuery('userIndex', {
          params: {
            search: computed<string>(() => 'user'),
          },
          queryFn: () => Promise.resolve(ok(users)),
        }),
        updated: useQueryClient(),
      }
    })

    expect(query.query.result.value.isLoading()).toBeTruthy()

    await query.query.refetch()
    expect(query.query.result.value.isOk()).toBeTruthy()

    query.query.result.value.match({
      err: () => {
        throw new Error('Expected ok state after refetch')
      },
      loading: () => {
        throw new Error('Expected ok state after refetch')
      },
      ok: (users) => {
        expect(users).toHaveLength(3)
        expect(users[0]?.email).toBe('john@example.com')
      },
    })

    query.updated.update('userIndex', {
      by: (user) => user.id === '123',
      value: (user) => ({
        ...user,
        name: 'Jane Doe',
        email: 'jane@example.com',
      }),
    })

    query.query.result.value.match({
      err: () => {
        throw new Error('Expected ok state after optimistic update')
      },
      loading: () => {
        throw new Error('Expected ok state after optimistic update')
      },
      ok: (users) => {
        expect(users).toHaveLength(3)
        expect(users[0]?.name).toBe('Jane Doe')
        expect(users[0]?.email).toBe('jane@example.com')
      },
    })

    query.updated.update('userIndex', {
      by: (user) => user.email.endsWith('@example.com'),
      value: (user) => ({
        ...user,
        name: 'example user',
      }),
    })

    query.query.result.value.match({
      err: () => {
        throw new Error('Expected ok state after optimistic update')
      },
      loading: () => {
        throw new Error('Expected ok state after optimistic update')
      },
      ok: (users) => {
        expect(users).toHaveLength(3)

        const usersWithExampleUserName = users.filter((user) => user.name === 'example user')

        expect(usersWithExampleUserName).toHaveLength(2)
      },
    })
  })
})
