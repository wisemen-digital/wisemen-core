import { DateRange, DateRangeDto, DateTimeRange, DateTimeRangeDto, plainDate, timestamp } from '@wisemen/datewise'
import { after, before, describe, it } from 'node:test'
import { expect } from 'expect'
import { DataSource, SelectQueryBuilder } from 'typeorm'
import { DateFilterCondition } from '#src/date-filter-condition.js'
import { DateRangeFilter } from '#src/date-range-filter.js'
import { DateTimeRangeFilter } from '#src/date-time-range-filter.js'
import { matchesDateRange } from '#src/typeorm/matches-date-range.query-builder.js'
import { matchesDateTimeRange } from '#src/typeorm/matches-date-time-range.query-builder.js'
import { matchesNumber } from '#src/typeorm/matches-number.query-builder.js'
import { matchesPlainDate } from '#src/typeorm/matches-plain-date.query-builder.js'
import { matchesTimestamp } from '#src/typeorm/matches-timestamp.query-builder.js'
import { NumberFilterCondition } from '#src/number-filter-condition.js'
import { NumberFilter } from '#src/number-filter.js'
import { PlainDateFilter } from '#src/plain-date-filter.js'
import { RangeFilterCondition } from '#src/range-filter-condition.js'
import { TimestampFilter } from '#src/timestamp-filter.js'
import { dataSource } from './sql/datasource.js'
import { FilterConditionsTest } from './sql/filter-conditions-test.entity.js'
import { IntegrationTestSetup } from './test-setup.js'

describe('conditional filters (query builder)', () => {
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

  it('filters with query builders across all filter types', async () => {
    const dateTimeOverlap = new DateTimeRangeDto()
    dateTimeOverlap.from = '2025-01-18T00:00:00.000Z'
    dateTimeOverlap.until = '2025-01-22T00:00:00.000Z'

    const dateOverlap = new DateRangeDto()
    dateOverlap.startDate = '2025-01-18'
    dateOverlap.endDate = '2025-01-22'

    expect(await findIds(matchesNumber('e.amount', new NumberFilter(NumberFilterCondition.GREATER_THAN_OR_EQUAL, 20)))).toEqual([2, 3])
    expect(await findIds(matchesTimestamp('e.timestamp', new TimestampFilter(DateFilterCondition.BEFORE, '2025-01-15T12:00:00.000Z')))).toEqual([1])
    expect(await findIds(matchesPlainDate('e.date', new PlainDateFilter(DateFilterCondition.AFTER, '2025-01-15')))).toEqual([3])
    expect(await findIds(matchesDateTimeRange('e.dateTimeRange', new DateTimeRangeFilter(RangeFilterCondition.OVERLAPS, dateTimeOverlap)))).toEqual([2, 3])
    expect(await findIds(matchesDateRange('e.dateRange', new DateRangeFilter(RangeFilterCondition.DOES_NOT_OVERLAP, dateOverlap)))).toEqual([1])
  })

  async function findIds (
    condition: (qb: SelectQueryBuilder<FilterConditionsTest>) => string
  ): Promise<number[]> {
    const results = await dataSource.manager
      .createQueryBuilder(FilterConditionsTest, 'e')
      .where('e.id IN (:...ids)', { ids: [1, 2, 3] })
      .andWhere(condition)
      .orderBy('e.id', 'ASC')
      .getMany()

    return results.map(result => result.id)
  }

  async function seed (dataSource: DataSource, row: FilterConditionsTest): Promise<void> {
    await dataSource.manager.upsert(FilterConditionsTest, row, { conflictPaths: { id: true } })
  }
})
