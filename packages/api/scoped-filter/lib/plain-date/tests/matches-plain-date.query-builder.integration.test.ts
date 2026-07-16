import { after, before, describe, it } from 'node:test'
import { DateRangeDto, plainDate } from '@wisemen/datewise'
import { expect } from 'expect'
import { Brackets, DataSource } from 'typeorm'
import { matchPlainDate } from '#src/plain-date/match-plain-date.qb.js'
import { PlainDateFilter } from '#src/plain-date/plain-date-filter.js'
import { PlainDateOperation } from '#src/plain-date/plain-date-operation.js'
import { dataSource } from '../../tests/sql/datasource.js'
import { ScopedFilterTest } from '../../tests/sql/scoped-filter-test.entity.js'
import { IntegrationTestSetup } from '../../tests/test-setup.js'

const UUID_1 = '00000000-0000-0000-0000-000000000001'
const UUID_2 = '00000000-0000-0000-0000-000000000002'
const UUID_3 = '00000000-0000-0000-0000-000000000003'
const DELETE_TEST_UUID_1 = '00000000-0000-0000-0000-000000000101'
const DELETE_TEST_UUID_2 = '00000000-0000-0000-0000-000000000102'

describe('matchPlainDate (query builder)', () => {
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
    const result = matchPlainDate('e.date', undefined)

    expect(result).toBeUndefined()
  })

  describe('query builder overrides', () => {
    it('supports whereMatchPlainDate', async () => {
      const results = await dataSource.manager
        .createQueryBuilder(ScopedFilterTest, 'e')
        .whereMatchPlainDate('e.date', { operation: PlainDateOperation.IS, value: '2024-01-15' })
        .getMany()

      expectIds(results, [2])
    })

    it('supports andWhereMatchPlainDate', async () => {
      const results = await dataSource.manager
        .createQueryBuilder(ScopedFilterTest, 'e')
        .where('e.id >= :id', { id: 2 })
        .andWhereMatchPlainDate('e.date', { operation: PlainDateOperation.SAME_OR_AFTER, value: '2024-02-01' })
        .getMany()

      expectIds(results, [3])
    })

    it('supports orWhereMatchPlainDate', async () => {
      const results = await dataSource.manager
        .createQueryBuilder(ScopedFilterTest, 'e')
        .where('e.id = :id', { id: 1 })
        .orWhereMatchPlainDate('e.date', { operation: PlainDateOperation.IS, value: '2024-02-01' })
        .getMany()

      expectIds(results, [1, 3])
    })

    it('does not add a clause when the override filter is undefined', async () => {
      const results = await dataSource.manager
        .createQueryBuilder(ScopedFilterTest, 'e')
        .where('e.id = :id', { id: 2 })
        .andWhereMatchPlainDate('e.date', undefined)
        .getMany()

      expectIds(results, [2])
    })

    it('supports whereMatchPlainDate inside TypeORM brackets', async () => {
      const results = await dataSource.manager
        .createQueryBuilder(ScopedFilterTest, 'e')
        .where(new Brackets((qb) => {
          qb.whereMatchPlainDate('e.date', { operation: PlainDateOperation.SAME_OR_BEFORE, value: '2024-01-15' })
        }))
        .getMany()

      expectIds(results, [1, 2])
    })

    it('supports whereMatchPlainDate on delete query builders', async () => {
      await seed(dataSource, { id: 101, uuid: DELETE_TEST_UUID_1, amount: 40, date: plainDate('2024-03-01') })
      await seed(dataSource, { id: 102, uuid: DELETE_TEST_UUID_2, amount: 50, date: plainDate('2024-03-02') })

      await dataSource.manager
        .createQueryBuilder()
        .delete()
        .from(ScopedFilterTest)
        .whereMatchPlainDate('date', { operation: PlainDateOperation.SAME_OR_AFTER, value: '2024-03-01' })
        .execute()

      const results = await dataSource.manager
        .createQueryBuilder(ScopedFilterTest, 'e')
        .where('e.id IN (:...ids)', { ids: [1, 2, 3, 101, 102] })
        .getMany()

      expectIds(results, [1, 2, 3])
    })

    it('supports whereMatchPlainDate on update query builders', async () => {
      await dataSource.manager
        .createQueryBuilder()
        .update(ScopedFilterTest)
        .set({ amount: 99 })
        .whereMatchPlainDate('date', { operation: PlainDateOperation.SAME_OR_BEFORE, value: '2024-01-15' })
        .execute()

      const results = await dataSource.manager
        .createQueryBuilder(ScopedFilterTest, 'e')
        .where('e.amount = :amount', { amount: 99 })
        .getMany()

      expectIds(results, [1, 2])
    })
  })

  async function findByDate (filter: PlainDateFilter): Promise<ScopedFilterTest[]> {
    return await dataSource.manager
      .createQueryBuilder(ScopedFilterTest, 'e')
      .where('e.id IN (:...ids)', { ids: [1, 2, 3] })
      .andWhere(matchPlainDate('e.date', filter)!)
      .getMany()
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
