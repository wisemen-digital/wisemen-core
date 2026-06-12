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