import {
  describe,
  expect,
  it,
} from 'vitest'

import { ArrayUtil } from './array.util'

describe('arrayUtil', () => {
  describe('chunk', () => {
    it('splits an array into chunks', () => {
      expect(ArrayUtil.chunk([
        1,
        2,
        3,
        4,
        5,
      ], 2)).toEqual([
        [
          1,
          2,
        ],
        [
          3,
          4,
        ],
        [
          5,
        ],
      ])
    })

    it('returns one chunk when size >= array length', () => {
      expect(ArrayUtil.chunk([
        1,
        2,
      ], 5)).toEqual([
        [
          1,
          2,
        ],
      ])
    })

    it('returns empty array when size <= 0', () => {
      expect(ArrayUtil.chunk([
        1,
        2,
        3,
      ], 0)).toEqual([])
    })
  })

  describe('groupBy', () => {
    it('groups items by a given key', () => {
      const items = [
        {
          type: 'a',
          v: 1,
        },
        {
          type: 'b',
          v: 2,
        },
        {
          type: 'a',
          v: 3,
        },
      ]
      const result = ArrayUtil.groupBy(items, 'type')

      expect(result.get('a')).toEqual([
        {
          type: 'a',
          v: 1,
        },
        {
          type: 'a',
          v: 3,
        },
      ])
      expect(result.get('b')).toEqual([
        {
          type: 'b',
          v: 2,
        },
      ])
    })
  })

  describe('sortBy', () => {
    const users = [
      {
        name: 'Charlie',
      },
      {
        name: 'Alice',
      },
      {
        name: 'Bob',
      },
    ]

    it('sorts in ascending order by default', () => {
      expect(ArrayUtil.sortBy(users, 'name').map((u) => u.name)).toEqual([
        'Alice',
        'Bob',
        'Charlie',
      ])
    })

    it('sorts in descending order when specified', () => {
      expect(ArrayUtil.sortBy(users, 'name', 'desc').map((u) => u.name)).toEqual([
        'Charlie',
        'Bob',
        'Alice',
      ])
    })
  })

  describe('unique', () => {
    it('removes duplicate values', () => {
      expect(ArrayUtil.unique([
        1,
        2,
        2,
        3,
      ])).toEqual([
        1,
        2,
        3,
      ])
    })

    it('returns the same array when no duplicates', () => {
      expect(ArrayUtil.unique([
        1,
        2,
        3,
      ])).toEqual([
        1,
        2,
        3,
      ])
    })
  })
})
