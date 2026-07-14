import type { DataSource, EntityManager } from 'typeorm'
import { isInReadonly, transactionStorage } from './context.js'

/**
 * Runs the provided callback inside a transaction and exposes the active transaction manager.
 *
 * If a transaction is already active, the callback is executed as a nested TypeORM transaction on
 * the current manager. Starting a transaction from inside a readonly context is rejected because
 * writes must not escape the readonly boundary. Within the callback, injected TypeORM repositories
 * automatically resolve against the active transaction manager, so repository operations join the
 * same transaction without requiring manual rebinding.
 *
 * @template T
 * @param dataSource The TypeORM data source used to start the transaction when none is active.
 * @param runInTransaction Async callback that receives the transaction-bound entity manager.
 * Injected TypeORM repositories used inside this callback automatically participate in the same
 * transaction context.
 * @returns The value returned by `runInTransaction`.
 * @throws {Error} If called while a readonly context is active.
 */
export async function transaction<T> (
  dataSource: DataSource,
  runInTransaction: (entityManager: EntityManager) => Promise<T>
): Promise<T> {
  if (isInReadonly()) {
    throw new Error('Cannot start a transaction inside a readonly context')
  }
  const transactionManager = transactionStorage.getStore()

  if (transactionManager != null) {
    return await transactionManager.transaction(runInTransaction)
  }

  return await dataSource.transaction(async (manager) => {
    return await transactionStorage.run(manager, async () => {
      return await runInTransaction(manager)
    })
  })
}

export function createTransactionManagerProxy (manager: EntityManager): EntityManager {
  return new Proxy(manager, {
    get (target, prop) {
      const manager = transactionStorage.getStore()

      if (manager != null) {
        return manager[prop] as unknown
      } else {
        return target[prop] as unknown
      }
    }
  })
}
