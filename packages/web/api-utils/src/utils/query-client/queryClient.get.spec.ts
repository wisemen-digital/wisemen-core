import {
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest'

import { UserBuilder } from '@/builders/userBuilder'

import { createTestSetup } from './queryClient.setup'

describe('queryClient - get', () => {
  let queryClient: ReturnType<typeof createTestSetup>['queryClient']

  beforeEach(() => {
    const setup = createTestSetup()

    queryClient = setup.queryClient
  })

  it('should get all entities with the same key', () => {
    const user1 = new UserBuilder()
      .withId('1')
      .withUuid('user-1')
      .withName('John')
      .build()
    const user2 = new UserBuilder()
      .withId('2')
      .withUuid('user-2')
      .withIsActive(false)
      .withName('Jane')
      .withEmail('jane@example.com')
      .build()
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

    queryClient.set(queryKey1, user1)
    queryClient.set(queryKey2, user2)

    const allUsers = queryClient.get('userDetail')

    expect(allUsers).toHaveLength(2)
    expect(allUsers).toContainEqual(user1)
    expect(allUsers).toContainEqual(user2)
  })

  it('should return empty array when no queries match the key', () => {
    expect(queryClient.get('userDetail')).toEqual([])
  })
})
