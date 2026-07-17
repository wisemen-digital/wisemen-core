import { after, before, describe, it } from 'node:test'
import { DateTimeRangeDto, plainDate, timestamp } from '@wisemen/datewise'
import { expect } from 'expect'
import { DataSource, In } from 'typeorm'
import { MatchTimestamp } from '#src/timestamp/match-timestamp.js'
import { TimestampFilter } from '#src/timestamp/timestamp-filter.js'
import { TimestampOperation } from '#src/timestamp/timestamp-operation.js'
import { dataSource } from '../../tests/sql/datasource.js'
import { ScopedFilterTest } from '../../tests/sql/scoped-filter-test.entity.js'
import { IntegrationTestSetup } from '../../tests/test-setup.js'

const UUID_1 = '00000000-0000-0000-0000-000000000001'
const UUID_2 = '00000000-0000-0000-0000-000000000002'
const UUID_3 = '00000000-0000-0000-0000-000000000003'

describe('MatchTimestamp', () => {
  const integrationTest = new IntegrationTestSetup()

  before(async () => {
    await integrationTest.setup()

    await seed(dataSource, { id: 1, uuid: UUID_1, amount: 10, date: plainDate('2024-01-01'), timestamp: timestamp('2024-01-01T00:00:00.000Z') })
    await seed(dataSource, { id: 2, uuid: UUID_2, amount: 20, date: plainDate('2024-01-15'), timestamp: timestamp('2024-01-15T12:30:00.000Z') })
    await seed(dataSource, { id: 3, uuid: UUID_3, amount: 30, date: plainDate('2024-02-01'), timestamp: timestamp('2024-02-01T00:00:00.000Z') })
  })

  after(async () => {
    await integrationTest.teardown()
  })

  it('matches is', async () => {
    const results = await findByTimestamp({ operation: TimestampOperation.IS, value: '2024-01-15T12:30:00.000Z' })

    expectIds(results, [2])
  })

  it('matches is not', async () => {
    const results = await findByTimestamp({ operation: TimestampOperation.IS_NOT, value: '2024-01-15T12:30:00.000Z' })

    expectIds(results, [1, 3])
  })

  it('matches before', async () => {
    const results = await findByTimestamp({ operation: TimestampOperation.BEFORE, value: '2024-01-15T12:30:00.000Z' })

    expectIds(results, [1])
  })

  it('matches same or before', async () => {
    const results = await findByTimestamp({ operation: TimestampOperation.SAME_OR_BEFORE, value: '2024-01-15T12:30:00.000Z' })

    expectIds(results, [1, 2])
  })

  it('matches after', async () => {
    const results = await findByTimestamp({ operation: TimestampOperation.AFTER, value: '2024-01-15T12:30:00.000Z' })

    expectIds(results, [3])
  })

  it('matches same or after', async () => {
    const results = await findByTimestamp({ operation: TimestampOperation.SAME_OR_AFTER, value: '2024-01-15T12:30:00.000Z' })

    expectIds(results, [2, 3])
  })

  it('matches contained in', async () => {
    const results = await findByTimestamp({
      operation: TimestampOperation.CONTAINED_IN,
      value: dateTimeRange('2024-01-10T00:00:00.000Z', '2024-01-31T00:00:00.000Z')
    })

    expectIds(results, [2])
  })

  it('matches not contained in', async () => {
    const results = await findByTimestamp({
      operation: TimestampOperation.NOT_CONTAINED_IN,
      value: dateTimeRange('2024-01-10T00:00:00.000Z', '2024-01-31T00:00:00.000Z')
    })

    expectIds(results, [1, 3])
  })

  it('returns undefined when filter is undefined', () => {
    const result = MatchTimestamp(undefined)

    expect(result).toBeUndefined()
  })

  it('returns undefined when filter is null', () => {
    const result = MatchTimestamp(null)

    expect(result).toBeUndefined()
  })

  async function findByTimestamp (filter: TimestampFilter): Promise<ScopedFilterTest[]> {
    return await dataSource.manager.find(ScopedFilterTest, {
      where: {
        id: In([1, 2, 3]),
        timestamp: MatchTimestamp(filter)
      }
    })
  }

  function dateTimeRange (from: string, until: string): DateTimeRangeDto {
    const value = new DateTimeRangeDto()
    value.from = from
    value.until = until
    return value
  }

  function expectIds (results: ScopedFilterTest[], expectedIds: number[]): void {
    expect(results.map(result => result.id).sort((a, b) => a - b)).toEqual(expectedIds)
  }

  async function seed (dataSource: DataSource, row: ScopedFilterTest): Promise<void> {
    await dataSource.manager.upsert(ScopedFilterTest, row, { conflictPaths: { id: true } })
  }
})
