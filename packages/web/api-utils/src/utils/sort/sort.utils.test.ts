import {
  describe,
  expect,
  it,
} from 'vitest'

import type { Sort } from '@/types/sort.type'
import { SortDirection } from '@/types/sort.type'

import { SortUtil } from './sort.utils'

describe('sortUtil', () => {
  describe('toDto', () => {
    it('should convert sort array to DTO format', () => {
      const sort: Sort<'email' | 'name'>[] = [
        {
          direction: SortDirection.ASC,
          key: 'name',
        },
        {
          direction: SortDirection.DESC,
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
          direction: SortDirection.ASC,
          key: 'name',
        },
        {
          direction: null as any, // null direction should be filtered out
          key: 'email',
        },
        {
          direction: SortDirection.DESC,
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
          order: SortDirection.ASC,
        },
        {
          key: 'userAge',
          order: SortDirection.DESC,
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

    it('should correctly map asc direction to SortDirection.ASC', () => {
      const sort: Sort<'name'>[] = [
        {
          direction: SortDirection.ASC,
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
          order: SortDirection.ASC,
        },
      ])
    })

    it('should correctly map desc direction to SortDirection.DESC', () => {
      const sort: Sort<'name'>[] = [
        {
          direction: SortDirection.DESC,
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
          order: SortDirection.DESC,
        },
      ])
    })

    it('should handle multiple sort items with mixed directions', () => {
      const sort: Sort<'createdAt' | 'email' | 'firstName' | 'lastName'>[] = [
        {
          direction: SortDirection.ASC,
          key: 'firstName',
        },
        {
          direction: SortDirection.DESC,
          key: 'lastName',
        },
        {
          direction: SortDirection.ASC,
          key: 'email',
        },
        {
          direction: SortDirection.DESC,
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
          order: SortDirection.ASC,
        },
        {
          key: 'last_name',
          order: SortDirection.DESC,
        },
        {
          key: 'email_address',
          order: SortDirection.ASC,
        },
        {
          key: 'created_at',
          order: SortDirection.DESC,
        },
      ])
    })

    it('should preserve the order of sort items', () => {
      const sort: Sort<'date' | 'name' | 'priority'>[] = [
        {
          direction: SortDirection.DESC,
          key: 'priority',
        },
        {
          direction: SortDirection.ASC,
          key: 'name',
        },
        {
          direction: SortDirection.DESC,
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
        order: SortDirection.DESC,
      })
      expect(result[1]).toEqual({
        key: 'task_name',
        order: SortDirection.ASC,
      })
      expect(result[2]).toEqual({
        key: 'due_date',
        order: SortDirection.DESC,
      })
    })

    it('should work with different key types', () => {
      const sort: Sort<'id' | 'status'>[] = [
        {
          direction: SortDirection.ASC,
          key: 'id',
        },
        {
          direction: SortDirection.DESC,
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
          order: SortDirection.ASC,
        },
        {
          key: 'item_status',
          order: SortDirection.DESC,
        },
      ])
    })

    it('should handle single sort item', () => {
      const sort: Sort<'username'>[] = [
        {
          direction: SortDirection.ASC,
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
          order: SortDirection.ASC,
        },
      ])
    })
  })
})
