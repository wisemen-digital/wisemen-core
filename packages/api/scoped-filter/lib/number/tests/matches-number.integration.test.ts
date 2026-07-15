import { after, before, describe, it } from 'node:test'
import { plainDate } from '@wisemen/datewise'
import { expect } from 'expect'
import { DataSource, In } from 'typeorm'
import { MatchNumber } from '#src/number/match-number.js'
import { NumberFilter } from '#src/number/number-filter.js'
import { NumberOperation } from '#src/number/number-operation.js'
import { dataSource } from '../../tests/sql/datasource.js'
import { ScopedFilterTest } from '../../tests/sql/scoped-filter-test.entity.js'
import { IntegrationTestSetup } from '../../tests/test-setup.js'

const UUID_1 = '00000000-0000-0000-0000-000000000001'
const UUID_2 = '00000000-0000-0000-0000-000000000002'
const UUID_3 = '00000000-0000-0000-0000-000000000003'

describe('MatchNumber', () => {
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
    const result = MatchNumber(undefined)

    expect(result).toBeUndefined()
  })

  it('returns undefined when filter is null', () => {
    const result = MatchNumber(null)

    expect(result).toBeUndefined()
  })

  async function findByAmount (filter: NumberFilter): Promise<ScopedFilterTest[]> {
    return await dataSource.manager.find(ScopedFilterTest, {
      where: {
        id: In([1, 2, 3]),
        amount: MatchNumber(filter)
      }
    })
  }

  function expectIds (results: ScopedFilterTest[], expectedIds: number[]): void {
    expect(results.map(result => result.id).sort((a, b) => a - b)).toEqual(expectedIds)
  }

  async function seed (dataSource: DataSource, row: ScopedFilterTest): Promise<void> {
    await dataSource.manager.upsert(ScopedFilterTest, row, { conflictPaths: { id: true } })
  }
})
