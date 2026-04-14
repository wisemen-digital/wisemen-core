# @wisemen/nestjs-redis

A NestJS module for connecting to Redis built on top of [redis](https://github.com/redis/node-redis).

## Installation

```bash
pnpm add @wisemen/nestjs-redis
```

## Usage

### Setting up the module

Create a dedicated module that configures `RedisModule` and re-exports it across your application.

```typescript
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { captureException } from '@wisemen/opentelemetry'
import { RedisModule } from '@wisemen/nestjs-redis'

@Module({
  imports: [
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        url: config.getOrThrow('REDIS_URL'),
        pingInterval: config.get('REDIS_PING_INTERVAL'),
        ttl: config.get('REDIS_DEFAULT_TTL'),
        onClientError: (error) => {
          captureException(error)
        }
      })
    })
  ]
  exports: [RedisModule]
})
export class DefaultRedisModule {}
```

### Creating a cache service

Extend `RedisCache` to build scoped cache services. Inject `RedisClient` directly for raw access.

```typescript
import { Injectable } from '@nestjs/common'
import { RedisCache, RedisClient } from '@wisemen/nestjs-redis'

@Injectable()
export class RoleCache extends RedisCache {
  override readonly prefix = 'role'

  constructor(private readonly redis: RedisClient) {
    super()
  }

  async getRole(id: string): Promise<string | null> {
    return this.redis.client.get(this.buildCacheKey(id))
  }

  async setRole(id: string, value: string): Promise<void> {
    await this.redis.client.set(this.buildCacheKey(id), value, {
      EX: this.redis.ttl,
    })
  }
}
```

### Registering a cache module

```typescript
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DefaultRedisModule } from './default-redis.module.js'
import { Role } from './role.entity.js'
import { RoleCache } from './role.cache.js'

@Module({
  imports: [
    DefaultRedisModule,
    TypeOrmModule.forFeature([Role]),
  ],
  providers: [RoleCache],
  exports: [RoleCache],
})
export class RoleCacheModule {}
```
