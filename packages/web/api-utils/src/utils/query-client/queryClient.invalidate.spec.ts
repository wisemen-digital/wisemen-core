import {
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest'

import { UserBuilder } from '@/builders/userBuilder'

import { createTestSetup } from './queryClient.setup'

describe('queryClient - invalidate', () => {
  let queryClient: ReturnType<typeof createTestSetup>['queryClient']
  let tanstackQueryClient: ReturnType<typeof createTestSetup>['tanstackQueryClient']

  beforeEach(() => {
    const setup = createTestSetup()

    queryClient = setup.queryClient
    tanstackQueryClient = setup.tanstackQueryClient
  })

  it('should invalidate queries by key', async () => {
    const user = new UserBuilder().withId('123').withUuid('abc-123').build()
    const queryKey = [
      'userDetail',
      {
        userUuid: '123',
      },
    ] as const

    queryClient.set(queryKey, user)

    await queryClient.invalidate('userDetail')

    const query = tanstackQueryClient
      .getQueryCache()
      .find({
        queryKey,
      })

    expect(query?.state.isInvalidated).toBeTruthy()
  })

  it('should invalidate queries by key and params', async () => {
    const user1 = new UserBuilder().withId('123').withUuid('abc-123').build()
    const user2 = new UserBuilder().withId('456').withUuid('def-456').withName('Jane Doe').withEmail('jane@example.com').build()
    const queryKey1 = [
      'userDetail',
      {
        userUuid: 'abc-123',
      },
    ] as const
    const queryKey2 = [
      'userDetail',
      {
        userUuid: 'def-456',
      },
    ] as const

    queryClient.set(queryKey1, user1)
    queryClient.set(queryKey2, user2)

    await queryClient.invalidate([
      'userDetail',
      {
        userUuid: 'abc-123',
      },
    ])

    const query1 = tanstackQueryClient
      .getQueryCache()
      .find({
        queryKey: queryKey1,
      })
    const query2 = tanstackQueryClient
      .getQueryCache()
      .find({
        queryKey: queryKey2,
      })

    expect(query1?.state.isInvalidated).toBeTruthy()
    expect(query2?.state.isInvalidated).toBeFalsy()
  })

  it('should handle refs in params', async () => {
    const user = new UserBuilder().withId('123').withUuid('abc-123').build()
    const userUuid = 'abc-123'
    const queryKey = [
      'userDetail',
      {
        userUuid,
      },
    ] as const

    queryClient.set(queryKey, user)

    await queryClient.invalidate([
      'userDetail',
      {
        userUuid,
      },
    ])

    const query = tanstackQueryClient
      .getQueryCache()
      .find({
        queryKey,
      })

    expect(query?.state.isInvalidated).toBeTruthy()
  })

  it('should invalidate all queries with the same key', async () => {
    const user = new UserBuilder().withId('123').withUuid('abc-123').build()
    const queryKey1 = [
      'userDetail',
      {
        userUuid: 'user-1',
      },
    ] as const
    const queryKey2 = [
      'userDetail',
      {
        userUuid: 'user-2',
      },
    ] as const

    queryClient.set(queryKey1, user)
    queryClient.set(queryKey2, user)

    await queryClient.invalidate('userDetail')

    const query1 = tanstackQueryClient
      .getQueryCache()
      .find({
        queryKey: queryKey1,
      })
    const query2 = tanstackQueryClient
      .getQueryCache()
      .find({
        queryKey: queryKey2,
      })

    expect(query1?.state.isInvalidated).toBeTruthy()
    expect(query2?.state.isInvalidated).toBeTruthy()
  })
})
