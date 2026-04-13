import {
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest'

import { UserBuilder } from '@/builders/userBuilder'

import { createTestSetup } from './queryClient.setup'

describe('queryClient - set', () => {
  let queryClient: ReturnType<typeof createTestSetup>['queryClient']
  let tanstackQueryClient: ReturnType<typeof createTestSetup>['tanstackQueryClient']

  beforeEach(() => {
    const setup = createTestSetup()

    queryClient = setup.queryClient
    tanstackQueryClient = setup.tanstackQueryClient
  })
  it('should set a query using single key format', () => {
    const user = new UserBuilder().withId('123').withUuid('abc-123').build()

    queryClient.set('userDetail', user)

    expect(queryClient.get('userDetail')).toEqual([
      user,
    ])
  })

  it('should store single key query in normalized array format', () => {
    const user = new UserBuilder().withId('123').withUuid('abc-123').build()

    queryClient.set('userDetail', user)

    const query = tanstackQueryClient
      .getQueryCache()
      .find({
        queryKey: [
          'userDetail',
        ],
      })

    expect(query).toBeDefined()
    expect(query?.state.data).toBeDefined()
  })

  it('should distinguish between single key and tuple key formats', () => {
    const user1 = new UserBuilder().withId('1').withUuid('user-1').withName('John').build()
    const user2 = new UserBuilder().withId('2').withUuid('user-2').withName('Jane').withEmail('jane@example.com').build()

    queryClient.set('userDetail', user1)
    queryClient.set([
      'userDetail',
      {
        userUuid: 'user-2',
      },
    ] as const, user2)

    const allResults = queryClient.get('userDetail')

    expect(allResults).toContainEqual(user1)
    expect(allResults).toContainEqual(user2)
    expect(allResults).toHaveLength(2)

    const exactResult = queryClient.get('userDetail', {
      isExact: true,
    })

    expect(exactResult).toEqual(user1)

    const tupleKeyResult = queryClient.get([
      'userDetail',
      {
        userUuid: 'user-2',
      },
    ] as const)

    expect(tupleKeyResult).toEqual(user2)
  })
})
