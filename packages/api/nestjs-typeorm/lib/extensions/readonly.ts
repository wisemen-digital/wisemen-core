import type { DataSource, EntityManager } from 'typeorm'
import { QueryRunnerProviderAlreadyReleasedError } from 'typeorm'
import { isInTransaction, readonlyStorage } from './context.js'
import assert from 'node:assert'

/**
 * Runs the provided callback in a readonly database context backed by a slave query runner.
 *
 * If a readonly context is already active, the callback is reused within that context instead of
 * creating a new query runner. Starting a readonly context from inside a transaction is rejected
 * because it would break the current transactional guarantees. Within the callback, injected
 * TypeORM repositories automatically resolve against the active readonly manager, so repository
 * operations also use the readonly query runner without requiring manual rebinding.
 *
 * @template T
 * @param dataSource The TypeORM data source used to create the readonly query runner.
 * @param runInReadonly Async callback that receives the readonly entity manager for all database
 * access. Injected TypeORM repositories used inside this callback automatically participate in the
 * same readonly context.
 * @returns The value returned by `runInReadonly`.
 * @throws {Error} If called while a transaction context is active.
 * @throws {QueryRunnerProviderAlreadyReleasedError} If the current readonly context references a released query runner.
 */
export async function readonly<T> (
  dataSource: DataSource,
  runInReadonly: (entityManager: EntityManager) => Promise<T>
): Promise<T> {
  if (isInTransaction()) {
    throw new Error('Cannot start a readonly context inside a transaction')
  }

  const existing = readonlyStorage.getStore()
  if (existing?.queryRunner != null && existing.queryRunner.isReleased) {
    throw new QueryRunnerProviderAlreadyReleasedError()
  }

  if (existing != null) {
    assert(existing.queryRunner !== undefined, 'existing readonly without queryRunner')
    return await runInReadonly(existing.queryRunner.manager)
  }

  const queryRunner = dataSource.createQueryRunner('slave')

  try {
    const callback = async () => await runInReadonly(queryRunner.manager)
    return await readonlyStorage.run(queryRunner.manager, callback)
  } finally {
    await queryRunner.release()
  }
}

export function createReadonlyManagerProxy (defaultManager: EntityManager): EntityManager {
  return new Proxy(defaultManager, {
    get (target, prop) {
      const manager = readonlyStorage.getStore()

      if (manager != null) {
        if (prop === 'transaction') {
          return (() => {
            throw new Error('Cannot call EntityManager.transaction inside a readonly context')
          }) as unknown
        }

        return manager[prop] as unknown
      }

      return target[prop] as unknown
    }
  })
}
