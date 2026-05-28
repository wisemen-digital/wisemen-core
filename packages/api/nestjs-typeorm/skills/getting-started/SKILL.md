---
name: getting-started
description: >
  Extended TypeOrmModule with transaction-safe repository proxies via AsyncLocalStorage,
  readonly query mode, SnakeNamingStrategy, batch queries, and the AnyOrIgnore operator.
type: lifecycle
library: nestjs-typeorm
exports:
  - TypeOrmModule
  - TypeOrmRepository
  - transaction
  - readonly
  - SnakeNamingStrategy
  - AnyOrIgnore
  - InjectRepository
---

# @wisemen/nestjs-typeorm — Getting Started

TypeORM extensions for NestJS with transaction-safe repository proxies, readonly mode, snake_case naming, and batch query utilities.

## When to Use

- Setting up TypeORM in NestJS with automatic snake_case column naming
- Running queries inside transactions with automatic repository proxying
- Processing large datasets in batches with async generators

**Use instead:** Plain `@nestjs/typeorm` when you don't need transaction proxying or batch utilities.

## Import

```ts
import {
  TypeOrmModule, transaction, readonly,
  SnakeNamingStrategy, AnyOrIgnore,
} from '@wisemen/nestjs-typeorm'
import { InjectRepository } from '@wisemen/nestjs-typeorm'
```

## Quick Start

### 1. Register TypeOrmModule

```ts
import { Module } from '@nestjs/common'
import { TypeOrmModule, SnakeNamingStrategy } from '@wisemen/nestjs-typeorm'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        namingStrategy: new SnakeNamingStrategy(),
        entities: [UserEntity],
      }),
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
})
export class AppModule {}
```

### 2. Use transaction-safe repositories

```ts
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { transaction } from '@wisemen/nestjs-typeorm'
import { DataSource, Repository } from 'typeorm'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async createWithProfile(userData: CreateUserDto): Promise<void> {
    await transaction(this.dataSource, async (em) => {
      const user = await em.getRepository(UserEntity).save(userData)
      await em.getRepository(ProfileEntity).save({ userId: user.id })
    })
  }
}
```

`transaction()` uses AsyncLocalStorage to proxy all repository calls through the transaction's entity manager.

### 3. Readonly queries

```ts
import { readonly } from '@wisemen/nestjs-typeorm'

const users = await readonly(this.dataSource, async () => {
  return this.userRepo.find()
})
```

### 4. Batch processing

```ts
for await (const batch of this.userRepo.findInBatches({}, 100)) {
  for (const user of batch) {
    // Process each user
  }
}
```

### 5. AnyOrIgnore operator

```ts
import { AnyOrIgnore } from '@wisemen/nestjs-typeorm'

const users = await this.userRepo.find({
  where: { role: AnyOrIgnore(filterRoles) },
})
```

Returns `undefined` (no filter) when the array is empty or undefined, otherwise applies an `In()` filter.

## Source Files

For full API details, read the source files.

- Extended module: `lib/extensions/module.ts`
- Repository: `lib/extensions/repository.ts`
- Transaction: `lib/extensions/transaction.ts`
- Readonly: `lib/extensions/readonly.ts`
- Naming strategy: `lib/naming/snake-case.naming-strategy.ts`
- AnyOrIgnore: `lib/operators/any-or-ignore.ts`
