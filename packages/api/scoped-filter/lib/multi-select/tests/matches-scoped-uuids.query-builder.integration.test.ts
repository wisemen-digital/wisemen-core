import { after, before, describe, it } from 'node:test'
import { plainDate } from '@wisemen/datewise'
import { expect } from 'expect'
import { Brackets, DataSource } from 'typeorm'
import { MultiSelectOperation } from '#src/multi-select/multi-select-operation.js'
import { dataSource } from '../../tests/sql/datasource.js'
import { ScopedFilterTest } from '../../tests/sql/scoped-filter-test.entity.js'
import { IntegrationTestSetup } from '../../tests/test-setup.js'
import { MultiSelectUuidFilter } from '#src/multi-select/multi-select-uuid-filter.js'
import { matchMultiSelect } from '#src/multi-select/match-multi-select.qb.js'

const UUID_1 = '00000000-0000-0000-0000-000000000001'
const UUID_2 = '00000000-0000-0000-0000-000000000002'
const UUID_3 = '00000000-0000-0000-0000-000000000003'
const DELETE_TEST_UUID_1 = '00000000-0000-0000-0000-000000000101'
const DELETE_TEST_UUID_2 = '00000000-0000-0000-0000-000000000102'

describe('matchesScopedUuids (query builder)', () => {
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

  describe('scope: include', () => {
    it('returns only rows matching the provided uuids', async () => {
      const filter: MultiSelectUuidFilter<string> = { operation: MultiSelectOperation.INCLUDE, values: [UUID_1, UUID_2] }

      const results = await dataSource.manager
        .createQueryBuilder(ScopedFilterTest, 'e')
        .where('e.id IN (:...ids)', { ids: [1, 2, 3] })
        .andWhere(matchMultiSelect('e.uuid', filter))
        .getMany()

      expect(results.length).toBe(2)
      expect(results.some(r => r.uuid === UUID_1)).toBe(true)
      expect(results.some(r => r.uuid === UUID_2)).toBe(true)
    })

    it('returns an empty result when no rows match', async () => {
      const nonExistentUuid = '00000000-0000-0000-0000-000000000099'
      const filter: MultiSelectUuidFilter<string> = { operation: MultiSelectOperation.INCLUDE, values: [nonExistentUuid] }

      const results = await dataSource.manager
        .createQueryBuilder(ScopedFilterTest, 'e')
        .where('e.id IN (:...ids)', { ids: [1, 2, 3] })
        .andWhere(matchMultiSelect('e.uuid', filter))
        .getMany()

      expect(results.length).toBe(0)
    })
  })

  describe('scope: exclude', () => {
    it('returns rows not matching the provided uuids', async () => {
      const filter: MultiSelectUuidFilter<string> = { operation: MultiSelectOperation.EXCLUDE, values: [UUID_1, UUID_2] }

      const results = await dataSource.manager
        .createQueryBuilder(ScopedFilterTest, 'e')
        .where('e.id IN (:...ids)', { ids: [1, 2, 3] })
        .andWhere(matchMultiSelect('e.uuid', filter))
        .getMany()

      expect(results.length).toBe(1)
      expect(results.some(r => r.uuid === UUID_3)).toBe(true)
    })

    it('returns all rows when no rows match the exclusion', async () => {
      const nonExistentUuid = '00000000-0000-0000-0000-000000000099'
      const filter: MultiSelectUuidFilter<string> = { operation: MultiSelectOperation.EXCLUDE, values: [nonExistentUuid] }

      const results = await dataSource.manager
        .createQueryBuilder(ScopedFilterTest, 'e')
        .where('e.id IN (:...ids)', { ids: [1, 2, 3] })
        .andWhere(matchMultiSelect('e.uuid', filter))
        .getMany()

      expect(results.length).toBe(3)
    })
  })

  describe('query builder overrides', () => {
    it('supports whereMatchMultiSelect', async () => {
      const filter: MultiSelectUuidFilter<string> = { operation: MultiSelectOperation.INCLUDE, values: [UUID_1, UUID_2] }

      const results = await dataSource.manager
        .createQueryBuilder(ScopedFilterTest, 'e')
        .whereMatchMultiSelect('e.uuid', filter)
        .getMany()

      expect(results.map(result => result.id).sort((a, b) => a - b)).toEqual([1, 2])
    })

    it('supports andWhereMatchMultiSelect', async () => {
      const filter: MultiSelectUuidFilter<string> = { operation: MultiSelectOperation.EXCLUDE, values: [UUID_2] }

      const results = await dataSource.manager
        .createQueryBuilder(ScopedFilterTest, 'e')
        .where('e.amount >= :amount', { amount: 20 })
        .andWhereMatchMultiSelect('e.uuid', filter)
        .getMany()

      expect(results.map(result => result.id).sort((a, b) => a - b)).toEqual([3])
    })

    it('supports orWhereMatchMultiSelect', async () => {
      const filter: MultiSelectUuidFilter<string> = { operation: MultiSelectOperation.INCLUDE, values: [UUID_3] }

      const results = await dataSource.manager
        .createQueryBuilder(ScopedFilterTest, 'e')
        .where('e.id = :id', { id: 1 })
        .orWhereMatchMultiSelect('e.uuid', filter)
        .getMany()

      expect(results.map(result => result.id).sort((a, b) => a - b)).toEqual([1, 3])
    })

    it('does not add a clause when the override filter is undefined', async () => {
      const results = await dataSource.manager
        .createQueryBuilder(ScopedFilterTest, 'e')
        .where('e.id = :id', { id: 2 })
        .andWhereMatchMultiSelect('e.uuid', undefined)
        .getMany()

      expect(results.map(result => result.id)).toEqual([2])
    })

    it('supports whereMatchMultiSelect inside TypeORM brackets', async () => {
      const filter: MultiSelectUuidFilter<string> = { operation: MultiSelectOperation.INCLUDE, values: [UUID_1, UUID_2] }

      const results = await dataSource.manager
        .createQueryBuilder(ScopedFilterTest, 'e')
        .where(new Brackets((qb) => {
          qb.whereMatchMultiSelect('e.uuid', filter)
        }))
        .getMany()

      expect(results.map(result => result.id).sort((a, b) => a - b)).toEqual([1, 2])
    })

    it('supports whereMatchMultiSelect on delete query builders', async () => {
      await seed(dataSource, { id: 101, uuid: DELETE_TEST_UUID_1, amount: 10, date: plainDate('2024-03-01') })
      await seed(dataSource, { id: 102, uuid: DELETE_TEST_UUID_2, amount: 20, date: plainDate('2024-03-02') })

      const filter: MultiSelectUuidFilter<string> = {
        operation: MultiSelectOperation.INCLUDE,
        values: [DELETE_TEST_UUID_1, DELETE_TEST_UUID_2]
      }

      await dataSource.manager
        .createQueryBuilder()
        .delete()
        .from(ScopedFilterTest)
        .whereMatchMultiSelect('uuid', filter)
        .execute()

      const results = await dataSource.manager
        .createQueryBuilder(ScopedFilterTest, 'e')
        .where('e.id IN (:...ids)', { ids: [1, 2, 3, 101, 102] })
        .getMany()

      expect(results.map(result => result.id).sort((a, b) => a - b)).toEqual([1, 2, 3])
    })

    it('supports whereMatchMultiSelect on update query builders', async () => {
      const filter: MultiSelectUuidFilter<string> = { operation: MultiSelectOperation.INCLUDE, values: [UUID_1, UUID_2] }

      await dataSource.manager
        .createQueryBuilder()
        .update(ScopedFilterTest)
        .set({ amount: 99 })
        .whereMatchMultiSelect('uuid', filter)
        .execute()

      const results = await dataSource.manager
        .createQueryBuilder(ScopedFilterTest, 'e')
        .where('e.amount = :amount', { amount: 99 })
        .getMany()

      expect(results.map(result => result.id).sort((a, b) => a - b)).toEqual([1, 2])
    })
  })

  async function seed (dataSource: DataSource, row: ScopedFilterTest): Promise<void> {
    await dataSource.manager.upsert(ScopedFilterTest, row, { conflictPaths: { id: true } })
  }
})
