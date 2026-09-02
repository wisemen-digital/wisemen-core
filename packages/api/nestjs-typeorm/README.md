# @wisemen/nestjs-typeorm

NestJS and TypeORM utilities, including transaction-aware repositories,
read-only connection support, query helpers, and PostgreSQL advisory locks.

## Run Exclusive PostgreSQL Work

Use `sessionAdvisoryLock` when only one database session may perform a piece of
work at a time, such as a scheduled import or singleton worker task. It tries
to acquire the lock without waiting.

```ts
import { sessionAdvisoryLock } from '@wisemen/nestjs-typeorm'

const result = await sessionAdvisoryLock(this.dataSource, 42_001, async () => {
  await this.importUsers()
  return 'imported'
})

if (result === null) {
  // Another application instance is already importing users.
  return
}
```

The callback runs only after the lock is acquired. If another session holds the
lock, the function returns `null` and does not call the callback. The lock is
released when the callback completes or throws. This utility requires a
PostgreSQL data source.

Choose a stable, unique safe-integer lock key for each exclusive operation.
Avoid using the same key for unrelated work because PostgreSQL advisory locks
share a database-wide key space. Do not return `null` from the callback when
the caller needs to distinguish successful work from lock contention.
