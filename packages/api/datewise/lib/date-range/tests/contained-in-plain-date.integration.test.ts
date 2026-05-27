import { after, before, describe, it } from 'node:test'
import { expect } from 'expect'
import { DataSource, In } from 'typeorm'
import { DateRange } from '../date-range.js'
import { plainDate } from '../../plain-date/index.js'
import { ContainedIn } from '../../common/typeorm/contained-in.js'
import { IntegrationTestSetup } from './test-setup.js'
import { dataSource } from './sql/datasource.js'
import { PlainDateTest } from './sql/plain-date-test.entity.js'

describe('ContainedIn for PlainDate', () => {
  const integrationTest = new IntegrationTestSetup()

  before(async () => {
    await integrationTest.setup()
  })

  after(async () => {
    await integrationTest.teardown()
  })

  it('finds dates contained in a date range', async () => {
    const date1 = plainDate('2025-01-15')
    const date2 = plainDate('2025-02-15')
    const date3 = plainDate('2025-03-15')
    
    await seed(dataSource, { id: 1, date: date1 })
    await seed(dataSource, { id: 2, date: date2 })
    await seed(dataSource, { id: 3, date: date3 })

    const range = new DateRange('2025-01-01', '2025-02-28')
    
    const results = await dataSource.manager.find(PlainDateTest, {
      where: { 
        id: In([1, 2, 3]),
        date: ContainedIn(range) 
      }
    })

    expect(results.length).toBe(2)
    expect(results.some(r => r.id === 1)).toBe(true)
    expect(results.some(r => r.id === 2)).toBe(true)
  })

  it('finds dates on range boundaries (inclusive)', async () => {
    const startDate = plainDate('2025-01-01')
    const endDate = plainDate('2025-01-31')
    
    await seed(dataSource, { id: 4, date: startDate })
    await seed(dataSource, { id: 5, date: endDate })

    const range = new DateRange('2025-01-01', '2025-01-31')
    
    const results = await dataSource.manager.find(PlainDateTest, {
      where: { 
        id: In([4, 5]),
        date: ContainedIn(range) 
      },
      order: { id: 'ASC' }
    })

    expect(results.length).toBe(2)
    expect(results[0].id).toBe(4)
    expect(results[1].id).toBe(5)
  })

  it('excludes dates outside the range', async () => {
    const beforeDate = plainDate('2024-12-31')
    const afterDate = plainDate('2025-02-01')
    
    await seed(dataSource, { id: 6, date: beforeDate })
    await seed(dataSource, { id: 7, date: afterDate })

    const range = new DateRange('2025-01-01', '2025-01-31')
    
    const results = await dataSource.manager.find(PlainDateTest, {
      where: { 
        id: In([6, 7]),
        date: ContainedIn(range) 
      }
    })

    expect(results.length).toBe(0)
  })

  it('handles infinite date ranges', async () => {
    const date = plainDate('2025-01-15')
    
    await seed(dataSource, { id: 8, date })

    const infiniteRange = new DateRange('-infinity', 'infinity')
    
    const results = await dataSource.manager.find(PlainDateTest, {
      where: { 
        id: In([8]),
        date: ContainedIn(infiniteRange) 
      }
    })

    expect(results.length).toBe(1)
    expect(results[0].id).toBe(8)
  })

  async function seed (dataSource: DataSource, row: PlainDateTest): Promise<void> {
    await dataSource.manager.upsert(PlainDateTest, row, { conflictPaths: { id: true } })
  }
})
