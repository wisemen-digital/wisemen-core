import { after, before, describe, it } from 'node:test'
import { expect } from 'expect'
import { DataSource, Equal, In, LessThan, MoreThan } from 'typeorm'
import { IntegrationTestSetup } from './test-setup.js'
import { AndOrIgnore } from '../and-or-ignore.js'
import { dataSource } from './sql/datasource.js'
import { TestEntity } from './sql/test.entity.js'

describe('AnyOrIgnore', () => {
  const integrationTest = new IntegrationTestSetup()

  before(async () => {
    await integrationTest.setup()
  })

  after(async () => {
    await integrationTest.teardown()
  })

  it('returns undefined when all operators are undefined', async () => {
    await seed(dataSource, { id: 1, name: 'Alice', age: 25, email: 'alice@example.com', city: 'New York' })
    await seed(dataSource, { id: 2, name: 'Bob', age: 30, email: 'bob@example.com', city: 'London' })

    const results = await dataSource.manager.find(TestEntity, {
      where: {
        id: In([1, 2]),
        age: AndOrIgnore(undefined, undefined, undefined)
      }
    })

    // When operator is undefined, it should be ignored and return all records
    expect(results.length).toBe(2)
  })

  it('returns the single operator when only one non-undefined operator is provided', async () => {
    await seed(dataSource, { id: 3, name: 'Charlie', age: 25, email: 'charlie@example.com', city: 'Paris' })
    await seed(dataSource, { id: 4, name: 'Diana', age: 30, email: 'diana@example.com', city: 'Berlin' })
    await seed(dataSource, { id: 5, name: 'Eve', age: 35, email: 'eve@example.com', city: 'Madrid' })

    const results = await dataSource.manager.find(TestEntity, {
      where: {
        id: In([3, 4, 5]),
        age: AndOrIgnore(MoreThan(27), undefined, undefined)
      }
    })

    expect(results.length).toBe(2)
    expect(results.some(r => r.id === 4)).toBe(true)
    expect(results.some(r => r.id === 5)).toBe(true)
  })

  it('returns And() when multiple non-undefined operators are provided', async () => {
    await seed(dataSource, { id: 6, name: 'Frank', age: 20, email: 'frank@example.com', city: 'Rome' })
    await seed(dataSource, { id: 7, name: 'Grace', age: 25, email: 'grace@example.com', city: 'Vienna' })
    await seed(dataSource, { id: 8, name: 'Henry', age: 30, email: 'henry@example.com', city: 'Prague' })
    await seed(dataSource, { id: 9, name: 'Ivy', age: 35, email: 'ivy@example.com', city: 'Budapest' })

    const results = await dataSource.manager.find(TestEntity, {
      where: {
        id: In([6, 7, 8, 9]),
        age: AndOrIgnore(MoreThan(22), LessThan(32))
      }
    })

    // Should return ages between 22 and 32 (25 and 30)
    expect(results.length).toBe(2)
    expect(results.some(r => r.id === 7)).toBe(true)
    expect(results.some(r => r.id === 8)).toBe(true)
  })

  it('filters out undefined operators and combines the rest with And()', async () => {
    await seed(dataSource, { id: 10, name: 'Jack', age: 20, email: 'jack@example.com', city: 'Athens' })
    await seed(dataSource, { id: 11, name: 'Kate', age: 25, email: 'kate@example.com', city: 'Dublin' })
    await seed(dataSource, { id: 12, name: 'Liam', age: 30, email: 'liam@example.com', city: 'Oslo' })
    await seed(dataSource, { id: 13, name: 'Mia', age: 35, email: 'mia@example.com', city: 'Stockholm' })

    const results = await dataSource.manager.find(TestEntity, {
      where: {
        id: In([10, 11, 12, 13]),
        age: AndOrIgnore(undefined, MoreThan(22), undefined, LessThan(32), undefined)
      }
    })

    // Should return ages between 22 and 32 (25 and 30)
    expect(results.length).toBe(2)
    expect(results.some(r => r.id === 11)).toBe(true)
    expect(results.some(r => r.id === 12)).toBe(true)
  })

  it('works with Equal operator', async () => {
    await seed(dataSource, { id: 14, name: 'Noah', age: 28, email: 'noah@example.com', city: 'Helsinki' })
    await seed(dataSource, { id: 15, name: 'Olivia', age: 28, email: 'olivia@example.com', city: 'Copenhagen' })
    await seed(dataSource, { id: 16, name: 'Paul', age: 29, email: 'paul@example.com', city: 'Brussels' })

    const results = await dataSource.manager.find(TestEntity, {
      where: {
        id: In([14, 15, 16]),
        age: AndOrIgnore(Equal(28))
      }
    })

    expect(results.length).toBe(2)
    expect(results.some(r => r.id === 14)).toBe(true)
    expect(results.some(r => r.id === 15)).toBe(true)
  })

  it('returns first operator when only first is defined', async () => {
    await seed(dataSource, { id: 17, name: 'Quinn', age: 40, email: 'quinn@example.com', city: 'Amsterdam' })
    await seed(dataSource, { id: 18, name: 'Rachel', age: 45, email: 'rachel@example.com', city: 'Lisbon' })

    const results = await dataSource.manager.find(TestEntity, {
      where: {
        id: In([17, 18]),
        age: AndOrIgnore(MoreThan(42), undefined)
      }
    })

    expect(results.length).toBe(1)
    expect(results[0].id).toBe(18)
  })

  async function seed (dataSource: DataSource, row: TestEntity): Promise<void> {
    await dataSource.manager.upsert(TestEntity, row, { conflictPaths: { id: true } })
  }
})
