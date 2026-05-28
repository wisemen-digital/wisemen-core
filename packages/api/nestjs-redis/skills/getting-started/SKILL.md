---
name: getting-started
description: >
  Register RedisModule, inject RedisClient for key-value caching with TTL, and create
  typed cache services by extending RedisCache with a scoped key prefix.
type: lifecycle
library: nestjs-redis
exports:
  - RedisModule
  - RedisClient
  - RedisCache
  - RedisUnavailableError
---

# @wisemen/nestjs-redis — Getting Started

Redis-backed caching for NestJS with a type-safe client, TTL support, and an abstract base class for scoped cache services.

## When to Use

- Adding key-value caching to a NestJS application
- Building typed cache services scoped by a key prefix
- Caching expensive computations or external API responses

**Use instead:** Direct `redis` package when you need pub/sub, streams, or other Redis features beyond caching.

## Import

```ts
import { RedisModule, RedisClient, RedisCache } from '@wisemen/nestjs-redis'
```

## Quick Start

### 1. Register the module

```ts
import { Module } from '@nestjs/common'
import { RedisModule } from '@wisemen/nestjs-redis'

@Module({
  imports: [
    RedisModule.forRoot({
      url: process.env.REDIS_URL,
      ttl: 7200,
    }),
  ],
})
export class AppModule {}
```

### 2. Use RedisClient directly

```ts
import { Injectable } from '@nestjs/common'
import { RedisClient } from '@wisemen/nestjs-redis'

@Injectable()
export class UserService {
  constructor(private readonly redis: RedisClient) {}

  async getCachedUser(id: string): Promise<User | null> {
    return this.redis.getCachedValue<User>(`user:${id}`)
  }

  async cacheUser(id: string, user: User): Promise<void> {
    await this.redis.putCachedValue(`user:${id}`, user, 3600)
  }
}
```

### 3. Create a typed cache service

```ts
import { Injectable } from '@nestjs/common'
import { RedisCache } from '@wisemen/nestjs-redis'

@Injectable()
export class RoleCache extends RedisCache {
  readonly prefix = 'roles'

  async getRole(userId: string): Promise<Role | null> {
    return this.redis.getCachedValue<Role>(this.buildCacheKey(userId))
  }

  async setRole(userId: string, role: Role): Promise<void> {
    await this.redis.putCachedValue(this.buildCacheKey(userId), role)
  }
}
```

`RedisCache.buildCacheKey(id)` prepends the prefix, producing keys like `roles:userId123`.

## Source Files

For full API details, read the source files.

- Module: `lib/redis.module.ts`
- Client: `lib/redis.client.ts`
- Cache base class: `lib/redis-cache.ts`
- Error: `lib/redis-unavailable.error.ts`
- Constants: `lib/redis.constant.ts`
