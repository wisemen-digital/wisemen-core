import { DateRange, DateRangeDto, DateTimeRange, DateTimeRangeDto, plainDate, timestamp } from '@wisemen/datewise'
import { after, before, describe, it } from 'node:test'
import { expect } from 'expect'
import { DataSource, FindOptionsWhere, In } from 'typeorm'
import { DateFilterCondition } from '#src/date-filter-condition.js'
import { DateRangeFilter } from '#src/date-range-filter.js'
import { DateTimeRangeFilter } from '#src/date-time-range-filter.js'
import { MatchesDateRange } from '#src/typeorm/matches-date-range.js'
import { MatchesDateTimeRange } from '#src/typeorm/matches-date-time-range.js'
import { MatchesNumber } from '#src/typeorm/matches-number.js'
import { MatchesPlainDate } from '#src/typeorm/matches-plain-date.js'
import { MatchesTimestamp } from '#src/typeorm/matches-timestamp.js'
import { NumberFilterCondition } from '#src/number-filter-condition.js'
import { NumberFilter } from '#src/number-filter.js'
import { PlainDateFilter } from '#src/plain-date-filter.js'
import { RangeFilterCondition } from '#src/range-filter-condition.js'
import { TimestampFilter } from '#src/timestamp-filter.js'
import { dataSource } from './sql/datasource.js'
import { FilterConditionsTest } from './sql/filter-conditions-test.entity.js'
import { IntegrationTestSetup } from './test-setup.js'

describe('conditional filters (find operator)', () => {
  const integrationTest = new IntegrationTestSetup()

  before(async () => {
    await integrationTest.setup()

    await seed(dataSource, {
      id: 1,
      amount: 10,
      timestamp: timestamp('2025-01-05T12:00:00.000Z'),
      date: plainDate('2025-01-05'),
      dateTimeRange: new DateTimeRange('2025-01-01T00:00:00.000Z', '2025-01-10T00:00:00.000Z'),
      dateRange: new DateRange('2025-01-01', '2025-01-10')
    })
    await seed(dataSource, {
      id: 2,
      amount: 20,
      timestamp: timestamp('2025-01-15T12:00:00.000Z'),
      date: plainDate('2025-01-15'),
      dateTimeRange: new DateTimeRange('2025-01-10T00:00:00.000Z', '2025-01-20T00:00:00.000Z'),
      dateRange: new DateRange('2025-01-10', '2025-01-20')
    })
    await seed(dataSource, {
      id: 3,
      amount: 30,
      timestamp: timestamp('2025-01-25T12:00:00.000Z'),
      date: plainDate('2025-01-25'),
      dateTimeRange: new DateTimeRange('2025-01-15T00:00:00.000Z', '2025-01-25T00:00:00.000Z'),
      dateRange: new DateRange('2025-01-15', '2025-01-25')
    })
  })

  after(async () => {
    await integrationTest.teardown()
  })

  it('filters numbers', async () => {
    expect(await findIds({ amount: MatchesNumber(new NumberFilter(NumberFilterCondition.EQUAL, 20)) })).toEqual([2])
    expect(await findIds({ amount: MatchesNumber(new NumberFilter(NumberFilterCondition.NOT_EQUAL, 20)) })).toEqual([1, 3])
    expect(await findIds({ amount: MatchesNumber(new NumberFilter(NumberFilterCondition.GREATER_THAN, 20)) })).toEqual([3])
    expect(await findIds({ amount: MatchesNumber(new NumberFilter(NumberFilterCondition.GREATER_THAN_OR_EQUAL, 20)) })).toEqual([2, 3])
    expect(await findIds({ amount: MatchesNumber(new NumberFilter(NumberFilterCondition.LESS_THAN, 20)) })).toEqual([1])
    expect(await findIds({ amount: MatchesNumber(new NumberFilter(NumberFilterCondition.LESS_THAN_OR_EQUAL, 20)) })).toEqual([1, 2])
  })

  it('filters timestamps', async () => {
    expect(await findIds({ timestamp: MatchesTimestamp(new TimestampFilter(DateFilterCondition.EQUAL, '2025-01-15T12:00:00.000Z')) })).toEqual([2])
    expect(await findIds({ timestamp: MatchesTimestamp(new TimestampFilter(DateFilterCondition.NOT_EQUAL, '2025-01-15T12:00:00.000Z')) })).toEqual([1, 3])
    expect(await findIds({ timestamp: MatchesTimestamp(new TimestampFilter(DateFilterCondition.BEFORE, '2025-01-15T12:00:00.000Z')) })).toEqual([1])
    expect(await findIds({ timestamp: MatchesTimestamp(new TimestampFilter(DateFilterCondition.AFTER, '2025-01-15T12:00:00.000Z')) })).toEqual([3])
  })

  it('filters plain dates', async () => {
    expect(await findIds({ date: MatchesPlainDate(new PlainDateFilter(DateFilterCondition.EQUAL, '2025-01-15')) })).toEqual([2])
    expect(await findIds({ date: MatchesPlainDate(new PlainDateFilter(DateFilterCondition.NOT_EQUAL, '2025-01-15')) })).toEqual([1, 3])
    expect(await findIds({ date: MatchesPlainDate(new PlainDateFilter(DateFilterCondition.BEFORE, '2025-01-15')) })).toEqual([1])
    expect(await findIds({ date: MatchesPlainDate(new PlainDateFilter(DateFilterCondition.AFTER, '2025-01-15')) })).toEqual([3])
  })

  it('filters date time ranges', async () => {
    const overlapFilter = new DateTimeRangeDto()
    overlapFilter.from = '2025-01-18T00:00:00.000Z'
    overlapFilter.until = '2025-01-22T00:00:00.000Z'

    const containsFilter = new DateTimeRangeDto()
    containsFilter.from = '2025-01-16T00:00:00.000Z'
    containsFilter.until = '2025-01-18T00:00:00.000Z'

    expect(await findIds({ dateTimeRange: MatchesDateTimeRange(new DateTimeRangeFilter(RangeFilterCondition.OVERLAPS, overlapFilter)) })).toEqual([2, 3])
    expect(await findIds({ dateTimeRange: MatchesDateTimeRange(new DateTimeRangeFilter(RangeFilterCondition.DOES_NOT_OVERLAP, overlapFilter)) })).toEqual([1])
    expect(await findIds({ dateTimeRange: MatchesDateTimeRange(new DateTimeRangeFilter(RangeFilterCondition.CONTAINS, containsFilter)) })).toEqual([2, 3])
    expect(await findIds({ dateTimeRange: MatchesDateTimeRange(new DateTimeRangeFilter(RangeFilterCondition.DOES_NOT_CONTAIN, containsFilter)) })).toEqual([1])
  })

  it('filters date ranges', async () => {
    const overlapFilter = new DateRangeDto()
    overlapFilter.startDate = '2025-01-18'
    overlapFilter.endDate = '2025-01-22'

    const containsFilter = new DateRangeDto()
    containsFilter.startDate = '2025-01-16'
    containsFilter.endDate = '2025-01-18'

    expect(await findIds({ dateRange: MatchesDateRange(new DateRangeFilter(RangeFilterCondition.OVERLAPS, overlapFilter)) })).toEqual([2, 3])
    expect(await findIds({ dateRange: MatchesDateRange(new DateRangeFilter(RangeFilterCondition.DOES_NOT_OVERLAP, overlapFilter)) })).toEqual([1])
    expect(await findIds({ dateRange: MatchesDateRange(new DateRangeFilter(RangeFilterCondition.CONTAINS, containsFilter)) })).toEqual([2, 3])
    expect(await findIds({ dateRange: MatchesDateRange(new DateRangeFilter(RangeFilterCondition.DOES_NOT_CONTAIN, containsFilter)) })).toEqual([1])
  })

  async function findIds (where: FindOptionsWhere<FilterConditionsTest>): Promise<number[]> {
    const results = await dataSource.manager.find(FilterConditionsTest, {
      where: {
        id: In([1, 2, 3]),
        ...where
      },
      order: {
        id: 'ASC'
      }
    })

    return results.map(result => result.id)
  }

  async function seed (dataSource: DataSource, row: FilterConditionsTest): Promise<void> {
    await dataSource.manager.upsert(FilterConditionsTest, row, { conflictPaths: { id: true } })
  }
})
