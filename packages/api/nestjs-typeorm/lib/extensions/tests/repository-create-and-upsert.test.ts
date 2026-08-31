import { after, before, beforeEach, describe, it } from 'node:test'
import { expect } from 'expect'
import { dataSource } from './sql/datasource.js'
import { UpsertableEntity } from './sql/entities/upsertable.entity.js'
import { TypeOrmRepository } from '#src/extensions/repository.js'

describe('Repository create and upsert test', () => {
  let repository: TypeOrmRepository<UpsertableEntity>

  before(async () => {
    await dataSource.initialize()
    await dataSource.synchronize(true)

    repository = new TypeOrmRepository(UpsertableEntity, dataSource.manager)
  })

  beforeEach(async () => {
    await repository.clear()
  })

  after(async () => {
    await dataSource.destroy()
  })

  it('inserts a plain object and returns it as an entity', async () => {
    const entity = await repository.createAndUpsert({ key: 'a', value: 1 }, ['key'])

    expect(entity).toBeInstanceOf(UpsertableEntity)
    expect(entity.key).toBe('a')

    const stored = await repository.findOneByOrFail({ key: 'a' })

    expect(stored.value).toBe(1)
  })

  it('updates the conflicting row instead of inserting a second one', async () => {
    await repository.createAndUpsert({ key: 'a', value: 1 }, ['key'])
    await repository.createAndUpsert({ key: 'a', value: 2 }, ['key'])

    const stored = await repository.find()

    expect(stored).toHaveLength(1)
    expect(stored[0].value).toBe(2)
  })

  it('accepts an entity instance and returns the same instance', async () => {
    const entity = repository.create({ key: 'b', value: 1 })
    const result = await repository.createAndUpsert(entity, ['key'])

    expect(result).toBe(entity)

    const stored = await repository.findOneByOrFail({ key: 'b' })

    expect(stored.value).toBe(1)
  })

  it('upserts an array, inserting and updating in one call', async () => {
    await repository.createAndUpsert({ key: 'a', value: 1 }, ['key'])

    const entities = await repository.createAndUpsert([
      { key: 'a', value: 2 },
      { key: 'b', value: 3 }
    ], ['key'])

    expect(entities).toHaveLength(2)
    expect(entities[0]).toBeInstanceOf(UpsertableEntity)

    const stored = await repository.find({ order: { key: 'ASC' } })

    expect(stored.map(e => [e.key, e.value])).toEqual([['a', 2], ['b', 3]])
  })

  it('accepts UpsertOptions as well as conflict paths', async () => {
    await repository.createAndUpsert({ key: 'a', value: 1 }, ['key'])
    await repository.createAndUpsert(
      { key: 'a', value: 2 },
      { conflictPaths: ['key'], skipUpdateIfNoValuesChanged: true }
    )

    const stored = await repository.findOneByOrFail({ key: 'a' })

    expect(stored.value).toBe(2)
  })
})
