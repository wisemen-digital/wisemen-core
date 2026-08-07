import {
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest'

import { ProductBuilder } from '@/builders/productBuilder'
import { UserBuilder } from '@/builders/userBuilder'

import type { User } from './queryClient.setup'
import { createTestSetup } from './queryClient.setup'

describe('queryClient - update', () => {
  let queryClient: ReturnType<typeof createTestSetup>['queryClient']
  let tanstackQueryClient: ReturnType<typeof createTestSetup>['tanstackQueryClient']

  beforeEach(() => {
    const setup = createTestSetup()

    queryClient = setup.queryClient
    tanstackQueryClient = setup.tanstackQueryClient
  })

  describe('single entity', () => {
    it('should update a single entity by id (default)', () => {
      const user = new UserBuilder().withId('123').withUuid('abc-123').build()
      const queryKey = [
        'userDetail',
        {
          userUuid: user.uuid,
        },
      ] as const

      queryClient.set(queryKey, user)

      queryClient.update(queryKey, {
        by: (u) => u.id === '123',
        value: (u) => ({
          ...u,
          name: 'Jane Doe',
        }),
      })

      expect(queryClient.get(queryKey)).toEqual({
        ...user,
        name: 'Jane Doe',
      })
    })

    it('should update a single entity by custom field', () => {
      const user = new UserBuilder()
        .withId('123')
        .withUuid('abc-123')
        .build()
      const queryKey = [
        'userDetail',
        {
          userUuid: 'abc-123',
        },
      ] as const

      queryClient.set(queryKey, user)

      queryClient.update('userDetail', {
        by: (u) => u.uuid === 'abc-123',
        value: (u) => ({
          ...u,
          email: 'jane@example.com',
        }),
      })

      expect(queryClient.get(queryKey)).toEqual({
        ...user,
        email: 'jane@example.com',
      })
    })

    it('should update a single entity using a predicate function', () => {
      const user = new UserBuilder()
        .withId('123')
        .withUuid('abc-123')
        .build()
      const queryKey = [
        'userDetail',
        {
          userUuid: '123',
        },
      ] as const

      queryClient.set(queryKey, user)

      queryClient.update('userDetail', {
        by: (u) => u.email === 'john@example.com',
        value: (u) => ({
          ...u,
          isActive: false,
        }),
      })

      expect(queryClient.get(queryKey)).toEqual({
        ...user,
        isActive: false,
      })
    })

    it('should not update if no match found', () => {
      const user = new UserBuilder()
        .withId('123')
        .withUuid('abc-123')
        .build()
      const queryKey = [
        'userDetail',
        {
          userUuid: '123',
        },
      ] as const

      queryClient.set(queryKey, user)

      queryClient.update('userDetail', {
        by: (u) => u.id === '999',
        value: (u) => ({
          ...u,
          name: 'Jane Doe',
        }),
      })

      expect(queryClient.get(queryKey)).toEqual(user)
    })

    it('should handle matching by id', () => {
      const user = new UserBuilder()
        .withId('123')
        .withUuid('abc-123')
        .build()
      const queryKey = [
        'userDetail',
        {
          userUuid: '123',
        },
      ] as const

      queryClient.set(queryKey, user)

      queryClient.update('userDetail', {
        by: (u) => u.id === '123',
        value: (u) => ({
          ...u,
          name: 'Jane Doe',
        }),
      })

      expect(queryClient.get(queryKey)?.name).toBe('Jane Doe')
    })

    it('should match by multiple fields', () => {
      const user = new UserBuilder()
        .withId('123')
        .withUuid('abc-123')
        .build()
      const queryKey = [
        'userDetail',
        {
          userUuid: '123',
        },
      ] as const

      queryClient.set(queryKey, user)

      queryClient.update('userDetail', {
        by: (u) => u.id === '123' && u.uuid === 'abc-123',
        value: (u) => ({
          ...u,
          name: 'Jane Doe',
        }),
      })

      expect(queryClient.get(queryKey)?.name).toBe('Jane Doe')
    })
  })

  describe('array entities', () => {
    it('should update an item in an array by id', () => {
      const john = new UserBuilder()
        .withId('1')
        .withUuid('uuid-1')
        .build()
      const jane = new UserBuilder()
        .withId('2')
        .withUuid('uuid-2')
        .withName('Jane Doe')
        .withEmail('jane@example.com')
        .build()
      const queryKey = [
        'userList',
        {
          search: '',
        },
      ] as const

      queryClient.set(queryKey, [
        john,
        jane,
      ])

      queryClient.update('userList', {
        by: (u) => u.id === '2',
        value: (u) => ({
          ...u,
          name: 'Jane Smith',
        }),
      })

      expect(queryClient.get(queryKey)).toEqual([
        john,
        {
          ...jane,
          name: 'Jane Smith',
        },
      ])
    })

    it('should update an item in an array by custom field', () => {
      const laptop = new ProductBuilder()
        .withId('1')
        .withSku('PROD-001')
        .build()
      const mouse = new ProductBuilder()
        .withId('2')
        .withName('Mouse')
        .withPrice(49)
        .withSku('PROD-002')
        .build()
      const queryKey = [
        'productList',
        {
          category: 'electronics',
        },
      ] as const

      queryClient.set(queryKey, [
        laptop,
        mouse,
      ])

      queryClient.update('productList', {
        by: (p) => p.sku === 'PROD-002',
        value: (p) => ({
          ...p,
          price: 39,
        }),
      })

      expect(queryClient.get(queryKey)).toEqual([
        laptop,
        {
          ...mouse,
          price: 39,
        },
      ])
    })

    it('should update multiple items using a predicate function', () => {
      const laptop = new ProductBuilder()
        .withId('1')
        .withSku('PROD-001')
        .build()
      const mouse = new ProductBuilder()
        .withId('2')
        .withName('Mouse')
        .withPrice(49)
        .withSku('PROD-002')
        .build()
      const chair = new ProductBuilder()
        .withId('3')
        .withName('Chair')
        .withCategory('furniture')
        .withPrice(199)
        .withSku('PROD-003')
        .build()
      const queryKey = [
        'productList',
        {
          category: 'all',
        },
      ] as const

      queryClient.set(queryKey, [
        laptop,
        mouse,
        chair,
      ])

      queryClient.update('productList', {
        by: (p) => p.category === 'electronics',
        value: (p) => ({
          ...p,
          inStock: false,
        }),
      })

      expect(queryClient.get(queryKey)).toEqual([
        {
          ...laptop,
          inStock: false,
        },
        {
          ...mouse,
          inStock: false,
        },
        chair,
      ])
    })

    it('should not update if no items match', () => {
      const john = new UserBuilder()
        .withId('1')
        .withUuid('uuid-1')
        .build()
      const queryKey = [
        'userList',
        {
          search: '',
        },
      ] as const

      queryClient.set(queryKey, [
        john,
      ])

      queryClient.update('userList', {
        by: (u) => u.id === '999',
        value: (u) => ({
          ...u,
          name: 'Jane Doe',
        }),
      })

      expect(queryClient.get(queryKey)).toEqual([
        john,
      ])
    })
  })

  describe('multiple queries', () => {
    it('should update all matching queries', () => {
      const user1 = new UserBuilder()
        .withId('123')
        .withUuid('abc-123')
        .build()
      const user2 = new UserBuilder()
        .withId('123')
        .withUuid('abc-123')
        .withEmail('jane@example.com')
        .build()
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

      queryClient.update('userDetail', {
        by: (u) => u.id === '123',
        value: (u) => ({
          ...u,
          name: 'Updated Name',
        }),
      })

      expect(queryClient.get(queryKey1)?.name).toBe('Updated Name')
      expect(queryClient.get(queryKey2)?.name).toBe('Updated Name')
    })

    it('should update all queries with the same key', () => {
      const user1 = new UserBuilder()
        .withId('1')
        .withUuid('user-1')
        .withName('John')
        .build()
      const user2 = new UserBuilder()
        .withId('2')
        .withUuid('user-2')
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

      queryClient.update('userDetail', {
        by: () => true,
        value: (u) => ({
          ...u,
          isActive: false,
        }),
      })

      expect(queryClient.get(queryKey1)).toEqual({
        ...user1,
        isActive: false,
      })
      expect(queryClient.get(queryKey2)).toEqual({
        ...user2,
        isActive: false,
      })
    })

    it('should update all arrays with the same key using predicate', () => {
      const john = new UserBuilder().withId('1').withUuid('user-1').withName('John').build()
      const jane = new UserBuilder().withId('2').withUuid('user-2').withName('Jane').withEmail('jane@example.com').build()
      const bob = new UserBuilder().withId('3').withUuid('user-3').withName('Bob').withEmail('bob@example.com').build()

      queryClient.set([
        'userList',
        {
          search: 'active',
        },
      ], [
        john,
        jane,
      ])
      queryClient.set([
        'userList',
        {
          search: 'pending',
        },
      ], [
        bob,
      ])

      queryClient.update('userList', {
        by: (u: User) => u.name === 'John',
        value: (u: User) => ({
          ...u,
          isActive: false,
        }),
      })

      expect(queryClient.get([
        'userList',
        {
          search: 'active',
        },
      ])).toEqual([
        {
          ...john,
          isActive: false,
        },
        jane,
      ])
      expect(queryClient.get([
        'userList',
        {
          search: 'pending',
        },
      ])).toEqual([
        bob,
      ])
    })
  })

  describe('edge cases', () => {
    it('should handle null data gracefully', () => {
      const queryKey = [
        'userDetail',
        {
          userUuid: '123',
        },
      ] as const

      tanstackQueryClient.setQueryData(queryKey, null)

      expect(() => {
        queryClient.update('userDetail', {
          by: (u) => u.id === '123',
          value: (u) => ({
            ...u,
            name: 'John Doe',
          }),
        })
      }).not.toThrow()
    })

    it('should handle undefined data gracefully', () => {
      expect(() => {
        queryClient.update('userDetail', {
          by: (u) => u.id === '123',
          value: (u) => ({
            ...u,
            name: 'John Doe',
          }),
        })
      }).not.toThrow()
    })

    it('should handle empty arrays', () => {
      const queryKey = [
        'userList',
        {
          search: '',
        },
      ] as const

      queryClient.set(queryKey, [])

      queryClient.update('userList', {
        by: (u) => u.id === '123',
        value: (u) => ({
          ...u,
          name: 'John Doe',
        }),
      })

      expect(queryClient.get(queryKey)).toEqual([])
    })
  })

  describe('rollback', () => {
    it('should return a rollback function', () => {
      const user = new UserBuilder().withId('123').withUuid('abc-123').build()
      const queryKey = [
        'userDetail',
        {
          userUuid: 'abc-123',
        },
      ] as const

      queryClient.set(queryKey, user)

      const {
        rollback,
      } = queryClient.update(queryKey, {
        by: (u) => u.id === '123',
        value: (u) => ({
          ...u,
          name: 'Jane Doe',
        }),
      })

      expect(typeof rollback).toBe('function')
    })

    it('should restore single entity to original state on rollback', () => {
      const user = new UserBuilder().withId('123').withUuid('abc-123').build()
      const queryKey = [
        'userDetail',
        {
          userUuid: 'abc-123',
        },
      ] as const

      queryClient.set(queryKey, user)

      const {
        rollback,
      } = queryClient.update(queryKey, {
        by: (u) => u.id === '123',
        value: (u) => ({
          ...u,
          name: 'Jane Doe',
        }),
      })

      expect(queryClient.get(queryKey)).toEqual({
        ...user,
        name: 'Jane Doe',
      })

      rollback()

      expect(queryClient.get(queryKey)).toEqual(user)
    })

    it('should restore array entity to original state on rollback', () => {
      const john = new UserBuilder().withId('1').withUuid('uuid-1').build()
      const jane = new UserBuilder()
        .withId('2')
        .withUuid('uuid-2')
        .withName('Jane Doe')
        .withEmail('jane@example.com')
        .build()
      const queryKey = [
        'userList',
        {
          search: '',
        },
      ] as const

      queryClient.set(queryKey, [
        john,
        jane,
      ])

      const {
        rollback,
      } = queryClient.update('userList', {
        by: (u) => u.id === '2',
        value: (u) => ({
          ...u,
          name: 'Jane Smith',
        }),
      })

      expect(queryClient.get(queryKey)).toEqual([
        john,
        {
          ...jane,
          name: 'Jane Smith',
        },
      ])

      rollback()

      expect(queryClient.get(queryKey)).toEqual([
        john,
        jane,
      ])
    })

    it('should restore multiple queries on rollback', () => {
      const user1 = new UserBuilder().withId('123').withUuid('abc-123').build()
      const user2 = new UserBuilder()
        .withId('123')
        .withUuid('abc-123')
        .withEmail('jane@example.com')
        .build()
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

      const {
        rollback,
      } = queryClient.update('userDetail', {
        by: (u) => u.id === '123',
        value: (u) => ({
          ...u,
          name: 'Updated Name',
        }),
      })

      expect(queryClient.get(queryKey1)?.name).toBe('Updated Name')
      expect(queryClient.get(queryKey2)?.name).toBe('Updated Name')

      rollback()

      expect(queryClient.get(queryKey1)).toEqual(user1)
      expect(queryClient.get(queryKey2)).toEqual(user2)
    })

    it('should be idempotent - calling rollback multiple times has no effect', () => {
      const user = new UserBuilder().withId('123').withUuid('abc-123').build()
      const queryKey = [
        'userDetail',
        {
          userUuid: 'abc-123',
        },
      ] as const

      queryClient.set(queryKey, user)

      const {
        rollback,
      } = queryClient.update(queryKey, {
        by: (u) => u.id === '123',
        value: (u) => ({
          ...u,
          name: 'Jane Doe',
        }),
      })

      rollback()
      expect(queryClient.get(queryKey)).toEqual(user)

      // Second update after rollback
      queryClient.update(queryKey, {
        by: (u) => u.id === '123',
        value: (u) => ({
          ...u,
          name: 'Bob',
        }),
      })

      // Calling rollback again should not revert the second update
      rollback()
      expect(queryClient.get(queryKey)).toEqual({
        ...user,
        name: 'Bob',
      })
    })

    it('should not affect unrelated queries on rollback', () => {
      const user = new UserBuilder().withId('123').withUuid('abc-123').build()
      const product = new ProductBuilder().withId('1').withSku('PROD-001').build()

      const userKey = [
        'userDetail',
        {
          userUuid: 'abc-123',
        },
      ] as const
      const productKey = [
        'productList',
        {
          category: 'electronics',
        },
      ] as const

      queryClient.set(userKey, user)
      queryClient.set(productKey, [
        product,
      ])

      const {
        rollback,
      } = queryClient.update('userDetail', {
        by: (u) => u.id === '123',
        value: (u) => ({
          ...u,
          name: 'Jane Doe',
        }),
      })

      // Update product separately
      queryClient.update('productList', {
        by: (p) => p.id === '1',
        value: (p) => ({
          ...p,
          price: 999,
        }),
      })

      rollback()

      // User should be restored
      expect(queryClient.get(userKey)).toEqual(user)
      // Product should keep its separate update
      expect(queryClient.get(productKey)).toEqual([
        {
          ...product,
          price: 999,
        },
      ])
    })
  })
})
