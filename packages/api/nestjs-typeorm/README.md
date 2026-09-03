# @wisemen/nestjs-typeorm

NestJS and TypeORM utilities, including transaction-aware repositories,
read-only connection support, query helpers, and PostgreSQL advisory locks.

## Run Exclusive PostgreSQL Work

Use `advisoryLock` when application instances must coordinate work, such
as a scheduled import or singleton worker task. It supports blocking and
non-blocking acquisition, exclusive and shared locks, and PostgreSQL's one- and
two-key lock forms.

Call it as `advisoryLock(dataSource, acquisition, mode, key, callback)` for a
single key, or `advisoryLock(dataSource, acquisition, mode,
namespace, key, callback)` for two keys.

```ts
import { advisoryLock, tryAdvisoryLock } from '@wisemen/nestjs-typeorm'

const result = await tryAdvisoryLock(
  this.dataSource,
  'exclusive',
  42_001,
  async () => {
    await this.importUsers()
    return 'imported'
  }
)

if (!result.acquired) {
  // Another application instance is already importing users.
  return
}

console.log(result.value)
```

`tryAdvisoryLock` always uses non-blocking acquisition and PostgreSQL's
`pg_try_advisory_lock` functions. When another session holds an incompatible
lock, the callback is not called and the result is `{ acquired: false }`. A
successful callback is `{ acquired: true, value }`, so its value can safely be
`null` or `undefined`.

Pass `'blocking'` as the second argument when the caller should wait for the
lock. In this mode, the function returns the callback result directly.

```ts
await advisoryLock(
  this.dataSource,
  'blocking',
  'shared',
  7,
  42,
  async () => {
    await this.readSnapshot()
  }
)
```

Use `tryAdvisoryLock(dataSource, mode, key, callback)` for a non-blocking
single-key lock, or `tryAdvisoryLock(dataSource, mode, namespace, key,
callback)` for its two-key form. `advisoryLock` accepts the acquisition strategy
(`'blocking'` or `'non-blocking'`) as its second argument and the lock mode as
its third. Use `'shared'` when concurrent holders may share the lock; an
exclusive lock conflicts with both modes. The lock is released when the
callback completes or throws. This utility requires a PostgreSQL data source.

Choose a stable, unique safe-integer lock key for each exclusive operation.
Avoid using the same key for unrelated work because PostgreSQL advisory locks
share a database-wide key space. Pass `namespace` and `key` as separate
arguments for PostgreSQL's two signed-32-bit-integer key form; it uses a
distinct key space from the single-key form.
