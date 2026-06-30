import { after, before, describe, it } from 'node:test'
import { plainDate } from '@wisemen/datewise'
import { expect } from 'expect'
import { DataSource } from 'typeorm'
import { MultiSelectOperation } from '#src/multi-select/multi-select-operation.js'
import { dataSource } from '../../tests/sql/datasource.js'
import { ScopedFilterTest } from '../../tests/sql/scoped-filter-test.entity.js'
import { IntegrationTestSetup } from '../../tests/test-setup.js'
import { MultiSelectUuidFilter } from '#src/multi-select/multi-select-uuid-filter.js'
import { matchMultiSelect } from '#src/multi-select/match-multi-select.qb.js'

const UUID_1 = '00000000-0000-0000-0000-000000000001'
const UUID_2 = '00000000-0000-0000-0000-000000000002'
const UUID_3 = '00000000-0000-0000-0000-000000000003'

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

  async function seed (dataSource: DataSource, row: ScopedFilterTest): Promise<void> {
    await dataSource.manager.upsert(ScopedFilterTest, row, { conflictPaths: { id: true } })
  }
})
