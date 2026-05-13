import { after, before, describe, it } from 'node:test'
import { expect } from 'expect'
import { DataSource, In } from 'typeorm'
import { DateTimeRange } from '../date-time-range.js'
import { timestamp } from '../../timestamp/index.js'
import { ContainedIn } from '../../common/typeorm/contained-in.js'
import { IntegrationTestSetup } from './test-setup.js'
import { dataSource } from './sql/datasource.js'
import { DateTest } from './sql/date-test.entity.js'

describe('ContainedIn for Date', () => {
  const integrationTest = new IntegrationTestSetup()

  before(async () => {
    await integrationTest.setup()
  })

  after(async () => {
    await integrationTest.teardown()
  })

  it('finds Date columns contained in a date time range', async () => {
    const date1 = new Date('2025-01-15T10:00:00Z')
    const date2 = new Date('2025-02-15T14:30:00Z')
    const date3 = new Date('2025-03-15T18:45:00Z')
    
    await seed(dataSource, { id: 1, date: date1 })
    await seed(dataSource, { id: 2, date: date2 })
    await seed(dataSource, { id: 3, date: date3 })

    const range = new DateTimeRange(
      timestamp('2025-01-01T00:00:00Z'),
      timestamp('2025-02-28T23:59:59Z')
    )
    
    // This is mainly a TypeScript typing test - ensure ContainedIn accepts Date columns
    const results = await dataSource.manager.find(DateTest, {
      where: { 
        id: In([1, 2, 3]),
        date: ContainedIn(range) 
      }
    })

    expect(results.length).toBe(2)
    expect(results.some(r => r.id === 1)).toBe(true)
    expect(results.some(r => r.id === 2)).toBe(true)
  })

  it('excludes Date columns outside the range', async () => {
    const beforeDate = new Date('2024-12-31T23:59:59Z')
    const afterDate = new Date('2025-02-01T00:00:01Z')
    
    await seed(dataSource, { id: 4, date: beforeDate })
    await seed(dataSource, { id: 5, date: afterDate })

    const range = new DateTimeRange(
      timestamp('2025-01-01T00:00:00Z'),
      timestamp('2025-02-01T00:00:00Z')
    )
    
    const results = await dataSource.manager.find(DateTest, {
      where: { 
        id: In([4, 5]),
        date: ContainedIn(range) 
      }
    })

    expect(results.length).toBe(0)
  })

  async function seed (dataSource: DataSource, row: DateTest): Promise<void> {
    await dataSource.manager.upsert(DateTest, row, { conflictPaths: { id: true } })
  }
})
