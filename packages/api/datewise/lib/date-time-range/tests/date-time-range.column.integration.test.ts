import { after, before, describe, it } from 'node:test'
import { expect } from 'expect'
import { DateTimeRange } from '../date-time-range.js'
import { ContainsTimestamp } from '../typeorm/contains-timestamp.js'
import { StartsAfter } from '../../common/typeorm/starts-after.js'
import { EndsBefore } from '../../common/typeorm/ends-before.js'
import { FutureInfinity } from '../../timestamp/future-infinity.js'
import { timestamp } from '../../timestamp/index.js'
import { PastInfinity } from '../../timestamp/past-infinity.js'
import { DateRange } from '../../date-range/date-range.js'
import { OverlapsWith, Succeeds, Precedes, IsPrecededBy, IsSucceededBy } from '../../common/index.js'
import { IntegrationTestSetup } from './test-setup.js'
import { dataSource } from './sql/datasource.js'
import { DateTimeRangeTest } from './sql/date-time-range-test.entity.js'
import { MultiDateTimeRangeTest } from './sql/multi-date-time-range-test.entity.js'

describe('DateTimeRangeColumn', () => {
  const setup = new IntegrationTestSetup()

  before(async () => {
    await setup.setup()
  })

  after(async () => {
    await setup.teardown()
  })

  describe('serialization and deserialization', () => {
    it('stores and retrieves date time ranges with timestamp boundaries', async () => {
      const range = new DateTimeRange(timestamp().subtract(20, 'days'), timestamp().add(10, 'years'))

      await dataSource.manager.upsert(
        DateTimeRangeTest, { id: 1, range }, { conflictPaths: { id: true } })

      const test = await dataSource.manager.findOneByOrFail(DateTimeRangeTest, { id: 1 })

      expect(test.range.isSame(range))
    })

    it('stores and retrieves half open (-infinity,now] ranges', async () => {
      const range = new DateTimeRange(new PastInfinity(), new Date())

      await dataSource.manager.upsert(
        DateTimeRangeTest, { id: 2, range }, { conflictPaths: { id: true } })

      const test = await dataSource.manager.findOneByOrFail(DateTimeRangeTest, { id: 2 })

      expect(test.range.isSame(range))
    })

    it('stores and retrieves half open [now,infinity) ranges', async () => {
      const range = new DateTimeRange(new Date(), new FutureInfinity())

      await dataSource.manager.upsert(
        DateTimeRangeTest, { id: 3, range }, { conflictPaths: { id: true } })

      const test = await dataSource.manager.findOneByOrFail(DateTimeRangeTest, { id: 3 })

      expect(test.range.isSame(range))
    })

    it('stores and retrieves full infinite (-infinity,infinity) ranges', async () => {
      const range = new DateTimeRange(new PastInfinity(), new FutureInfinity())

      await dataSource.manager.upsert(
        DateTimeRangeTest, { id: 4, range }, { conflictPaths: { id: true } })

      const test = await dataSource.manager.findOneByOrFail(DateTimeRangeTest, { id: 4 })

      expect(test.range.isSame(range))
    })
  })

  describe('OverlapsWith', () => {
    it('an infinite range overlaps with itself', async () => {
      const range = new DateTimeRange(new PastInfinity(), new FutureInfinity())

      await dataSource.manager.upsert(
        DateTimeRangeTest, { id: 5, range }, { conflictPaths: { id: true } })

      const test = await dataSource.manager.findOneBy(DateTimeRangeTest, {
        id: 5,
        range: OverlapsWith(range)
      })

      expect(test).not.toBeNull()
    })

    it('a non-infinite range overlaps with itself', async () => {
      const range = new DateTimeRange(timestamp(), timestamp().add(10, 'days'))

      await dataSource.manager.upsert(
        DateTimeRangeTest, { id: 6, range }, { conflictPaths: { id: true } })

      const test = await dataSource.manager.findOneBy(DateTimeRangeTest, {
        id: 6,
        range: OverlapsWith(range)
      })

      expect(test).not.toBeNull()
    })

    it('a non-infinite range overlaps with an infinite range', async () => {
      const range = new DateTimeRange(timestamp(), timestamp().add(10, 'days'))

      await dataSource.manager.upsert(
        DateTimeRangeTest, { id: 7, range }, { conflictPaths: { id: true } })

      const test = await dataSource.manager.findOneBy(DateTimeRangeTest, {
        id: 7,
        range: OverlapsWith(new DateTimeRange(new PastInfinity(), new FutureInfinity()))
      })

      expect(test).not.toBeNull()
    })

    it('a non-infinite range overlaps with another non-infinite range range', async () => {
      const range = new DateTimeRange(timestamp(), timestamp().add(10, 'days'))

      await dataSource.manager.upsert(
        DateTimeRangeTest, { id: 8, range }, { conflictPaths: { id: true } })

      const overlappingRange = new DateTimeRange(
        timestamp().subtract(1, 'year'),
        timestamp().add(2, 'years')
      )

      const test = await dataSource.manager.findOneBy(DateTimeRangeTest, {
        id: 8,
        range: OverlapsWith(overlappingRange)
      })

      expect(test).not.toBeNull()
    })

    it('adjacent ranges do not overlap', async () => {
      const now = timestamp()
      const range = new DateTimeRange(new PastInfinity(), now)

      await dataSource.manager.upsert(
        DateTimeRangeTest, { id: 9, range }, { conflictPaths: { id: true } })

      const overlappingRange = new DateTimeRange(now.add(1, 'ms'), new FutureInfinity())

      const test = await dataSource.manager.findOneBy(DateTimeRangeTest, {
        id: 9,
        range: OverlapsWith(overlappingRange)
      })

      expect(test).toBeNull()
    })

    it('distinct ranges do not overlap', async () => {
      const now = timestamp()
      const range = new DateTimeRange(new PastInfinity(), now)

      await dataSource.manager.upsert(
        DateTimeRangeTest, { id: 10, range }, { conflictPaths: { id: true } })

      const overlappingRange = new DateTimeRange(now.add(100, 'days'), new FutureInfinity())

      const test = await dataSource.manager.findOneBy(DateTimeRangeTest, {
        id: 10,
        range: OverlapsWith(overlappingRange)
      })

      expect(test).toBeNull()
    })
  })

  describe('ContainsDate', () => {
    it('infinite ranges contain any date', async () => {
      const range = new DateTimeRange(new PastInfinity(), new FutureInfinity())

      await dataSource.manager.upsert(
        DateTimeRangeTest, { id: 11, range }, { conflictPaths: { id: true } })

      const test = await dataSource.manager.findOneBy(DateTimeRangeTest, {
        id: 11,
        range: ContainsTimestamp(new Date())
      })

      expect(test).not.toBeNull()
    })

    it('[now - 1 year, now +1 year] contains now', async () => {
      const range = new DateTimeRange(timestamp().subtract(1, 'year'), timestamp().add(1, 'year'))

      await dataSource.manager.upsert(
        DateTimeRangeTest, { id: 12, range }, { conflictPaths: { id: true } })

      const test = await dataSource.manager.findOneBy(DateTimeRangeTest, {
        id: 12,
        range: ContainsTimestamp(new Date())
      })

      expect(test).not.toBeNull()
    })

    it('(-infinity, now] does not contain now + 1ms', async () => {
      const now = timestamp()
      const range = new DateTimeRange(new PastInfinity(), now)

      await dataSource.manager.upsert(
        DateTimeRangeTest, { id: 13, range }, { conflictPaths: { id: true } })

      const test = await dataSource.manager.findOneBy(DateTimeRangeTest, {
        id: 13,
        range: ContainsTimestamp(now.add(1, 'ms').toDate())
      })

      expect(test).toBeNull()
    })
  })

  describe('Succeeds', () => {
    it('finds a range that succeeds the given period', async () => {
      const now = timestamp()
      const periodA = new DateTimeRange(now.subtract(10, 'days'), now)
      const periodB = new DateTimeRange(now, now.add(5, 'days'))

      await dataSource.manager.upsert(DateTimeRangeTest, [
        { id: 14, range: periodA },
        { id: 15, range: periodB }
      ], { conflictPaths: { id: true } })

      const test = await dataSource.manager.findOneBy(DateTimeRangeTest, {
        id: 15,
        range: Succeeds(periodA)
      })

      expect(test).not.toBeNull()
    })

    it('does not find a range that does not succeed it', async () => {
      const now = timestamp()
      const periodA = new DateTimeRange(now.subtract(10, 'days'), now)
      const periodB = new DateTimeRange(now.add(1, 'days'), now.add(5, 'days'))

      await dataSource.manager.upsert(DateTimeRangeTest, [
        { id: 16, range: periodA },
        { id: 17, range: periodB }
      ], { conflictPaths: { id: true } })

      const test = await dataSource.manager.findOneBy(DateTimeRangeTest, {
        id: 17,
        range: Succeeds(periodA)
      })

      expect(test).toBeNull()
    })

    it('a range does not succeed itself', async () => {
      const now = timestamp()
      const periodA = new DateTimeRange(now.subtract(10, 'days'), now)

      await dataSource.manager.upsert(DateTimeRangeTest, [
        { id: 18, range: periodA }
      ], { conflictPaths: { id: true } })

      const test = await dataSource.manager.findOneBy(DateTimeRangeTest, {
        id: 18,
        range: Succeeds(periodA)
      })

      expect(test).toBeNull()
    })
  })

  describe('Precedes', () => {
    it('finds a range that precedes the given period', async () => {
      const now = timestamp()
      const periodA = new DateTimeRange(now.subtract(10, 'days'), now)
      const periodB = new DateTimeRange(now, now.add(5, 'days'))

      await dataSource.manager.upsert(DateTimeRangeTest, [
        { id: 19, range: periodA },
        { id: 20, range: periodB }
      ], { conflictPaths: { id: true } })

      // periodA precedes periodB
      const test = await dataSource.manager.findOneBy(DateTimeRangeTest, {
        id: 19,
        range: Precedes(periodB)
      })

      expect(test).not.toBeNull()
    })

    it('does not find a range that does not precede', async () => {
      const now = timestamp()

      const periodA = new DateTimeRange(now.subtract(15, 'days'), now.subtract(2, 'days'))
      const periodB = new DateTimeRange(now, now.add(5, 'days'))

      await dataSource.manager.upsert(DateTimeRangeTest, [
        { id: 21, range: periodA },
        { id: 22, range: periodB }
      ], { conflictPaths: { id: true } })

      const test = await dataSource.manager.findOneBy(DateTimeRangeTest, {
        id: 21,
        range: Precedes(periodB)
      })

      expect(test).toBeNull()
    })

    it('a range does not precede itself', async () => {
      const now = timestamp()
      const periodA = new DateTimeRange(now.subtract(10, 'days'), now)

      await dataSource.manager.upsert(DateTimeRangeTest, [
        { id: 23, range: periodA }
      ], { conflictPaths: { id: true } })

      const test = await dataSource.manager.findOneBy(DateTimeRangeTest, {
        id: 23,
        range: Precedes(periodA)
      })

      expect(test).toBeNull()
    })
  })

  describe('IsPrecededBy', () => {
    it('finds a range that is immediately preceded by the given period', async () => {
      const now = timestamp()

      const periodA = new DateTimeRange(now.subtract(10, 'days'), now)
      const periodB = new DateTimeRange(now, now.add(5, 'days'))

      await dataSource.manager.upsert(DateTimeRangeTest, [
        { id: 24, range: periodA },
        { id: 25, range: periodB }
      ], { conflictPaths: { id: true } })

      const test = await dataSource.manager.findOneBy(DateTimeRangeTest, {
        id: 25,
        range: IsPrecededBy(periodA)
      })

      expect(test).not.toBeNull()
    })

    it('does not find a range that is not immediately preceded', async () => {
      const now = timestamp()
      const periodA = new DateTimeRange(now.subtract(10, 'days'), now)
      const periodB = new DateTimeRange(now.add(2, 'days'), now.add(5, 'days'))

      await dataSource.manager.upsert(DateTimeRangeTest, [
        { id: 26, range: periodA },
        { id: 27, range: periodB }
      ], { conflictPaths: { id: true } })

      const test = await dataSource.manager.findOneBy(DateTimeRangeTest, {
        id: 27,
        range: IsPrecededBy(periodA)
      })

      expect(test).toBeNull()
    })

    it('a range is not immediately preceded by itself', async () => {
      const now = timestamp()
      const periodA = new DateTimeRange(now.subtract(10, 'days'), now)

      await dataSource.manager.upsert(DateTimeRangeTest, [
        { id: 28, range: periodA }
      ], { conflictPaths: { id: true } })

      const test = await dataSource.manager.findOneBy(DateTimeRangeTest, {
        id: 28,
        range: IsPrecededBy(periodA)
      })

      expect(test).toBeNull()
    })
  })

  describe('IsSucceededBy', () => {
    it('finds a range that is immediately succeeded by the given period', async () => {
      const now = timestamp()
      const periodA = new DateTimeRange(now.subtract(10, 'days'), now)
      const periodB = new DateTimeRange(now, now.add(5, 'days'))

      await dataSource.manager.upsert(DateTimeRangeTest, [
        { id: 29, range: periodA },
        { id: 30, range: periodB }
      ], { conflictPaths: { id: true } })

      const test = await dataSource.manager.findOneBy(DateTimeRangeTest, {
        id: 29,
        range: IsSucceededBy(periodB)
      })

      expect(test).not.toBeNull()
    })

    it('does not find a range that is not immediately succeeded', async () => {
      const now = timestamp()
      const periodA = new DateTimeRange(now.subtract(10, 'days'), now)
      const periodC = new DateTimeRange(now.add(2, 'days'), now.add(5, 'days'))

      await dataSource.manager.upsert(DateTimeRangeTest, [
        { id: 31, range: periodA },
        { id: 32, range: periodC }
      ], { conflictPaths: { id: true } })

      const test = await dataSource.manager.findOneBy(DateTimeRangeTest, {
        id: 31,
        range: IsSucceededBy(periodC)
      })

      expect(test).toBeNull()
    })

    it('a range is not immediately succeeded by itself', async () => {
      const now = timestamp()
      const periodA = new DateTimeRange(now.subtract(10, 'days'), now)

      await dataSource.manager.upsert(DateTimeRangeTest, [
        { id: 33, range: periodA }
      ], { conflictPaths: { id: true } })

      const test = await dataSource.manager.findOneBy(DateTimeRangeTest, {
        id: 33,
        range: IsSucceededBy(periodA)
      })

      expect(test).toBeNull()
    })
  })

  describe('StartsAfter', () => {
    let period: DateTimeRangeTest

    before(async () => {
      period = { id: 34, range: new DateTimeRange(timestamp(), timestamp().add(10, 'minutes')) }
      await dataSource.manager.upsert(DateTimeRangeTest, period, { conflictPaths: { id: true } })
    })

    it('finds a range that immediately starts after a date', async () => {
      const date = period.range.from.clone()

      const test = await dataSource.manager.findOneBy(DateTimeRangeTest, {
        id: 34,
        range: StartsAfter(new DateRange(date, date.add(1, 'ms')))
      })

      expect(test).not.toBeNull()
    })

    it('does not finds a range that starts after on the date', async () => {
      const date = period.range.from.toDate()

      const test = await dataSource.manager.findOneBy(DateTimeRangeTest, {
        id: 34,
        range: StartsAfter(new DateTimeRange(date, date, '[]'))
      })

      expect(test).toBeNull()
    })

    it('does not finds a range that contains the date', async () => {
      const date = period.range.from.add(1, 'second').toDate()

      const test = await dataSource.manager.findOneBy(DateTimeRangeTest, {
        id: 34,
        range: StartsAfter(new DateTimeRange(date, date, '[]'))
      })

      expect(test).toBeNull()
    })

    it('does not finds a range that ends on the date', async () => {
      const date = period.range.until.toDate()

      const test = await dataSource.manager.findOneBy(DateTimeRangeTest, {
        id: 34,
        range: StartsAfter(new DateTimeRange(date, date, '[]'))
      })

      expect(test).toBeNull()
    })

    it('does not finds a range that ended before the date', async () => {
      const date = period.range.until.add(1, 'ms').toDate()

      const test = await dataSource.manager.findOneBy(DateTimeRangeTest, {
        id: 34,
        range: StartsAfter(new DateTimeRange(date, date, '[]'))
      })

      expect(test).toBeNull()
    })
  })

  describe('EndsBefore', () => {
    let period: DateTimeRangeTest

    before(async () => {
      period = { id: 35, range: new DateTimeRange(timestamp(), timestamp().add(10, 'minutes')) }
      await dataSource.manager.upsert(DateTimeRangeTest, period, { conflictPaths: { id: true } })
    })

    it('does not finds a range that immediately starts after a date', async () => {
      const date = period.range.from.subtract(1, 'ms').toDate()

      const test = await dataSource.manager.findOneBy(DateTimeRangeTest, {
        id: 35,
        range: EndsBefore(new DateTimeRange(date, date, '[]'))
      })

      expect(test).toBeNull()
    })

    it('does not finds a range that starts after on the date', async () => {
      const date = period.range.from.toDate()

      const test = await dataSource.manager.findOneBy(DateTimeRangeTest, {
        id: 35,
        range: EndsBefore(new DateTimeRange(date, date, '[]'))
      })

      expect(test).toBeNull()
    })

    it('does not finds a range that contains the date', async () => {
      const date = period.range.from.add(1, 'second').toDate()

      const test = await dataSource.manager.findOneBy(DateTimeRangeTest, {
        id: 35,
        range: EndsBefore(new DateTimeRange(date, date, '[]'))
      })

      expect(test).toBeNull()
    })

    it('does not finds a range that ends on the date', async () => {
      const date = period.range.until.subtract(1, 'ms').toDate()

      const test = await dataSource.manager.findOneBy(DateTimeRangeTest, {
        id: 35,
        range: EndsBefore(new DateTimeRange(date, date, '[]'))
      })

      expect(test).toBeNull()
    })

    it('finds a range that ended before the date', async () => {
      const date = period.range.until.toDate()

      const test = await dataSource.manager.findOneBy(DateTimeRangeTest, {
        id: 35,
        range: EndsBefore(new DateTimeRange(date, date, '[]'))
      })

      expect(test).not.toBeNull()
    })
  })

  describe('multirange serialization and deserialization', () => {
    it('stores and retrieves multi date time ranges with timestamp boundaries', async () => {
      const ranges = [
        new DateTimeRange(timestamp().subtract(20, 'days'), timestamp().add(10, 'years')),
        new DateTimeRange(timestamp().subtract(20, 'years'), timestamp().subtract(10, 'years'))
      ]

      await dataSource.manager.upsert(MultiDateTimeRangeTest,
        { id: 1, ranges },
        { conflictPaths: { id: true } }
      )

      const test = await dataSource.manager.findOneByOrFail(MultiDateTimeRangeTest, { id: 1 })

      expect(test.ranges[0].isSame(ranges[0]) || test.ranges[0].isSame(ranges[1])).toBe(true)
      expect(test.ranges[1].isSame(ranges[0]) || test.ranges[1].isSame(ranges[1])).toBe(true)
    })

    it('stores an undefined multi date time range', async () => {
      const ranges = undefined

      await dataSource.manager.upsert(MultiDateTimeRangeTest,
        { id: 2, ranges },
        { conflictPaths: { id: true } }
      )

      const test = await dataSource.manager.findOneByOrFail(MultiDateTimeRangeTest, { id: 2 })

      expect(test.ranges).toStrictEqual([])
    })
  })
})
