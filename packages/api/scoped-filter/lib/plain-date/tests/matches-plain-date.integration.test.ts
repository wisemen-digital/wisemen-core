import { after, before, describe, it } from 'node:test'
import { DateRangeDto, plainDate } from '@wisemen/datewise'
import { expect } from 'expect'
import { DataSource, In } from 'typeorm'
import { MatchPlainDate } from '#src/plain-date/match-plain-date.js'
import { PlainDateFilter } from '#src/plain-date/plain-date-filter.js'
import { PlainDateOperation } from '#src/plain-date/plain-date-operation.js'
import { dataSource } from '../../tests/sql/datasource.js'
import { ScopedFilterTest } from '../../tests/sql/scoped-filter-test.entity.js'
import { IntegrationTestSetup } from '../../tests/test-setup.js'

const UUID_1 = '00000000-0000-0000-0000-000000000001'
const UUID_2 = '00000000-0000-0000-0000-000000000002'
const UUID_3 = '00000000-0000-0000-0000-000000000003'

describe('MatchPlainDate', () => {
  const integrationTest = new IntegrationTestSetup()

  before(async () => {
    await integrationTest.setup()

    await seed(dataSource, { id: 1, uuid: UUID_1, amount: 10, date: plainDate('2024-01-01') })
    await seed(dataSource, { id: 2, uuid: UUID_2, amount: 20, date: plainDate('2024-01-15') })
    await seed(dataSource, { id: 3, uuid: UUID_3, amount: 30, date: plainDate('2024-02-01') })
  })

  after(async () => {
    await integrationTest.teardown()
  })

  it('matches is', async () => {
    const results = await findByDate({ operation: PlainDateOperation.IS, value: '2024-01-15' })

    expectIds(results, [2])
  })

  it('matches is not', async () => {
    const results = await findByDate({ operation: PlainDateOperation.IS_NOT, value: '2024-01-15' })

    expectIds(results, [1, 3])
  })

  it('matches before', async () => {
    const results = await findByDate({ operation: PlainDateOperation.BEFORE, value: '2024-01-15' })

    expectIds(results, [1])
  })

  it('matches same or before', async () => {
    const results = await findByDate({ operation: PlainDateOperation.SAME_OR_BEFORE, value: '2024-01-15' })

    expectIds(results, [1, 2])
  })

  it('matches after', async () => {
    const results = await findByDate({ operation: PlainDateOperation.AFTER, value: '2024-01-15' })

    expectIds(results, [3])
  })

  it('matches same or after', async () => {
    const results = await findByDate({ operation: PlainDateOperation.SAME_OR_AFTER, value: '2024-01-15' })

    expectIds(results, [2, 3])
  })

  it('matches contained in', async () => {
    const results = await findByDate({
      operation: PlainDateOperation.CONTAINED_IN,
      value: dateRange('2024-01-10', '2024-01-31')
    })

    expectIds(results, [2])
  })

  it('matches not contained in', async () => {
    const results = await findByDate({
      operation: PlainDateOperation.NOT_CONTAINED_IN,
      value: dateRange('2024-01-10', '2024-01-31')
    })

    expectIds(results, [1, 3])
  })

  it('returns undefined when filter is undefined', () => {
    const result = MatchPlainDate(undefined)

    expect(result).toBeUndefined()
  })

  it('returns undefined when filter is null', () => {
    const result = MatchPlainDate(null)

    expect(result).toBeUndefined()
  })

  async function findByDate (filter: PlainDateFilter): Promise<ScopedFilterTest[]> {
    return await dataSource.manager.find(ScopedFilterTest, {
      where: {
        id: In([1, 2, 3]),
        date: MatchPlainDate(filter)
      }
    })
  }

  function dateRange (startDate: string, endDate: string): DateRangeDto {
    const value = new DateRangeDto()
    value.startDate = startDate
    value.endDate = endDate
    return value
  }

  function expectIds (results: ScopedFilterTest[], expectedIds: number[]): void {
    expect(results.map(result => result.id).sort((a, b) => a - b)).toEqual(expectedIds)
  }

  async function seed (dataSource: DataSource, row: ScopedFilterTest): Promise<void> {
    await dataSource.manager.upsert(ScopedFilterTest, row, { conflictPaths: { id: true } })
  }
})
