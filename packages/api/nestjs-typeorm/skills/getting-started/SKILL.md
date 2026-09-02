---
name: getting-started
description: Extended NestJS TypeOrmModule. Use when working with databases in NestJS applications.
---

## Import

```ts
import { TypeOrmModule, transaction, readonly, SnakeNamingStrategy, AnyOrIgnore, AndOrIgnore, InjectRepository } from '@wisemen/nestjs-typeorm'
```

### Use transaction-safe repositories

```ts
import { Injectable } from '@nestjs/common'
import { InjectRepository, transaction } from '@wisemen/nestjs-typeorm'
import { DataSource, Repository } from 'typeorm'

@Injectable()
export class CreateUserUseCase {
  constructor(
    private dataSource: DataSource,
    private repo: CreateUserRepository,
  ) {}

  async create(cmd: CreateUserCommand): Promise<void> {
    ...
    await transaction(this.dataSource, async () => {
      const user = await this.repo.insertUser(cmd)
      ...
    })
  }
}
```

`transaction()` uses AsyncLocalStorage to proxy all repository calls through the transaction's entity manager.

### Run work exclusively across application instances with a PostgreSQL advisory lock

Use `advisoryLock` for work that application instances must coordinate,
such as a scheduled import or cron job. It supports blocking and non-blocking
acquisition, exclusive and shared locks, and PostgreSQL's one- and two-key lock
forms.

Call it as `advisoryLock(dataSource, acquisition, mode, key, callback)` for a
single key, or `advisoryLock(dataSource, acquisition, mode,
namespace, key, callback)` for two keys.

```ts
import { tryAdvisoryLock } from '@wisemen/nestjs-typeorm'

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
  // Another instance is already doing this work.
  return
}

console.log(result.value)
```

`tryAdvisoryLock` always uses non-blocking acquisition. The callback runs only
when the lock is acquired. A contended lock returns `{ acquired: false }`; a
successful callback returns `{ acquired: true, value }`, so `null` and
`undefined` are safe callback values. Use `advisoryLock` with `'blocking'` to
wait for the lock and return the callback value directly.

Use `tryAdvisoryLock(dataSource, mode, key, callback)` for a non-blocking
single-key lock, or `tryAdvisoryLock(dataSource, mode, namespace, key,
callback)` for its two-key form. `advisoryLock` accepts the acquisition strategy
as its second argument and the lock mode as its third. Use `'shared'` when
concurrent holders may share the lock. Pass `namespace` and `key` as separate
arguments for PostgreSQL's two-key form. Both keys must be signed 32-bit
integers, and this form has a distinct key space from the single-key form. The
lock is released after the callback completes or throws.

### Perform readonly queries through separate readonly connection. Use when use case does not modify any data.

```ts
import { readonly } from '@wisemen/nestjs-typeorm'

const users = await readonly(this.dataSource, async () => {
  return this.userRepo.find()
})
```

### Batch processing with TypeOrmRepository

```ts
const generator = this.userRepo.findInBatches({ where: { isActive: true } }, 100)
for await (const user of generator) {
  // Process each batch
}
```

### AnyOrIgnore operator. Use when operator can be undefined (Query).

```ts
import { AnyOrIgnore } from '@wisemen/nestjs-typeorm'

const users = await this.userRepo.find({
  where: { role: AnyOrIgnore(filterRoles) },
})
```

### AndOrIgnore operator. Use when operators can be undefined (Query).

```ts
import { AndOrIgnore } from '@wisemen/nestjs-typeorm'

const users = await this.userRepo.find({
  where: { role: AndOrIgnore(filterRoles, helperThatCreatesOperator()) },
})
```
