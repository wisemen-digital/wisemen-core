import { DataSource } from 'typeorm'

/**
 * A PostgreSQL advisory-lock key, using either its single-key or two-key form.
 * A single key must be a int64.
 * A two key form must be int32, int32.
 */
export type SessionAdvisoryLockKey = number | { namespace: number, key: number }

/** Whether a session-level advisory lock is exclusive or may be shared. */
export type SessionAdvisoryLockMode = 'excl' | 'shared'
export type SessionAdvisoryLockAcquisition = 'blocking' | 'try-lock'

/** The outcome of attempting to acquire a non-blocking session-level advisory lock. */
export type SessionAdvisoryLockResult<T> =
  | { acquired: false }
  | { acquired: true, value: T }

/** Options for a session-level advisory lock that waits until it is acquired. */
export type BlockingSessionAdvisoryLockOptions = {
  acquisition: 'blocking'
  /** Defaults to exclusive */
  mode?: SessionAdvisoryLockMode
}

/** Options for a session-level advisory lock that returns immediately when it is held. */
export type NonBlockingSessionAdvisoryLockOptions = {
  acquisition: 'non-blocking'
  /** Defaults to exclusive */
  mode?: SessionAdvisoryLockMode
}

type SessionAdvisoryLockQueryKey = 'singleKey' | 'twoKeys'

const SESSION_ADVISORY_LOCK_QUERIES = {
  blocking: {
    excl: {
      singleKey: {
        acquire: 'SELECT pg_advisory_lock($1)',
        release: 'SELECT pg_advisory_unlock($1)'
      },
      twoKeys: {
        acquire: 'SELECT pg_advisory_lock($1, $2)',
        release: 'SELECT pg_advisory_unlock($1, $2)'
      }
    },
    shared: {
      singleKey: {
        acquire: 'SELECT pg_advisory_lock_shared($1)',
        release: 'SELECT pg_advisory_unlock_shared($1)'
      },
      twoKeys: {
        acquire: 'SELECT pg_advisory_lock_shared($1, $2)',
        release: 'SELECT pg_advisory_unlock_shared($1, $2)'
      }
    }
  },
  'try-lock': {
    excl: {
      singleKey: {
        acquire: 'SELECT pg_try_advisory_lock($1) AS locked',
        release: 'SELECT pg_advisory_unlock($1)'
      },
      twoKeys: {
        acquire: 'SELECT pg_try_advisory_lock($1, $2) AS locked',
        release: 'SELECT pg_advisory_unlock($1, $2)'
      }
    },
    shared: {
      singleKey: {
        acquire: 'SELECT pg_try_advisory_lock_shared($1) AS locked',
        release: 'SELECT pg_advisory_unlock_shared($1)'
      },
      twoKeys: {
        acquire: 'SELECT pg_try_advisory_lock_shared($1, $2) AS locked',
        release: 'SELECT pg_advisory_unlock_shared($1, $2)'
      }
    }
  }
} as const

/**
 * Runs a callback while holding a PostgreSQL session-level advisory lock identified by one key.
 *
 * @typeParam T - The value returned by the callback.
 * @param dataSource - The PostgreSQL TypeORM data source used to create the lock-owning session.
 * @param acquisition - Whether to wait for the lock or return immediately when it is held.
 * @param mode - Whether the lock is exclusive or shared.
 * @param key - The single PostgreSQL advisory-lock key.
 * @param callback - Work to execute after the lock is acquired.
 */
export function advisoryLock<T>(
  dataSource: DataSource,
  acquisition: 'try-lock',
  mode: SessionAdvisoryLockMode,
  key: number,
  callback: () => Promise<T> | T
): Promise<SessionAdvisoryLockResult<T>>
/**
 * Runs a callback while holding a PostgreSQL session-level advisory lock identified by two keys.
 *
 * @typeParam T - The value returned by the callback.
 * @param dataSource - The PostgreSQL TypeORM data source used to create the lock-owning session.
 * @param acquisition - Whether to wait for the lock or return immediately when it is held.
 * @param mode - Whether the lock is exclusive or shared.
 * @param namespace - The first key, used as the application's lock namespace.
 * @param key - The second PostgreSQL advisory-lock key within the namespace.
 * @param callback - Work to execute after the lock is acquired.
 */
export function advisoryLock<T>(
  dataSource: DataSource,
  acquisition: 'try-lock',
  mode: SessionAdvisoryLockMode,
  namespace: number,
  key: number,
  callback: () => Promise<T> | T
): Promise<SessionAdvisoryLockResult<T>>
/**
 * Runs a callback while holding a blocking PostgreSQL session-level advisory lock identified by one key.
 *
 * @typeParam T - The value returned by the callback.
 * @param dataSource - The PostgreSQL TypeORM data source used to create the lock-owning session.
 * @param acquisition - Waits for the lock; must be `'blocking'`.
 * @param mode - Whether the lock is exclusive or shared.
 * @param key - The single PostgreSQL advisory-lock key.
 * @param callback - Work to execute after the lock is acquired.
 */
export function advisoryLock<T>(
  dataSource: DataSource,
  acquisition: 'blocking',
  mode: SessionAdvisoryLockMode,
  key: number,
  callback: () => Promise<T> | T
): Promise<T>
/**
 * Runs a callback while holding a blocking PostgreSQL session-level advisory lock identified by two keys.
 *
 * @typeParam T - The value returned by the callback.
 * @param dataSource - The PostgreSQL TypeORM data source used to create the lock-owning session.
 * @param acquisition - Waits for the lock; must be `'blocking'`.
 * @param mode - Whether the lock is exclusive or shared.
 * @param namespace - The first key, used as the application's lock namespace.
 * @param key - The second PostgreSQL advisory-lock key within the namespace.
 * @param callback - Work to execute after the lock is acquired.
 */
export function advisoryLock<T>(
  dataSource: DataSource,
  acquisition: 'blocking',
  mode: SessionAdvisoryLockMode,
  namespace: number,
  key: number,
  callback: () => Promise<T> | T
): Promise<T>
export async function advisoryLock<T>(
  dataSource: DataSource,
  acquisition: SessionAdvisoryLockAcquisition,
  mode: SessionAdvisoryLockMode,
  namespaceOrKey: number,
  keyOrCallback: number | (() => Promise<T> | T),
  callback?: () => Promise<T> | T
): Promise<T | SessionAdvisoryLockResult<T>> {
  const queryRunner = dataSource.createQueryRunner()
  const queryKey = getSessionAdvisoryLockQueryKey(keyOrCallback)
  const queries = SESSION_ADVISORY_LOCK_QUERIES[acquisition][mode][queryKey]
  const values = getSessionAdvisoryLockValues(namespaceOrKey, keyOrCallback)
  callback ??= keyOrCallback as (() => Promise<T> | T)

  try {
    const result: unknown = await queryRunner.query(queries.acquire, values)

    if (acquisition === 'try-lock' && !hasAcquiredSessionAdvisoryLock(result)) {
      return { acquired: false }
    }

    try {
      const value = await callback()

      return acquisition === 'try-lock' ? { acquired: true, value } : value
    } finally {
      await queryRunner.query(queries.release, values)
    }
  } finally {
    await queryRunner.release()
  }
}

/**
 * Attempts to run a callback while holding a PostgreSQL session-level advisory lock identified by one key.
 *
 * @typeParam T - The value returned by the callback.
 * @param dataSource - The PostgreSQL TypeORM data source used to create the lock-owning session.
 * @param mode - Whether the lock is exclusive or shared.
 * @param key - The single PostgreSQL advisory-lock key.
 * @param callback - Work to execute after the lock is acquired.
 */
export function tryAdvisoryLock<T>(
  dataSource: DataSource,
  mode: SessionAdvisoryLockMode,
  key: number,
  callback: () => Promise<T> | T
): Promise<SessionAdvisoryLockResult<T>>
/**
 * Attempts to run a callback while holding a PostgreSQL session-level advisory lock identified by two keys.
 *
 * @typeParam T - The value returned by the callback.
 * @param dataSource - The PostgreSQL TypeORM data source used to create the lock-owning session.
 * @param mode - Whether the lock is exclusive or shared.
 * @param namespace - The first key, used as the application's lock namespace.
 * @param key - The second PostgreSQL advisory-lock key within the namespace.
 * @param callback - Work to execute after the lock is acquired.
 */
export function tryAdvisoryLock<T>(
  dataSource: DataSource,
  mode: SessionAdvisoryLockMode,
  namespace: number,
  key: number,
  callback: () => Promise<T> | T
): Promise<SessionAdvisoryLockResult<T>>
export function tryAdvisoryLock<T>(
  dataSource: DataSource,
  mode: SessionAdvisoryLockMode,
  namespaceOrKey: number,
  keyOrCallback: number | (() => Promise<T> | T),
  callback?: () => Promise<T> | T
): Promise<SessionAdvisoryLockResult<T>> {
  if (typeof keyOrCallback === 'number') {
    return advisoryLock(
      dataSource,
      'try-lock',
      mode,
      namespaceOrKey,
      keyOrCallback,
      callback as () => Promise<T> | T
    )
  }

  return advisoryLock(dataSource, 'try-lock', mode, namespaceOrKey, keyOrCallback)
}

/** Returns the query-table key for a PostgreSQL advisory-lock key shape. */
function getSessionAdvisoryLockQueryKey(
  keyOrCallback: number | (() => unknown)
): SessionAdvisoryLockQueryKey {
  return typeof keyOrCallback === 'number' ? 'twoKeys' : 'singleKey'
}

/** Returns the bind values for a PostgreSQL advisory-lock key. */
function getSessionAdvisoryLockValues(
  keyOrNamespace: number,
  keyOrCallback: number | (() => unknown)
): number[] {
  return typeof keyOrCallback === 'number' ? [keyOrNamespace, keyOrCallback] : [keyOrNamespace]
}

/** Checks whether a raw PostgreSQL advisory-lock query result indicates success. */
function hasAcquiredSessionAdvisoryLock(result: unknown): boolean {
  if (!isUnknownArray(result)) {
    return false
  }

  const row = result[0]

  return typeof row === 'object' && row !== null && 'locked' in row && row.locked === true
}

/** Narrows an unknown value to an array without introducing `any` at the query boundary. */
function isUnknownArray(value: unknown): value is unknown[] {
  return Array.isArray(value)
}
