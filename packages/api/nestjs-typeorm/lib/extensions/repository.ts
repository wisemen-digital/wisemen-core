import { And, DeepPartial, type EntityManager, type EntityTarget, Equal, FindOneOptions, FindOperator, FindOptionsOrder, FindOptionsSelect, FindOptionsWhere, LessThan, MoreThan, ObjectLiteral, ObjectType, QueryDeepPartialEntity, Repository, type UpsertOptions } from 'typeorm'
import { createTransactionManagerProxy } from './transaction.js'
import { createReadonlyManagerProxy } from './readonly.js'

export class TypeOrmRepository<T extends ObjectLiteral> extends Repository <T> {
  constructor (entity: EntityTarget<T>, manager: EntityManager) {
    const proxy = createTransactionManagerProxy(createReadonlyManagerProxy(manager))

    super(entity, proxy)
  }

  async createAndInsert (entityLike: DeepPartial<T> | T): Promise<T>
  async createAndInsert (entityLike: Array<DeepPartial<T> | T>): Promise<T[]>
  async createAndInsert (entityLike: DeepPartial<T> | T | Array<DeepPartial<T> | T>): Promise<T | T[]> {
    if (Array.isArray(entityLike)) {
      const EntityClass = this.target as ObjectType<T>

      const entities = entityLike.map(item =>
        item instanceof EntityClass ? item as T : this.create(item as DeepPartial<T>)
      )

      await this.insert(entities as QueryDeepPartialEntity<T>[])

      return entities
    }

    const EntityClass = this.target as ObjectType<T>
    const isEntity = entityLike instanceof EntityClass

    if (isEntity) {
      await this.insert(entityLike as QueryDeepPartialEntity<T>)

      return entityLike as T
    } else {
      const entity = this.create(entityLike)

      await this.insert(entity as QueryDeepPartialEntity<T>)

      return entity
    }
  }

  /**
   * Upsert counterpart of {@link createAndInsert}.
   *
   * `upsert` takes `QueryDeepPartialEntity<T>`, which recurses through every relation of `T`. On a
   * large, cyclic entity graph TypeScript exhausts its comparison budget and rejects a perfectly
   * valid entity. Taking `DeepPartial<T> | T` here keeps that type off the call site.
   */
  async createAndUpsert (
    entityLike: DeepPartial<T> | T,
    conflictPathsOrOptions: string[] | UpsertOptions<T>
  ): Promise<T>
  async createAndUpsert (
    entityLike: Array<DeepPartial<T> | T>,
    conflictPathsOrOptions: string[] | UpsertOptions<T>
  ): Promise<T[]>
  async createAndUpsert (
    entityLike: DeepPartial<T> | T | Array<DeepPartial<T> | T>,
    conflictPathsOrOptions: string[] | UpsertOptions<T>
  ): Promise<T | T[]> {
    const EntityClass = this.target as ObjectType<T>

    if (Array.isArray(entityLike)) {
      const entities = entityLike.map(item =>
        item instanceof EntityClass ? item as T : this.create(item as DeepPartial<T>)
      )

      await this.upsert(entities as QueryDeepPartialEntity<T>[], conflictPathsOrOptions)

      return entities
    }

    const entity = entityLike instanceof EntityClass
      ? entityLike as T
      : this.create(entityLike)

    await this.upsert(entity as QueryDeepPartialEntity<T>, conflictPathsOrOptions)

    return entity
  }

  async findNextBatch (
    options: FindOneOptions<T>,
    batchSize: number,
    lastEntity: Partial<T> | undefined
  ): Promise<T[]> {
    const primaryKeys = this.metadata.primaryColumns.map(column => column.propertyName)
    const order = this.addBatchingToOrder(options.order, primaryKeys)
    const select = this.addBatchingToSelect(options.select, order)
    const where = this.addBatchingToWhere(options.where, order, lastEntity)

    return await this.find({
      ...options,
      select,
      where,
      order,
      take: batchSize
    })
  }

  async* findInBatches (
    options: FindOneOptions<T>,
    batchSize: number
  ): AsyncGenerator<T[], void, void> {
    let entities: T[] = []
    let lastEntity: T | undefined = undefined

    do {
      entities = await this.findNextBatch(options, batchSize, lastEntity)

      if (entities.length === 0) return

      yield entities

      lastEntity = entities.at(-1)
    } while (entities.length === batchSize)
  }

  findByInBatches (
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    batchSize: number
  ): AsyncGenerator<T[], void, void> {
    return this.findInBatches({ where }, batchSize)
  }

  private addBatchingToOrder (
    order: FindOptionsOrder<T> | undefined,
    keys: string[]
  ): FindOptionsOrder<T> {
    const batchOrder = Object.fromEntries(
      keys.map(key => [key, order?.[key] ?? 'ASC'])
    )

    return {
      ...order,
      ...batchOrder
    } as FindOptionsOrder<T>
  }

  private addBatchingToSelect (
    select: FindOptionsSelect<T> | undefined,
    order: FindOptionsOrder<T>
  ): FindOptionsSelect<T> | undefined {
    if (select === undefined) {
      return select
    }

    const keys = Object.keys(order)

    if (Array.isArray(select)) {
      return Array.from(new Set([...select, ...keys])) as FindOptionsSelect<T>
    }

    return {
      ...select,
      ...Object.fromEntries(keys.map(key => [key, true]))
    }
  }

  private addBatchingToWhere (
    where: FindOptionsWhere<T> | FindOptionsWhere<T>[] | undefined,
    order: FindOptionsOrder<T>,
    lastEntity?: Partial<T>
  ): FindOptionsWhere<T> | FindOptionsWhere<T>[] | undefined {
    if (lastEntity === undefined) {
      return where
    }

    if (Array.isArray(where)) {
      return where.flatMap(whereClause =>
        this.addBatchConditionToWhereClause(whereClause, order, lastEntity)
      )
    }

    return this.addBatchConditionToWhereClause(where, order, lastEntity)
  }

  private addBatchConditionToWhereClause (
    where: FindOptionsWhere<T> | undefined,
    order: FindOptionsOrder<T>,
    lastEntity: Partial<T>
  ): FindOptionsWhere<T>[] {
    const [keys, keysLastEntityValues] = this.getLastEntityEntriesForOrder(order, lastEntity)
    const clauses: FindOptionsWhere<T>[] = []

    for (let i = keys.length - 1; i >= 0; i--) {
      const key = keys[i]
      const keyLastEntityValue = keysLastEntityValues[i]
      const precedingKeys = keys.slice(0, i)
      const precedingKeysLastEntityValues = keysLastEntityValues.slice(0, i)

      const precedingKeysWhere = Object.fromEntries(
        precedingKeys.map((k, i) => [k, precedingKeysLastEntityValues[i]])
      )

      const clause = {
        ...where,
        ...precedingKeysWhere,
        [key]: this.getKeyCondition(where, order, key, keyLastEntityValue)
      } as FindOptionsWhere<T>

      clauses.push(clause)
    }

    return clauses
  }

  private getLastEntityEntriesForOrder (
    order: FindOptionsOrder<T>,
    lastEntity: Partial<T>
  ): [string[], unknown[]] {
    const keys = Object.keys(order)
    const entityKeys = Object.keys(lastEntity)

    if (!keys.every(key => entityKeys.includes(key))) {
      throw new Error(`entity must include at least following properties: ${keys.join(', ')}`)
    }

    const keysValues = keys.map(key => lastEntity[key] as unknown)

    return [keys, keysValues]
  }

  private getKeyCondition (
    where: FindOptionsWhere<T> | undefined,
    order: FindOptionsOrder<T> | undefined,
    key: string,
    keyLastEntityValue: unknown
  ): FindOperator<unknown> {
    const existingCondition = where?.[key]
    const batchCondition = order?.[key] === 'ASC' ? MoreThan(keyLastEntityValue) : LessThan(keyLastEntityValue)

    if (existingCondition === undefined) {
      return batchCondition
    } else if (existingCondition instanceof FindOperator) {
      return And(batchCondition, existingCondition)
    } else {
      return And(batchCondition, Equal(existingCondition))
    }
  }
}
