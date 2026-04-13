import { after, before, describe, it } from 'node:test'
import { expect } from 'expect'
import { DataSource } from 'typeorm'
import { DateRange } from '../date-range.js'
import { plainDate } from '../../plain-date/index.js'
import { IntegrationTestSetup } from './test-setup.js'
import { dataSource } from './sql/datasource.js'
import { FiniteDateRangeTest } from './sql/finite-date-range-test.entity.js'

describe('Finite DateRange Column', () => {
  const integrationTest = new IntegrationTestSetup()

  before(async () => {
    await integrationTest.setup()
  })

  after(async () => {
    await integrationTest.teardown()
  })

  it('stores null date range', async () => {
    await seed(dataSource, { id: 1, range: null })

    const test = await dataSource.manager.findOneByOrFail(FiniteDateRangeTest, { id: 1 })

    expect(test.range).toBeNull()
  })

  it('stores date range with finite boundaries', async () => {
    const range = new DateRange(plainDate.today(), plainDate.tomorrow())

    await seed(dataSource, { id: 2, range })

    const test = await dataSource.manager.findOneByOrFail(FiniteDateRangeTest, { id: 2 })

    expect(test.range).not.toBeNull()
    expect(test.range?.isSame(range)).toBe(true)
  })

  it('rejects (-infinity, date]', async () => {
    const range = new DateRange('-infinity', plainDate.today())

    const promise = seed(dataSource, { id: 3, range })

    await expect(promise).rejects.toThrow()
  })

  it('rejects [date, infinity)', async () => {
    const range = new DateRange(plainDate.today(), 'infinity')

    const promise = seed(dataSource, { id: 4, range })

    await expect(promise).rejects.toThrow()
  })

  it('rejects (-infinity, infinity)', async () => {
    const range = new DateRange('-infinity', 'infinity')

    const promise = seed(dataSource, { id: 5, range })

    await expect(promise).rejects.toThrow()
  })

  async function seed (dataSource: DataSource, row: FiniteDateRangeTest): Promise<void> {
    await dataSource.manager.upsert(FiniteDateRangeTest, row, { conflictPaths: { id: true } })
  }
})
