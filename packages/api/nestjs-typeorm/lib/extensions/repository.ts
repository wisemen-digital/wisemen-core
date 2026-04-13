import { And, type EntityManager, type EntityTarget, Equal, FindOneOptions, FindOperator, FindOptionsOrder, FindOptionsSelect, FindOptionsSelectByString, FindOptionsWhere, LessThan, MoreThan, ObjectLiteral, Repository } from 'typeorm'
import { createTransactionManagerProxy } from './transaction.js'
import { createReadonlyManagerProxy } from './readonly.js'

export class TypeOrmRepository<T extends ObjectLiteral> extends Repository <T> {
  constructor (entity: EntityTarget<T>, manager: EntityManager) {
    const proxy = createTransactionManagerProxy(createReadonlyManagerProxy(manager))

    super(entity, proxy)
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
    select: FindOptionsSelect<T> | FindOptionsSelectByString<T> | undefined,
    order: FindOptionsOrder<T>
  ): FindOptionsSelect<T> | FindOptionsSelectByString<T> | undefined {
    if (select === undefined) {
      return select
    }

    const keys = Object.keys(order)

    if (Array.isArray(select)) {
      return [...new Set([...select, ...keys])]
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
      const preceedingKeys = keys.slice(0, i)
      const preceedingKeysLastEntityValues = keysLastEntityValues.slice(0, i)

      const preceedingKeysWhere = Object.fromEntries(
        preceedingKeys.map((k, i) => [k, preceedingKeysLastEntityValues[i]])
      )

      const clause = {
        ...where,
        ...preceedingKeysWhere,
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
