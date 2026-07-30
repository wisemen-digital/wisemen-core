import { after, before, describe, it } from 'node:test'
import { plainDate } from '@wisemen/datewise'
import { expect } from 'expect'
import { Brackets, DataSource } from 'typeorm'
import { matchNumber } from '#src/number/match-number.qb.js'
import { NumberFilter } from '#src/number/number-filter.js'
import { NumberOperation } from '#src/number/number-operation.js'
import { dataSource } from '../../tests/sql/datasource.js'
import { ScopedFilterTest } from '../../tests/sql/scoped-filter-test.entity.js'
import { IntegrationTestSetup } from '../../tests/test-setup.js'

const UUID_1 = '00000000-0000-0000-0000-000000000001'
const UUID_2 = '00000000-0000-0000-0000-000000000002'
const UUID_3 = '00000000-0000-0000-0000-000000000003'
const DELETE_TEST_UUID_1 = '00000000-0000-0000-0000-000000000101'
const DELETE_TEST_UUID_2 = '00000000-0000-0000-0000-000000000102'

describe('matchNumber (query builder)', () => {
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

  it('matches equals', async () => {
    const results = await findByAmount({ operation: NumberOperation.EQUALS, value: 20 })

    expectIds(results, [2])
  })

  it('matches not equals', async () => {
    const results = await findByAmount({ operation: NumberOperation.NOT_EQUALS, value: 20 })

    expectIds(results, [1, 3])
  })

  it('matches less than', async () => {
    const results = await findByAmount({ operation: NumberOperation.LESS_THAN, value: 20 })

    expectIds(results, [1])
  })

  it('matches less than or equal', async () => {
    const results = await findByAmount({ operation: NumberOperation.LESS_THAN_OR_EQUAL, value: 20 })

    expectIds(results, [1, 2])
  })

  it('matches more than', async () => {
    const results = await findByAmount({ operation: NumberOperation.MORE_THAN, value: 20 })

    expectIds(results, [3])
  })

  it('matches more than or equal', async () => {
    const results = await findByAmount({ operation: NumberOperation.MORE_THAN_OR_EQUAL, value: 20 })

    expectIds(results, [2, 3])
  })

  it('returns undefined when filter is undefined', () => {
    const result = matchNumber('e.amount', undefined)

    expect(result).toBeUndefined()
  })

  describe('query builder overrides', () => {
    it('supports whereMatchNumber', async () => {
      const results = await dataSource.manager
        .createQueryBuilder(ScopedFilterTest, 'e')
        .whereMatchNumber('e.amount', { operation: NumberOperation.EQUALS, value: 20 })
        .getMany()

      expectIds(results, [2])
    })

    it('supports andWhereMatchNumber', async () => {
      const results = await dataSource.manager
        .createQueryBuilder(ScopedFilterTest, 'e')
        .where('e.id >= :id', { id: 2 })
        .andWhereMatchNumber('e.amount', { operation: NumberOperation.NOT_EQUALS, value: 20 })
        .getMany()

      expectIds(results, [3])
    })

    it('supports orWhereMatchNumber', async () => {
      const results = await dataSource.manager
        .createQueryBuilder(ScopedFilterTest, 'e')
        .where('e.id = :id', { id: 1 })
        .orWhereMatchNumber('e.amount', { operation: NumberOperation.MORE_THAN_OR_EQUAL, value: 30 })
        .getMany()

      expectIds(results, [1, 3])
    })

    it('does not add a clause when the override filter is undefined', async () => {
      const results = await dataSource.manager
        .createQueryBuilder(ScopedFilterTest, 'e')
        .where('e.id = :id', { id: 2 })
        .andWhereMatchNumber('e.amount', undefined)
        .getMany()

      expectIds(results, [2])
    })

    it('supports whereMatchNumber inside TypeORM brackets', async () => {
      const results = await dataSource.manager
        .createQueryBuilder(ScopedFilterTest, 'e')
        .where(new Brackets((qb) => {
          qb.whereMatchNumber('e.amount', { operation: NumberOperation.LESS_THAN_OR_EQUAL, value: 20 })
        }))
        .getMany()

      expectIds(results, [1, 2])
    })

    it('supports whereMatchNumber on delete query builders', async () => {
      await seed(dataSource, { id: 101, uuid: DELETE_TEST_UUID_1, amount: 40, date: plainDate('2024-03-01') })
      await seed(dataSource, { id: 102, uuid: DELETE_TEST_UUID_2, amount: 50, date: plainDate('2024-03-02') })

      await dataSource.manager
        .createQueryBuilder()
        .delete()
        .from(ScopedFilterTest)
        .whereMatchNumber('amount', { operation: NumberOperation.MORE_THAN_OR_EQUAL, value: 40 })
        .execute()

      const results = await dataSource.manager
        .createQueryBuilder(ScopedFilterTest, 'e')
        .where('e.id IN (:...ids)', { ids: [1, 2, 3, 101, 102] })
        .getMany()

      expectIds(results, [1, 2, 3])
    })

    it('supports whereMatchNumber on update query builders', async () => {
      await dataSource.manager
        .createQueryBuilder()
        .update(ScopedFilterTest)
        .set({ amount: 99 })
        .whereMatchNumber('amount', { operation: NumberOperation.LESS_THAN_OR_EQUAL, value: 20 })
        .execute()

      const results = await dataSource.manager
        .createQueryBuilder(ScopedFilterTest, 'e')
        .where('e.amount = :amount', { amount: 99 })
        .getMany()

      expectIds(results, [1, 2])
    })
  })

  async function findByAmount (filter: NumberFilter): Promise<ScopedFilterTest[]> {
    return await dataSource.manager
      .createQueryBuilder(ScopedFilterTest, 'e')
      .where('e.id IN (:...ids)', { ids: [1, 2, 3] })
      .andWhere(matchNumber('e.amount', filter)!)
      .getMany()
  }

  function expectIds (results: ScopedFilterTest[], expectedIds: number[]): void {
    expect(results.map(result => result.id).sort((a, b) => a - b)).toEqual(expectedIds)
  }

  async function seed (dataSource: DataSource, row: ScopedFilterTest): Promise<void> {
    await dataSource.manager.upsert(ScopedFilterTest, row, { conflictPaths: { id: true } })
  }
})
