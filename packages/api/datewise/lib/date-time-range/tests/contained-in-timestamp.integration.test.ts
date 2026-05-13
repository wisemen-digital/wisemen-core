import { after, before, describe, it } from 'node:test'
import { expect } from 'expect'
import { DataSource, In } from 'typeorm'
import { DateTimeRange } from '../date-time-range.js'
import { timestamp } from '../../timestamp/index.js'
import { ContainedIn } from '../../common/typeorm/contained-in.js'
import { PastInfinity } from '../../timestamp/past-infinity.js'
import { FutureInfinity } from '../../timestamp/future-infinity.js'
import { IntegrationTestSetup } from './test-setup.js'
import { dataSource } from './sql/datasource.js'
import { TimestampTest } from './sql/timestamp-test.entity.js'

describe('ContainedIn for Timestamp', () => {
  const integrationTest = new IntegrationTestSetup()

  before(async () => {
    await integrationTest.setup()
  })

  after(async () => {
    await integrationTest.teardown()
  })

  it('finds timestamps contained in a date time range', async () => {
    const ts1 = timestamp('2025-01-15T10:00:00Z')
    const ts2 = timestamp('2025-02-15T14:30:00Z')
    const ts3 = timestamp('2025-03-15T18:45:00Z')
    
    await seed(dataSource, { id: 1, timestamp: ts1 })
    await seed(dataSource, { id: 2, timestamp: ts2 })
    await seed(dataSource, { id: 3, timestamp: ts3 })

    const range = new DateTimeRange(
      timestamp('2025-01-01T00:00:00Z'),
      timestamp('2025-02-28T23:59:59Z')
    )
    
    const results = await dataSource.manager.find(TimestampTest, {
      where: { 
        id: In([1, 2, 3]),
        timestamp: ContainedIn(range) 
      }
    })

    expect(results.length).toBe(2)
    expect(results.some(r => r.id === 1)).toBe(true)
    expect(results.some(r => r.id === 2)).toBe(true)
  })

  it('finds timestamps on range boundaries (inclusive start, exclusive end)', async () => {
    const startTime = timestamp('2025-01-01T00:00:00Z')
    const endTime = timestamp('2025-01-31T23:59:59Z')
    
    await seed(dataSource, { id: 4, timestamp: startTime })
    await seed(dataSource, { id: 5, timestamp: endTime })

    const range = new DateTimeRange(
      timestamp('2025-01-01T00:00:00Z'),
      timestamp('2025-02-01T00:00:00Z')
    )
    
    const results = await dataSource.manager.find(TimestampTest, {
      where: { 
        id: In([4, 5]),
        timestamp: ContainedIn(range) 
      },
      order: { id: 'ASC' }
    })

    expect(results.length).toBe(2)
    expect(results[0].id).toBe(4)
    expect(results[1].id).toBe(5)
  })

  it('excludes timestamps outside the range', async () => {
    const beforeTime = timestamp('2024-12-31T23:59:59Z')
    const afterTime = timestamp('2025-02-01T00:00:01Z')
    
    await seed(dataSource, { id: 6, timestamp: beforeTime })
    await seed(dataSource, { id: 7, timestamp: afterTime })

    const range = new DateTimeRange(
      timestamp('2025-01-01T00:00:00Z'),
      timestamp('2025-02-01T00:00:00Z')
    )
    
    const results = await dataSource.manager.find(TimestampTest, {
      where: { 
        id: In([6, 7]),
        timestamp: ContainedIn(range) 
      }
    })

    expect(results.length).toBe(0)
  })

  it('handles half-infinite ranges (-infinity, date]', async () => {
    const ts = timestamp('2025-01-15T12:00:00Z')
    
    await seed(dataSource, { id: 8, timestamp: ts })

    const halfInfiniteRange = new DateTimeRange(
      new PastInfinity(),
      timestamp('2025-12-31T23:59:59Z')
    )
    
    const results = await dataSource.manager.find(TimestampTest, {
      where: { 
        id: In([8]),
        timestamp: ContainedIn(halfInfiniteRange) 
      }
    })

    expect(results.length).toBe(1)
    expect(results[0].id).toBe(8)
  })

  it('handles half-infinite ranges [date, infinity)', async () => {
    const ts = timestamp('2025-06-15T12:00:00Z')
    
    await seed(dataSource, { id: 9, timestamp: ts })

    const halfInfiniteRange = new DateTimeRange(
      timestamp('2025-01-01T00:00:00Z'),
      new FutureInfinity()
    )
    
    const results = await dataSource.manager.find(TimestampTest, {
      where: { 
        id: In([9]),
        timestamp: ContainedIn(halfInfiniteRange) 
      }
    })

    expect(results.length).toBe(1)
    expect(results[0].id).toBe(9)
  })

  it('handles fully infinite ranges (-infinity, infinity)', async () => {
    const ts = timestamp('2025-01-15T12:00:00Z')
    
    await seed(dataSource, { id: 10, timestamp: ts })

    const fullyInfiniteRange = new DateTimeRange(
      new PastInfinity(),
      new FutureInfinity()
    )
    
    const results = await dataSource.manager.find(TimestampTest, {
      where: { 
        id: In([10]),
        timestamp: ContainedIn(fullyInfiniteRange) 
      }
    })

    expect(results.length).toBe(1)
    expect(results[0].id).toBe(10)
  })

  async function seed (dataSource: DataSource, row: TimestampTest): Promise<void> {
    await dataSource.manager.upsert(TimestampTest, row, { conflictPaths: { id: true } })
  }
})
