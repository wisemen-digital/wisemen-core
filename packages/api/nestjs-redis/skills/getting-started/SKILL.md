---
name: getting-started
description: Redis client for NestJS. Use when caching in NestJS applications.
---

### Register the module

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

### Use RedisClient directly

```ts
import { Injectable } from '@nestjs/common'
import { RedisClient } from '@wisemen/nestjs-redis'

@Injectable()
export class ExampleCache extends RedisCache {
  readonly prefix = 'user'

  constructor(private readonly redis: RedisClient) {}

  async getCachedUser(uuid: UserUuid): Promise<User | null> {
    return this.redis.getCachedValue<User>(uuid)
  }

  async cacheUser(user: User): Promise<void> {
    await this.redis.putCachedValue(user.uuid, user, 3600)
  }
}
```
