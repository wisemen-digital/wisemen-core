import type { DataSource, EntityManager } from 'typeorm'
import { QueryRunnerProviderAlreadyReleasedError } from 'typeorm'
import { isInTransaction, readonlyStorage } from './context.js'

export async function readonly<T> (
  dataSource: DataSource,
  fn: () => Promise<T>
): Promise<T> {
  // Disallow starting a readonly scope while in a transaction
  if (isInTransaction()) {
    throw new Error('Cannot start a readonly context inside a transaction')
  }
  const existing = readonlyStorage.getStore()

  if (existing?.queryRunner != null && existing.queryRunner.isReleased) {
    throw new QueryRunnerProviderAlreadyReleasedError()
  }

  if (existing != null) {
    return await fn()
  }

  const queryRunner = dataSource.createQueryRunner('slave')

  try {
    return await readonlyStorage.run(queryRunner.manager, fn)
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
