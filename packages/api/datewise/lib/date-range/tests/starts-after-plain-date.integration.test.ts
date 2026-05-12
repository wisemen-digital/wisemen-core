import { after, before, describe, it } from 'node:test'
import { expect } from 'expect'
import { DataSource, In } from 'typeorm'
import { StartsAfter } from '#src/common/index.js'
import { DateRange } from '#src/date-range/date-range.js'
import { dataSource } from '#src/date-range/tests/sql/datasource.js'
import { FiniteDateRangeTest } from '#src/date-range/tests/sql/finite-date-range-test.entity.js'
import { IntegrationTestSetup } from '#src/date-range/tests/test-setup.js'
import { plainDate } from '#src/plain-date/plain-date.fn.js'

describe('StartsAfter for PlainDate', () => {
  const integrationTest = new IntegrationTestSetup()

  before(async () => {
    await integrationTest.setup()
  })

  after(async () => {
    await integrationTest.teardown()
  })

  it('finds date ranges that start after the given date', async () => {
    const range1 = new DateRange(plainDate('2025-03-01'), plainDate('2025-03-31'))
    const range2 = new DateRange(plainDate('2025-04-01'), plainDate('2025-04-30'))
    const range3 = new DateRange(plainDate('2025-01-01'), plainDate('2025-01-31'))

    await seed(dataSource, { id: 1, range: range1 })
    await seed(dataSource, { id: 2, range: range2 })
    await seed(dataSource, { id: 3, range: range3 })

    const results = await dataSource.manager.find(FiniteDateRangeTest, {
      where: {
        id: In([1, 2, 3]),
        range: StartsAfter(plainDate('2025-02-01'))
      }
    })

    expect(results.length).toBe(2)
    expect(results.some(r => r.id === 1)).toBe(true)
    expect(results.some(r => r.id === 2)).toBe(true)
  })

  it('excludes date ranges that start before or on the given date', async () => {
    const range1 = new DateRange(plainDate('2025-01-01'), plainDate('2025-01-31'))
    const range2 = new DateRange(plainDate('2025-02-01'), plainDate('2025-02-28'))

    await seed(dataSource, { id: 4, range: range1 })
    await seed(dataSource, { id: 5, range: range2 })

    const results = await dataSource.manager.find(FiniteDateRangeTest, {
      where: {
        id: In([4, 5]),
        range: StartsAfter(plainDate('2025-02-01'))
      }
    })

    expect(results.length).toBe(0)
  })

  async function seed (dataSource: DataSource, row: FiniteDateRangeTest): Promise<void> {
    await dataSource.manager.upsert(FiniteDateRangeTest, row, { conflictPaths: { id: true } })
  }
})
