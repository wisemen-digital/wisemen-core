import { after, before, describe, it } from 'node:test'
import { expect } from 'expect'
import { LessThan, MoreThanOrEqual } from 'typeorm'
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

  describe('Test addBatchingToSelect', () => {
    let userRepo: TypeOrmRepository<UserEntity>
    let messageRepo: TypeOrmRepository<MessageEntity>
    before(async () => {
      userRepo = new TypeOrmRepository(UserEntity, dataSource.manager)
      messageRepo = new TypeOrmRepository(MessageEntity, dataSource.manager)

      await userRepo.insert([
        { id: 1, name: 'Alice', age: 25 },
        { id: 2, name: 'Bob', age: 30 },
        { id: 3, name: 'Charlie', age: 28 },
        { id: 4, name: 'Diana', age: 22 },
        { id: 5, name: 'Eve', age: 35 }
      ])
    })

    it('select omits primary key — key is injected so cursor pagination works', async () => {
      const result = userRepo.findInBatches({ select: { name: true }, where: {} }, 2)

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

    it('select is undefined — all columns returned and batching works', async () => {
      const result = userRepo.findInBatches({ where: {} }, 2)

      const batches: UserEntity[][] = []

      for await (const batch of result) {
        batches.push(batch)
      }

      expect(batches).toHaveLength(3)
      expect(batches[0][0]).toMatchObject({ id: 1, name: 'Alice', age: 25 })
      expect(batches[0][1]).toMatchObject({ id: 2, name: 'Bob', age: 30 })
      expect(batches[1][0]).toMatchObject({ id: 3, name: 'Charlie', age: 28 })
      expect(batches[2][0]).toMatchObject({ id: 5, name: 'Eve', age: 35 })
    })

    it('select already includes the primary key — no duplication, batching works', async () => {
      const result = userRepo.findInBatches({ select: { id: true, name: true }, where: {} }, 2)

      const batches: UserEntity[][] = []

      for await (const batch of result) {
        batches.push(batch)
      }

      expect(batches).toHaveLength(3)
      expect(batches[0][0].name).toBe('Alice')
      expect(batches[2][0].name).toBe('Eve')
    })

    it('custom order key is injected into select so cursor comparison works', async () => {
      const result = userRepo.findInBatches({ select: { age: true }, where: {}, order: { name: 'ASC' } }, 2)

      const batches: UserEntity[][] = []

      for await (const batch of result) {
        batches.push(batch)
      }

      expect(batches).toHaveLength(3)
      expect(batches[0][0].name).toBe('Alice')
      expect(batches[0][1].name).toBe('Bob')
      expect(batches[1][0].name).toBe('Charlie')
      expect(batches[1][1].name).toBe('Diana')
      expect(batches[2][0].name).toBe('Eve')
      expect(batches[0][0].age).toBe(25)
    })
  })

})
