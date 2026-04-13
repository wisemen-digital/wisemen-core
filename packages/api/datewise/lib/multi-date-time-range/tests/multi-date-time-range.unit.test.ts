import { before, describe, it } from 'node:test'
import { expect } from 'expect'
import { initDayjs } from '../../common/init-dayjs.js'
import { PastInfinity } from '../../timestamp/past-infinity.js'
import { FutureInfinity } from '../../timestamp/future-infinity.js'
import { timestamp } from '../../timestamp/index.js'
import { DateTimeRange } from '../../date-time-range/date-time-range.js'
import { MultiDateTimeRange } from '../multi-date-time-range.js'

describe('MultiDateTimeRange unit tests', () => {
  before(() => {
    initDayjs()
  })

  describe('constructor', () => {
    it('creates multi range from non-overlapping ranges', () => {
      const rangeA = new DateTimeRange(timestamp('2024-01-01'), timestamp('2024-01-02'))
      const rangeB = new DateTimeRange(timestamp('2024-01-10'), timestamp('2024-01-11'))
      const multi = new MultiDateTimeRange([rangeA, rangeB])

      expect(multi.length).toBe(2)
      expect(multi.ranges[0].isSame(rangeA)).toBe(true)
      expect(multi.ranges[1].isSame(rangeB)).toBe(true)
    })

    it('merges overlapping ranges at construction', () => {
      const a = new DateTimeRange(timestamp('2024-01-01'), timestamp('2024-01-05'))
      const b = new DateTimeRange(timestamp('2024-01-04'), timestamp('2024-01-10'))
      const multi = new MultiDateTimeRange([a, b])

      expect(multi.length).toBe(1)
      expect(multi.ranges[0].from.isSame(a.from)).toBe(true)
      expect(multi.ranges[0].until.isSame(b.until)).toBe(true)
    })

    it('merges adjacent ranges at construction', () => {
      const a = new DateTimeRange(timestamp('2024-01-01'), timestamp('2024-01-05'))
      const b = new DateTimeRange(timestamp('2024-01-05'), timestamp('2024-01-10'))
      const multi = new MultiDateTimeRange([a, b])

      expect(multi.length).toBe(1)
    })
  })

  describe('add', () => {
    it('adds a non-overlapping range', () => {
      const multi = new MultiDateTimeRange([
        new DateTimeRange(timestamp('2024-01-01'), timestamp('2024-01-02'))
      ])

      multi.add(new DateTimeRange(timestamp('2024-01-10'), timestamp('2024-01-11')))
      expect(multi.length).toBe(2)
    })

    it('merges with an overlapping range', () => {
      const multi = new MultiDateTimeRange([
        new DateTimeRange(timestamp('2024-01-01'), timestamp('2024-01-05'))
      ])

      multi.add(new DateTimeRange(timestamp('2024-01-03'), timestamp('2024-01-10')))
      expect(multi.length).toBe(1)
      expect(multi.ranges[0].from.isSame(timestamp('2024-01-01'))).toBe(true)
      expect(multi.ranges[0].until.isSame(timestamp('2024-01-10'))).toBe(true)
    })

    it('merges with an adjacent range', () => {
      const multi = new MultiDateTimeRange([
        new DateTimeRange(timestamp('2024-01-01'), timestamp('2024-01-05'))
      ])

      multi.add(new DateTimeRange(timestamp('2024-01-05'), timestamp('2024-01-10')))
      expect(multi.length).toBe(1)
    })

    it('merges multiple ranges together', () => {
      const one = new DateTimeRange(timestamp('2024-01-01'), timestamp('2024-01-05'))
      const two = new DateTimeRange(timestamp('2024-01-10'), timestamp('2024-01-15'))
      const three = new DateTimeRange(timestamp('2024-01-04'), timestamp('2024-01-11'))
      const multi = new MultiDateTimeRange([one, two])

      multi.add(three)
      expect(multi.length).toBe(1)
      expect(multi.ranges[0].from.isSame(one.from)).toBe(true)
      expect(multi.ranges[0].until.isSame(two.until)).toBe(true)
    })

    it('handles infinite ranges', () => {
      const infinite = new DateTimeRange(new PastInfinity(), new FutureInfinity())
      const finite = new DateTimeRange(timestamp('2024-01-05'), timestamp('2024-01-10'))
      const multi = new MultiDateTimeRange([finite])

      multi.add(infinite)
      expect(multi.length).toBe(1)
      expect(multi.ranges[0].from.isPastInfinity()).toBe(true)
      expect(multi.ranges[0].until.isFutureInfinity()).toBe(true)
    })
  })

  describe('diff', () => {
    it('diffs non-overlapping multi ranges', () => {
      const a = new DateTimeRange(timestamp('2024-01-01'), timestamp('2024-01-02'))
      const b = new DateTimeRange(timestamp('2024-01-10'), timestamp('2024-01-11'))
      const multiA = new MultiDateTimeRange([a, b])
      const multiB = new MultiDateTimeRange([
        new DateTimeRange(timestamp('2024-01-20'), timestamp('2024-01-21'))
      ])
      const diff = multiA.diff(multiB)

      expect(diff.length).toBe(2)
      expect(diff.ranges[0].isSame(a)).toBe(true)
      expect(diff.ranges[1].isSame(b)).toBe(true)
    })

    it('removes overlapping parts in diff', () => {
      const a = new DateTimeRange(timestamp('2024-01-01'), timestamp('2024-01-10'))
      const b = new DateTimeRange(timestamp('2024-01-05'), timestamp('2024-01-06'))
      const multiA = new MultiDateTimeRange([a])
      const multiB = new MultiDateTimeRange([b])
      const diff = multiA.diff(multiB)

      expect(diff.length).toBe(2)
      // [2024-01-01,2024-01-04] and [2024-01-07,2024-01-10]
      expect(diff.ranges[0].from.isSame(timestamp('2024-01-01'))).toBe(true)
      expect(diff.ranges[0].until.isSame(b.from)).toBe(true)
      expect(diff.ranges[1].from.isSame(b.until)).toBe(true)
      expect(diff.ranges[1].until.isSame(timestamp('2024-01-10'))).toBe(true)
    })

    it('removes fully contained range', () => {
      const outer = new DateTimeRange(timestamp('2024-01-01'), timestamp('2024-01-10'))
      const inner = new DateTimeRange(timestamp('2024-01-03'), timestamp('2024-01-08'))
      const multiA = new MultiDateTimeRange([outer])
      const multiB = new MultiDateTimeRange([inner])
      const diff = multiA.diff(multiB)

      expect(diff.length).toBe(2)
      expect(diff.ranges[0].from.isSame(timestamp('2024-01-01'))).toBe(true)
      expect(diff.ranges[0].until.isSame(inner.from)).toBe(true)
      expect(diff.ranges[1].from.isSame(inner.until)).toBe(true)
      expect(diff.ranges[1].until.isSame(timestamp('2024-01-10'))).toBe(true)
    })

    it('returns empty multi range when diff results in no ranges', () => {
      const a = new DateTimeRange(timestamp('2024-01-01'), timestamp('2024-01-10'))
      const b = new DateTimeRange(new PastInfinity(), new FutureInfinity())
      const multiA = new MultiDateTimeRange([a])
      const multiB = new MultiDateTimeRange([b])
      const diff = multiA.diff(multiB)

      expect(diff.length).toBe(0)
    })
  })
})
