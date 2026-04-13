import { after, before, describe, it } from 'node:test'
import { expect } from 'expect'
import { DataSource } from 'typeorm'
import { DateTimeRange } from '../date-time-range.js'
import { timestamp } from '../../timestamp/index.js'
import { IntegrationTestSetup } from './test-setup.js'
import { dataSource } from './sql/datasource.js'
import { FiniteDateTimeRangeTest } from './sql/finite-date-time-range-test.entity.js'

describe('Finite DateTimeRange Column', () => {
  const integrationTest = new IntegrationTestSetup()

  before(async () => {
    await integrationTest.setup()
  })

  after(async () => {
    await integrationTest.teardown()
  })

  it('stores null date time range', async () => {
    await seed(dataSource, { id: 1, range: null })

    const test = await dataSource.manager.findOneByOrFail(FiniteDateTimeRangeTest, { id: 1 })

    expect(test.range).toBeNull()
  })

  it('stores date time range with finite boundaries', async () => {
    const range = new DateTimeRange(timestamp(), timestamp().add(1, 'hour'))

    await seed(dataSource, { id: 2, range })

    const test = await dataSource.manager.findOneByOrFail(FiniteDateTimeRangeTest, { id: 2 })

    expect(test.range).not.toBeNull()
    expect(test.range?.isSame(range)).toBe(true)
  })

  it('rejects (-infinity, timestamp)', async () => {
    const range = new DateTimeRange('-infinity', timestamp())

    const promise = seed(dataSource, { id: 3, range })

    await expect(promise).rejects.toThrow()
  })

  it('rejects [timestamp, infinity)', async () => {
    const range = new DateTimeRange(timestamp(), 'infinity')

    const promise = seed(dataSource, { id: 4, range })

    await expect(promise).rejects.toThrow()
  })

  it('rejects (-infinity, infinity)', async () => {
    const range = new DateTimeRange('-infinity', 'infinity')

    const promise = seed(dataSource, { id: 4, range })

    await expect(promise).rejects.toThrow()
  })

  async function seed (dataSource: DataSource, row: FiniteDateTimeRangeTest): Promise<void> {
    await dataSource.manager.upsert(FiniteDateTimeRangeTest, row, { conflictPaths: { id: true } })
  }
})
