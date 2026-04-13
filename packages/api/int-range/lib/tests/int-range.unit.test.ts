import { describe, it } from 'node:test'
import { expect } from 'expect'
import { Inclusivity } from '#src/inclusivity.js'
import { IntRange } from '#src/int-range.js'
import { InvalidIntRangeBounds } from '#src/int-range.errors.js'

describe('IntRange unit tests', () => {
  describe('constructor', () => {
    it('Throws an error when a range is created for (10, 5)', () => {
      expect(() => new IntRange(10, 5)).toThrow(InvalidIntRangeBounds)
    })

    it('Creates a range for [1, 10]', () => {
      expect(() => new IntRange(1, 10)).not.toThrow()
    })

    it('Creates a range containing one value [5, 5]', () => {
      expect(() => new IntRange(5, 5)).not.toThrow()
    })

    it('Creates a range of 1 value [5, 6)', () => {
      const range = new IntRange(5, 6, Inclusivity.INCLUSIVE, Inclusivity.EXCLUSIVE)

      expect(range.from).toBe(5)
      expect(range.until).toBe(5)
    })

    it('Creates a range from an inclusivity string', () => {
      expect(() => new IntRange(1, 10, '[]')).not.toThrow()
      expect(() => new IntRange(1, 10, '[)')).not.toThrow()
      expect(() => new IntRange(1, 10, '()')).not.toThrow()
      expect(() => new IntRange(1, 10, '(]')).not.toThrow()
    })
  })

  describe('size', () => {
    it('returns 1 for [5,5]', () => {
      const range = new IntRange(5, 5)

      expect(range.size).toBe(1)
    })

    it('returns 10 for [1,10]', () => {
      const range = new IntRange(1, 10)

      expect(range.size).toBe(10)
    })

    it('returns 9 for [1,10)', () => {
      const range = new IntRange(1, 10, '[)')

      expect(range.size).toBe(9)
    })
  })

  describe('contains', () => {
    it('[1, 10] contains 5', () => {
      const range = new IntRange(1, 10)

      expect(range.contains(5)).toBe(true)
    })

    it('[1, 10] does not contain 15', () => {
      const range = new IntRange(1, 10)

      expect(range.contains(15)).toBe(false)
    })

    it('[1, 10] does not contain 0', () => {
      const range = new IntRange(1, 10)

      expect(range.contains(0)).toBe(false)
    })

    it('(5, 10] does not contain 5', () => {
      const range = new IntRange(5, 10, '(]')

      expect(range.contains(5)).toBe(false)
    })

    it('[5, 10) does not contain 10', () => {
      const range = new IntRange(5, 10, '[)')

      expect(range.contains(10)).toBe(false)
    })
  })

  describe('overlaps', () => {
    it('[1, 5] overlaps with [3, 7]', () => {
      const first = new IntRange(1, 5)
      const second = new IntRange(3, 7)

      expect(first.overlaps(second)).toBe(true)
    })

    it('[1, 5] does not overlap with [6, 10]', () => {
      const first = new IntRange(1, 5)
      const second = new IntRange(6, 10)

      expect(first.overlaps(second)).toBe(false)
    })

    it('[1, 5] overlaps with [5, 10]', () => {
      const first = new IntRange(1, 5)
      const second = new IntRange(5, 10)

      expect(first.overlaps(second)).toBe(true)
    })
  })

  describe('overlap', () => {
    it('overlap between [1, 10] and [5, 15] is [5, 10]', () => {
      const first = new IntRange(1, 10)
      const second = new IntRange(5, 15)
      const overlap = first.overlap(second)

      expect(overlap.from).toBe(5)
      expect(overlap.until).toBe(10)
    })

    it('overlap between [5, 5] and [1, 10] is [5, 5]', () => {
      const first = new IntRange(5, 5)
      const second = new IntRange(1, 10)
      const overlap = first.overlap(second)

      expect(overlap.from).toBe(5)
      expect(overlap.until).toBe(5)
    })
  })

  describe('diff', () => {
    it('diff between [1, 10] and [5, 15] is [1, 4]', () => {
      const first = new IntRange(1, 10)
      const second = new IntRange(5, 15)
      const diff = first.diff(second)

      expect(diff).toHaveLength(1)
      expect(diff[0].from).toBe(1)
      expect(diff[0].until).toBe(4)
    })

    it('diff between [1, 10] and [4, 6] is [1, 3] and [7, 10]', () => {
      const first = new IntRange(1, 10)
      const second = new IntRange(4, 6)
      const diff = first.diff(second)

      expect(diff).toHaveLength(2)
      expect(diff[0].from).toBe(1)
      expect(diff[0].until).toBe(3)
      expect(diff[1].from).toBe(7)
      expect(diff[1].until).toBe(10)
    })
  })

  describe('startsAfter', () => {
    it('returns true if the value is before the start of the range', () => {
      const range = new IntRange(5, 10)

      expect(range.startsAfter(3)).toBe(true)
    })

    it('returns false if the value is equal to the start of the range', () => {
      const range = new IntRange(5, 10)

      expect(range.startsAfter(5)).toBe(false)
    })

    it('returns false if the value is after the start of the range', () => {
      const range = new IntRange(5, 10)

      expect(range.startsAfter(7)).toBe(false)
    })
  })

  describe('endsBefore', () => {
    it('returns true if the value is after the end of the range', () => {
      const range = new IntRange(5, 10)

      expect(range.endsBefore(15)).toBe(true)
    })

    it('returns false if the value is equal to the end of the range', () => {
      const range = new IntRange(5, 10)

      expect(range.endsBefore(10)).toBe(false)
    })

    it('returns false if the value is before the end of the range', () => {
      const range = new IntRange(5, 10)

      expect(range.endsBefore(7)).toBe(false)
    })
  })

  describe('toString', () => {
    it('returns string with inclusive lower and exclusive upper', () => {
      const range = new IntRange(5, 10)

      expect(range.toString()).toBe('[5,11)')
    })
  })

  describe('setUntil', () => {
    it('returns a new IntRange with updated until', () => {
      const range = new IntRange(5, 10)
      const newRange = range.setUntil(15)

      expect(newRange.from).toBe(range.from)
      expect(newRange.until).toBe(15)
    })
  })

  describe('setFrom', () => {
    it('returns a new IntRange with updated from', () => {
      const range = new IntRange(5, 10)
      const newRange = range.setFrom(1)

      expect(newRange.from).toBe(1)
      expect(newRange.until).toBe(range.until)
    })
  })

  describe('precedes', () => {
    it('returns true if this.until + 1 equals other.from', () => {
      const range1 = new IntRange(1, 5)
      const range2 = new IntRange(6, 10)

      expect(range1.precedes(range2)).toBe(true)
    })

    it('returns false if ranges do not touch', () => {
      const range1 = new IntRange(1, 5)
      const range2 = new IntRange(8, 10)

      expect(range1.precedes(range2)).toBe(false)
    })
  })

  describe('succeeds', () => {
    it('returns true if this.from - 1 equals other.until', () => {
      const range1 = new IntRange(6, 10)
      const range2 = new IntRange(1, 5)

      expect(range1.succeeds(range2)).toBe(true)
    })

    it('returns false if ranges do not touch', () => {
      const range1 = new IntRange(8, 10)
      const range2 = new IntRange(1, 5)

      expect(range1.succeeds(range2)).toBe(false)
    })
  })

  describe('isAdjacentTo', () => {
    it('returns true if ranges are adjacent', () => {
      const range1 = new IntRange(1, 5)
      const range2 = new IntRange(6, 10)

      expect(range1.isAdjacentTo(range2)).toBe(true)
      expect(range2.isAdjacentTo(range1)).toBe(true)
    })

    it('returns false if ranges are not adjacent', () => {
      const range1 = new IntRange(1, 5)
      const range2 = new IntRange(8, 10)

      expect(range1.isAdjacentTo(range2)).toBe(false)
    })
  })

  describe('merge', () => {
    it('merges two adjacent ranges', () => {
      const range1 = new IntRange(1, 5)
      const range2 = new IntRange(6, 10)

      const merged = range1.merge(range2)

      expect(merged.from).toBe(1)
      expect(merged.until).toBe(10)
    })

    it('throws if ranges are not adjacent', () => {
      const range1 = new IntRange(1, 5)
      const range2 = new IntRange(8, 10)

      expect(() => range1.merge(range2)).toThrow()
    })
  })
})
