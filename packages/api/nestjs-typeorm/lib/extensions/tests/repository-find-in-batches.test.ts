import { after, before, describe, it } from 'node:test'
import { expect } from 'expect'
import { Between, LessThan, LessThanOrEqual, MoreThanOrEqual } from 'typeorm'
import { dataSource } from './sql/datasource.js'
import { UserEntity } from './sql/entities/user.entity.js'
import { MessageEntity } from './sql/entities/message.entity.js'
import { TypeOrmRepository } from '#src/extensions/repository.js'

describe('Repository find in batches test', () => {
  before(async () => {
    await dataSource.initialize()
    await dataSource.synchronize(true)
  })

  after(async () => {
    await dataSource.destroy()
  })

  describe('Batching with filter and sorting on at most 1 field', () => {
    let repository: TypeOrmRepository<UserEntity>

    before(async () => {
      repository = new TypeOrmRepository(UserEntity, dataSource.manager)

      await repository.insert([
        { id: 1, name: 'Alice', age: 25 },
        { id: 2, name: 'Bob', age: 30 },
        { id: 3, name: 'Charlie', age: 28 },
        { id: 4, name: 'Diana', age: 22 },
        { id: 5, name: 'Eve', age: 35 }
      ])
    })

    it('finds in batches without filters or sorting', async () => {
      const result = repository.findInBatches({}, 2)

      const batches: UserEntity[][] = []

      for await (const batch of result) {
        batches.push(batch)
      }

      expect(batches).toHaveLength(3)
      expect(batches[0]).toHaveLength(2)
      expect(batches[1]).toHaveLength(2)
      expect(batches[2]).toHaveLength(1)
      expect(batches[0][0].name).toBe('Alice')
      expect(batches[0][1].name).toBe('Bob')
      expect(batches[1][0].name).toBe('Charlie')
      expect(batches[1][1].name).toBe('Diana')
      expect(batches[2][0].name).toBe('Eve')
    })

    it('finds in batches without filters with sorting', async () => {
      const result = repository.findInBatches({
        order: { name: 'DESC' }
      }, 2)

      const batches: UserEntity[][] = []

      for await (const batch of result) {
        batches.push(batch)
      }

      expect(batches).toHaveLength(3)
      expect(batches[0]).toHaveLength(2)
      expect(batches[1]).toHaveLength(2)
      expect(batches[2]).toHaveLength(1)
      expect(batches[0][0].name).toBe('Eve')
      expect(batches[0][1].name).toBe('Diana')
      expect(batches[1][0].name).toBe('Charlie')
      expect(batches[1][1].name).toBe('Bob')
      expect(batches[2][0].name).toBe('Alice')
    })

    it('finds in batches with filters without sorting', async () => {
      const result = repository.findInBatches({
        where: { age: LessThan(30) }
      }, 2)

      const batches: UserEntity[][] = []

      for await (const batch of result) {
        batches.push(batch)
      }

      expect(batches).toHaveLength(2)
      expect(batches[0]).toHaveLength(2)
      expect(batches[1]).toHaveLength(1)
      expect(batches[0][0].name).toBe('Alice')
      expect(batches[0][1].name).toBe('Charlie')
      expect(batches[1][0].name).toBe('Diana')
    })

    it('finds in batches with filters with sorting', async () => {
      const result = repository.findInBatches({
        where: { age: LessThan(30) },
        order: { age: 'ASC' }
      }, 2)

      const batches: UserEntity[][] = []

      for await (const batch of result) {
        batches.push(batch)
      }

      expect(batches).toHaveLength(2)
      expect(batches[0]).toHaveLength(2)
      expect(batches[1]).toHaveLength(1)
      expect(batches[0][0].name).toBe('Diana')
      expect(batches[0][1].name).toBe('Alice')
      expect(batches[1][0].name).toBe('Charlie')
    })

    it('finds in batches with disjunction filters with sorting', async () => {
      const result = repository.findInBatches({
        where: [{ age: LessThan(25) }, { age: MoreThanOrEqual(30) }],
        order: { age: 'DESC' }
      }, 2)

      const batches: UserEntity[][] = []

      for await (const batch of result) {
        batches.push(batch)
      }

      expect(batches).toHaveLength(2)
      expect(batches[0]).toHaveLength(2)
      expect(batches[1]).toHaveLength(1)
      expect(batches[0][0].name).toBe('Eve')
      expect(batches[0][1].name).toBe('Bob')
      expect(batches[1][0].name).toBe('Diana')
    })
  })

  describe('Batching with filter and sorting on multiple fields', () => {
    let repository: TypeOrmRepository<MessageEntity>

    before(async () => {
      repository = new TypeOrmRepository(MessageEntity, dataSource.manager)

      const now = new Date()
      const past = new Date(now.getTime() - 1000)
      const future = new Date(now.getTime() + 1000)

      await repository.insert([
        { id: 1, createdAt: now, message: 'Message 1' },
        { id: 2, createdAt: past, message: 'Message 2' },
        { id: 3, createdAt: future, message: 'Message 3' },
        { id: 4, createdAt: now, message: 'Message 4' },
        { id: 5, createdAt: past, message: 'Message 5' }
      ])
    })

    it('finds in batches with implicit secondary sorting', async () => {
      const result = repository.findInBatches({
        order: { createdAt: 'DESC' }
      }, 2)

      const batches: MessageEntity[][] = []

      for await (const batch of result) {
        batches.push(batch)
      }

      expect(batches).toHaveLength(3)
      expect(batches[0]).toHaveLength(2)
      expect(batches[1]).toHaveLength(2)
      expect(batches[2]).toHaveLength(1)
      expect(batches[0][0].id).toBe(3)
      expect(batches[0][1].id).toBe(1)
      expect(batches[1][0].id).toBe(4)
      expect(batches[1][1].id).toBe(2)
      expect(batches[2][0].id).toBe(5)
    })

    it('finds in batches with explicit secondary sorting', async () => {
      const result = repository.findInBatches({
        order: { createdAt: 'DESC', id: 'DESC' }
      }, 2)

      const batches: MessageEntity[][] = []

      for await (const batch of result) {
        batches.push(batch)
      }

      expect(batches).toHaveLength(3)
      expect(batches[0]).toHaveLength(2)
      expect(batches[1]).toHaveLength(2)
      expect(batches[2]).toHaveLength(1)
      expect(batches[0][0].id).toBe(3)
      expect(batches[0][1].id).toBe(4)
      expect(batches[1][0].id).toBe(1)
      expect(batches[1][1].id).toBe(5)
      expect(batches[2][0].id).toBe(2)
    })
  })

  describe('Batching with FindOperator filters on ordered columns', () => {
    let repository: TypeOrmRepository<MessageEntity>

    const now = new Date('2024-01-15T12:00:00Z')
    const past1 = new Date('2024-01-10T12:00:00Z')
    const past2 = new Date('2024-01-11T12:00:00Z')
    const future1 = new Date('2024-01-20T12:00:00Z')
    const future2 = new Date('2024-01-25T12:00:00Z')

    before(async () => {
      repository = new TypeOrmRepository(MessageEntity, dataSource.manager)
      await repository.deleteAll()

      await repository.insert([
        { id: 10, createdAt: past1, message: 'Old message 1' },
        { id: 11, createdAt: past2, message: 'Old message 2' },
        { id: 12, createdAt: now, message: 'Current message' },
        { id: 13, createdAt: future1, message: 'Future message 1' },
        { id: 14, createdAt: future2, message: 'Future message 2' }
      ])
    })

    it('finds in batches with Between filter on ordered column (ASC)', async () => {
      const rangeFrom = new Date('2024-01-10T00:00:00Z')
      const rangeUntil = new Date('2024-01-20T23:59:59Z')

      const result = repository.findInBatches({
        where: { createdAt: Between(rangeFrom, rangeUntil) },
        order: { createdAt: 'ASC' }
      }, 2)

      const batches: MessageEntity[][] = []

      for await (const batch of result) {
        batches.push(batch)
      }

      expect(batches).toHaveLength(2)
      expect(batches[0]).toHaveLength(2)
      expect(batches[1]).toHaveLength(2)
      expect(batches[0][0].id).toBe(10)
      expect(batches[0][1].id).toBe(11)
      expect(batches[1][0].id).toBe(12)
      expect(batches[1][1].id).toBe(13)
    })

    it('finds in batches with Between filter on ordered column (DESC)', async () => {
      const rangeFrom = new Date('2024-01-10T00:00:00Z')
      const rangeUntil = new Date('2024-01-20T23:59:59Z')

      const result = repository.findInBatches({
        where: { createdAt: Between(rangeFrom, rangeUntil) },
        order: { createdAt: 'DESC' }
      }, 2)

      const batches: MessageEntity[][] = []

      for await (const batch of result) {
        batches.push(batch)
      }

      expect(batches).toHaveLength(2)
      expect(batches[0]).toHaveLength(2)
      expect(batches[1]).toHaveLength(2)
      expect(batches[0][0].id).toBe(13)
      expect(batches[0][1].id).toBe(12)
      expect(batches[1][0].id).toBe(11)
      expect(batches[1][1].id).toBe(10)
    })

    it('finds in batches with MoreThanOrEqual filter on ordered column', async () => {
      const result = repository.findInBatches({
        where: { createdAt: MoreThanOrEqual(now) },
        order: { createdAt: 'ASC' }
      }, 2)

      const batches: MessageEntity[][] = []

      for await (const batch of result) {
        batches.push(batch)
      }

      expect(batches).toHaveLength(2)
      expect(batches[0]).toHaveLength(2)
      expect(batches[1]).toHaveLength(1)
      expect(batches[0][0].id).toBe(12)
      expect(batches[0][1].id).toBe(13)
      expect(batches[1][0].id).toBe(14)
    })

    it('finds in batches with LessThanOrEqual filter on ordered column', async () => {
      const result = repository.findInBatches({
        where: { createdAt: LessThanOrEqual(now) },
        order: { createdAt: 'ASC' }
      }, 2)

      const batches: MessageEntity[][] = []

      for await (const batch of result) {
        batches.push(batch)
      }

      expect(batches).toHaveLength(2)
      expect(batches[0]).toHaveLength(2)
      expect(batches[1]).toHaveLength(1)
      expect(batches[0][0].id).toBe(10)
      expect(batches[0][1].id).toBe(11)
      expect(batches[1][0].id).toBe(12)
    })

    it('finds in batches with Between filter on first column of multi-column order', async () => {
      const rangeFrom = new Date('2024-01-10T00:00:00Z')
      const rangeUntil = new Date('2024-01-20T23:59:59Z')

      const result = repository.findInBatches({
        where: { createdAt: Between(rangeFrom, rangeUntil) },
        order: { createdAt: 'ASC', id: 'ASC' }
      }, 2)

      const batches: MessageEntity[][] = []

      for await (const batch of result) {
        batches.push(batch)
      }

      expect(batches).toHaveLength(2)
      expect(batches[0]).toHaveLength(2)
      expect(batches[1]).toHaveLength(2)
      expect(batches[0][0].id).toBe(10)
      expect(batches[0][1].id).toBe(11)
      expect(batches[1][0].id).toBe(12)
      expect(batches[1][1].id).toBe(13)
    })

    it('finds in batches with disjunction where one clause has Between filter on ordered column', async () => {
      const rangeFrom = new Date('2024-01-10T00:00:00Z')
      const rangeUntil = new Date('2024-01-11T23:59:59Z')

      const result = repository.findInBatches({
        where: [
          { createdAt: Between(rangeFrom, rangeUntil) },
          { createdAt: MoreThanOrEqual(future1) }
        ],
        order: { createdAt: 'ASC' }
      }, 2)

      const batches: MessageEntity[][] = []

      for await (const batch of result) {
        batches.push(batch)
      }

      expect(batches).toHaveLength(2)
      expect(batches[0]).toHaveLength(2)
      expect(batches[1]).toHaveLength(2)
      expect(batches[0][0].id).toBe(10)
      expect(batches[0][1].id).toBe(11)
      expect(batches[1][0].id).toBe(13)
      expect(batches[1][1].id).toBe(14)
    })
  })
})
