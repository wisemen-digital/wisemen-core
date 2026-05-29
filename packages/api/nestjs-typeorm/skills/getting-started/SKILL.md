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

## Import

```ts
import {
  TypeOrmModule, transaction, readonly,
  SnakeNamingStrategy, AnyOrIgnore, InjectRepository
} from '@wisemen/nestjs-typeorm'
```

## Quick Start

### 1. Register TypeOrmModule

```ts
import { DynamicModule, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SnakeNamingStrategy, sslHelper, TypeOrmModule } from '@wisemen/nestjs-typeorm'

@Module({})
export class DefaultTypeOrmModule {
  static forRootAsync (
    options: {
      migrationsRun?: boolean
    }
  ): DynamicModule {
    const migrationsRun = options.migrationsRun ?? false

    return TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow('DB_HOST'),
        port: Number(configService.getOrThrow('DB_PORT')),
        username: configService.getOrThrow('DB_USERNAME'),
        password: configService.getOrThrow('DB_PASSWORD'),
        database: configService.getOrThrow('DB_NAME'),
        ssl: sslHelper(configService.getOrThrow('DB_SSL')),
        extra: { max: 50 },
        logging: false,
        synchronize: false,
        migrations: migrationsRun ? ['dist/src/sql/migrations/**/*.js'] : [],
        migrationsRun,
        entities: ['dist/src/**/*.entity.js'],
        namingStrategy: new SnakeNamingStrategy()
      }),
      inject: [ConfigService],
      customDataTypes: ['tstzrange3', 'tstzmultirange3']
    })
  }
}

```

### 2. Use transaction-safe repositories

```ts
import { Injectable } from '@nestjs/common'
import { InjectRepository, TypeOrmRepository, transaction } from '@wisemen/nestjs-typeorm'
import { DataSource } from 'typeorm'

@Injectable()
export class UserService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(UserEntity)
    private readonly userRepo: TypeOrmRepository<UserEntity>,
  ) {}

  async createWithProfile(userData: CreateUserDto): Promise<void> {
    await transaction(this.dataSource, async () => {
      const user = await this.userRepo.insert(userData)
      await this.userRepo.getOneOrFail({ where: { userId: user.id } })
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
const generator = this.userRepo.findInBatches({ where: { isActive: true } }, 100)
for await (const user of generator) {
  // Process each user
}
```

### 5. AnyOrIgnore operator

```ts
import { AnyOrIgnore } from '@wisemen/nestjs-typeorm'

const users = await this.userRepo.find({
  where: { role: AnyOrIgnore(filterRoles) },
})
```

Returns `undefined` (no filter) when the array is undefined, otherwise applies an `Any()` filter.

## Source Files

For full API details, read the source files.

- Extended module: `lib/extensions/module.ts`
- Repository: `lib/extensions/repository.ts`
- Transaction: `lib/extensions/transaction.ts`
- Readonly: `lib/extensions/readonly.ts`
- Naming strategy: `lib/naming/snake-case.naming-strategy.ts`
- AnyOrIgnore: `lib/operators/any-or-ignore.ts`
