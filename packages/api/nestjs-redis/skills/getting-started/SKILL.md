---
name: getting-started
description: Use when configuring Redis caching in NestJS APIs.
---

# @wisemen/nestjs-redis - Getting Started

Use `RedisModule.forRootAsync(...)` to register a shared Redis client, then
extend `RedisCache` for scoped keys and inject `RedisClient` for reads and
writes.

## Register The Module

```ts
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { captureException } from '@wisemen/opentelemetry'
import { RedisModule } from '@wisemen/nestjs-redis'

@Module({
  imports: [RedisModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      url: config.getOrThrow('REDIS_URL'),
      pingInterval: config.get('REDIS_PING_INTERVAL'),
      ttl: config.get('REDIS_DEFAULT_TTL'),
      onClientError: (error) => {
        captureException(error)
      }
    })
  })],
  exports: [RedisModule]
})
export class DefaultRedisModule {}
```

## Create A Cache Service

```ts
import { Injectable } from '@nestjs/common'
import { RedisCache, RedisClient } from '@wisemen/nestjs-redis'

@Injectable()
export class ExampleCache extends RedisCache {
  readonly prefix = 'user'

  constructor(private readonly redis: RedisClient) {}

  async getCachedUser(uuid: UserUuid): Promise<User | null> {
    return this.redis.getCachedValue<User>(this.buildCacheKey(uuid))
  }

  async cacheUser(user: User): Promise<void> {
    await this.redis.putCachedValue(this.buildCacheKey(user.uuid), user, 3600)
  }
}
```

Use `RedisClient.client` only when you need raw Redis commands that the cache
helpers do not cover.
