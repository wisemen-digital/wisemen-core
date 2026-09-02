import { DataSource } from 'typeorm'


/**
 * Attempts to run a callback while holding a PostgreSQL session-level advisory lock.
 *
 * The lock is acquired on a dedicated query runner, so it remains associated with the
 * same database session for the entire callback. If another session already holds the
 * lock, the callback is not called and this function returns `null` immediately.
 *
 * The lock is released after the callback settles, including when it throws. Errors
 * from the callback or database operations are propagated to the caller.
 * When `T` includes `null`, a successful `null` callback result cannot be
 * distinguished from lock contention.
 *
 * @typeParam T - The value returned by the callback.
 * @param dataSource - The PostgreSQL TypeORM data source used to create the lock-owning session.
 * @param lock - A safe-integer PostgreSQL advisory-lock key.
 * @param callback - Work to execute only when the lock is acquired.
 * @returns The callback result when the lock is acquired, or `null` when it is held by another session.
 */
export async function sessionAdvisoryLock<T>(
  dataSource: DataSource,
  lock: number,
  callback: () => Promise<T>
): Promise<T | null> {
  const queryRunner = dataSource.createQueryRunner()

  try {
    const result: unknown = await queryRunner.query('SELECT pg_try_advisory_lock($1) AS locked', [lock])

    if (!hasAcquiredSessionAdvisoryLock(result)) {
      return null
    }

    try {
      return await callback()
    } finally {
      await queryRunner.query('SELECT pg_advisory_unlock($1)', [lock])
    }
  } finally {
    await queryRunner.release()
  }
}

/**
 * Checks whether a raw PostgreSQL advisory-lock query result indicates success.
 */
function hasAcquiredSessionAdvisoryLock(result: unknown): boolean {
  if (!isUnknownArray(result)) {
    return false
  }

  const row = result[0]

  return typeof row === 'object' && row !== null && 'locked' in row && row.locked === true
}

/**
 * Narrows an unknown value to an array without introducing `any` at the query boundary.
 */
function isUnknownArray(value: unknown): value is unknown[] {
  return Array.isArray(value)
}
