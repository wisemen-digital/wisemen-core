# @wisemen/nestjs-throttler

Throttler module for NestJS applications.

## Register with in-memory storage

When no storage is configured, throttler state is kept in the application
process. This is suitable for single-instance applications and as a local
safeguard. Each process has its own limits and loses them when it restarts.

```ts
import { Module } from '@nestjs/common'
import { ApiThrottlerModule } from '@wisemen/nestjs-throttler'

@Module({
  imports: [
    ApiThrottlerModule.forRoot({
      throttler: {
        limit: 120,
        ttl: 60_000
      }
    })
  ],
  exports: [ApiThrottlerModule]
})
export class DefaultApiThrottlerModule {}
```

## Register with Redis storage

Use shared storage when limits must apply across multiple application
instances.

```ts
import { Module } from '@nestjs/common'
import { RedisClient } from '@wisemen/nestjs-redis'
import {
  ApiThrottlerModule,
  RedisThrottlerStorage
} from '@wisemen/nestjs-throttler'
import { DefaultRedisModule } from '#src/modules/redis/default-redis.module.js'

@Module({
  imports: [
    ApiThrottlerModule.forRootAsync({
      imports: [DefaultRedisModule], // <- a configured @wisemen/nestjs-redis module
      inject: [RedisClient],
      useFactory: (redisClient: RedisClient) => {
        return {
          storage: new RedisThrottlerStorage(redisClient),
          throttler: {}
        }
      }
    })
  ],
  exports: [ApiThrottlerModule]
})
export class DefaultApiThrottlerModule {}
```

## Configure user aware throttlers

```ts
import { Injectable, type NestMiddleware } from '@nestjs/common'
import type { FastifyRequest, FastifyReply } from 'fastify'
import { UnauthorizedApiError } from '@wisemen/api-error'
import { FeatureFlagContext } from '@wisemen/nestjs-feature-flags'
import { UserThrottlerContext } from '@wisemen/nestjs-throttler'
import { AuthenticationService } from '#src/modules/auth/services/authentication.service.js'
import { AuthContext } from '#src/modules/auth/auth.context.js'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor (
    private authContext: AuthContext,
    private flagContext: FeatureFlagContext,
    private throttlerContext: UserThrottlerContext, // <- inject throttler context
    private authenticationService: AuthenticationService
  ) { }

  async use (req: FastifyRequest, _res: FastifyReply, next: () => void): Promise<void> {
    try {
      const auth = await this.authenticationService
        .fromAuthorizationHeader(req.headers.authorization)

      function chainNext (...wrappers: Array<(next: () => void) => void>) {
        return wrappers.reduceRight((next, wrap) => () => wrap(() => next))
      }

      chainNext(
        next => this.authContext.runWithAuthorization(auth, next),
        next => this.throttlerContext.run({ id: auth.userUuid }, next), // <- provide id bound to user
        next => this.flagContext.run({ userUuid: auth.userUuid }, next)
      )(next)
    } catch (error) {
      if (error instanceof UnauthorizedApiError) {
        this.authContext.runWithError(error, next)
      } else {
        throw error
      }
    }
  }
}

```
