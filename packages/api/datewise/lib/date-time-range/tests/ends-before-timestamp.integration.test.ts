import { after, before, describe, it } from 'node:test'
import { expect } from 'expect'
import { DataSource, In } from 'typeorm'
import { EndsBefore } from '#src/common/index.js'
import { DateTimeRange } from '#src/date-time-range/date-time-range.js'
import { DateTimeRangeTest } from '#src/date-time-range/tests/sql/date-time-range-test.entity.js'
import { timestamp } from '#src/timestamp/index.js'
import { IntegrationTestSetup } from '#src/date-time-range/tests/test-setup.js'
import { dataSource } from '#src/date-time-range/tests/sql/datasource.js'

describe('EndsBefore for Timestamp', () => {
  const integrationTest = new IntegrationTestSetup()

  before(async () => {
    await integrationTest.setup()
  })

  after(async () => {
    await integrationTest.teardown()
  })

  it('finds date-time ranges that end before the given timestamp', async () => {
    const range1 = new DateTimeRange(timestamp('2025-01-01T00:00:00Z'), timestamp('2025-01-31T23:59:59Z'))
    const range2 = new DateTimeRange(timestamp('2025-01-15T00:00:00Z'), timestamp('2025-01-20T23:59:59Z'))
    const range3 = new DateTimeRange(timestamp('2025-03-01T00:00:00Z'), timestamp('2025-03-31T23:59:59Z'))

    await seed(dataSource, { id: 1, range: range1 })
    await seed(dataSource, { id: 2, range: range2 })
    await seed(dataSource, { id: 3, range: range3 })

    const results = await dataSource.manager.find(DateTimeRangeTest, {
      where: {
        id: In([1, 2, 3]),
        range: EndsBefore(timestamp('2025-02-15T00:00:00Z'))
      }
    })

    expect(results.length).toBe(2)
    expect(results.some(r => r.id === 1)).toBe(true)
    expect(results.some(r => r.id === 2)).toBe(true)
  })

  it('excludes date-time ranges that end on or after the given timestamp', async () => {
    const range1 = new DateTimeRange(timestamp('2025-03-01T00:00:00Z'), timestamp('2025-03-31T23:59:59Z'))
    const range2 = new DateTimeRange(timestamp('2025-02-15T00:00:00Z'), timestamp('2025-04-30T23:59:59Z'))

    await seed(dataSource, { id: 4, range: range1 })
    await seed(dataSource, { id: 5, range: range2 })

    const results = await dataSource.manager.find(DateTimeRangeTest, {
      where: {
        id: In([4, 5]),
        range: EndsBefore(timestamp('2025-02-15T00:00:00Z'))
      }
    })

    expect(results.length).toBe(0)
  })

  async function seed (dataSource: DataSource, row: DateTimeRangeTest): Promise<void> {
    await dataSource.manager.upsert(DateTimeRangeTest, row, { conflictPaths: { id: true } })
  }
})
