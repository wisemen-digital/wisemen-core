import {
  describe,
  expect,
  it,
} from 'vitest'

import type { Sort } from '@/types/sort.type'

import { SortUtil } from './sort.utils'

describe('sortUtil', () => {
  describe('toDto', () => {
    it('should convert sort array to DTO format', () => {
      const sort: Sort<'email' | 'name'>[] = [
        {
          direction: 'asc',
          key: 'name',
        },
        {
          direction: 'desc',
          key: 'email',
        },
      ]

      const sortKeyMap = {
        name: 'fullName',
        email: 'emailAddress',
      }

      const result = SortUtil.toDto(sort, sortKeyMap)

      expect(result).toEqual([
        {
          key: 'fullName',
          order: 'asc',
        },
        {
          key: 'emailAddress',
          order: 'desc',
        },
      ])
    })

    it('should filter out sort items with null direction', () => {
      const sort: Sort<'age' | 'email' | 'name'>[] = [
        {
          direction: 'asc',
          key: 'name',
        },
        {
          direction: null as any, // null direction should be filtered out
          key: 'email',
        },
        {
          direction: 'desc',
          key: 'age',
        },
      ]

      const sortKeyMap = {
        name: 'fullName',
        age: 'userAge',
        email: 'emailAddress',
      }

      const result = SortUtil.toDto(sort, sortKeyMap)

      expect(result).toEqual([
        {
          key: 'fullName',
          order: 'asc',
        },
        {
          key: 'userAge',
          order: 'desc',
        },
      ])
    })

    it('should handle empty sort array', () => {
      const sort: Sort<'name'>[] = []
      const sortKeyMap = {
        name: 'fullName',
      }

      const result = SortUtil.toDto(sort, sortKeyMap)

      expect(result).toEqual([])
    })

    it('should handle sort array with all null directions', () => {
      const sort: Sort<'email' | 'name'>[] = [
        {
          direction: null as any,
          key: 'name',
        },
        {
          direction: null as any,
          key: 'email',
        },
      ]

      const sortKeyMap = {
        name: 'fullName',
        email: 'emailAddress',
      }

      const result = SortUtil.toDto(sort, sortKeyMap)

      expect(result).toEqual([])
    })

    it('should correctly map asc direction to asc', () => {
      const sort: Sort<'name'>[] = [
        {
          direction: 'asc',
          key: 'name',
        },
      ]

      const sortKeyMap = {
        name: 'fullName',
      }

      const result = SortUtil.toDto(sort, sortKeyMap)

      expect(result).toEqual([
        {
          key: 'fullName',
          order: 'asc',
        },
      ])
    })

    it('should correctly map desc direction to desc', () => {
      const sort: Sort<'name'>[] = [
        {
          direction: 'desc',
          key: 'name',
        },
      ]

      const sortKeyMap = {
        name: 'fullName',
      }

      const result = SortUtil.toDto(sort, sortKeyMap)

      expect(result).toEqual([
        {
          key: 'fullName',
          order: 'desc',
        },
      ])
    })

    it('should handle multiple sort items with mixed directions', () => {
      const sort: Sort<'createdAt' | 'email' | 'firstName' | 'lastName'>[] = [
        {
          direction: 'asc',
          key: 'firstName',
        },
        {
          direction: 'desc',
          key: 'lastName',
        },
        {
          direction: 'asc',
          key: 'email',
        },
        {
          direction: 'desc',
          key: 'createdAt',
        },
      ]

      const sortKeyMap = {
        createdAt: 'created_at',
        email: 'email_address',
        firstName: 'first_name',
        lastName: 'last_name',
      }

      const result = SortUtil.toDto(sort, sortKeyMap)

      expect(result).toEqual([
        {
          key: 'first_name',
          order: 'asc',
        },
        {
          key: 'last_name',
          order: 'desc',
        },
        {
          key: 'email_address',
          order: 'asc',
        },
        {
          key: 'created_at',
          order: 'desc',
        },
      ])
    })

    it('should preserve the order of sort items', () => {
      const sort: Sort<'date' | 'name' | 'priority'>[] = [
        {
          direction: 'desc',
          key: 'priority',
        },
        {
          direction: 'asc',
          key: 'name',
        },
        {
          direction: 'desc',
          key: 'date',
        },
      ]

      const sortKeyMap = {
        name: 'task_name',
        date: 'due_date',
        priority: 'task_priority',
      }

      const result = SortUtil.toDto(sort, sortKeyMap)

      // Order should be preserved
      expect(result[0]).toEqual({
        key: 'task_priority',
        order: 'desc',
      })
      expect(result[1]).toEqual({
        key: 'task_name',
        order: 'asc',
      })
      expect(result[2]).toEqual({
        key: 'due_date',
        order: 'desc',
      })
    })

    it('should work with different key types', () => {
      const sort: Sort<'id' | 'status'>[] = [
        {
          direction: 'asc',
          key: 'id',
        },
        {
          direction: 'desc',
          key: 'status',
        },
      ]

      const sortKeyMap = {
        id: 123 as const, // Number key
        status: 'item_status' as const, // String key
      }

      const result = SortUtil.toDto(sort, sortKeyMap)

      expect(result).toEqual([
        {
          key: 123,
          order: 'asc',
        },
        {
          key: 'item_status',
          order: 'desc',
        },
      ])
    })

    it('should handle single sort item', () => {
      const sort: Sort<'username'>[] = [
        {
          direction: 'asc',
          key: 'username',
        },
      ]

      const sortKeyMap = {
        username: 'user_name',
      }

      const result = SortUtil.toDto(sort, sortKeyMap)

      expect(result).toEqual([
        {
          key: 'user_name',
          order: 'asc',
        },
      ])
    })
  })
})
