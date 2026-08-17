import { DynamicModule, FactoryProvider, Module, ModuleMetadata } from '@nestjs/common'

import { APP_GUARD } from '@nestjs/core'
import { ThrottlerModule, ThrottlerOptions } from '@nestjs/throttler'
import { RedisClient } from '@wisemen/nestjs-redis'
import { RedisThrottlerStorage } from './redis-throttler.storage.js'
import { API_DEFAULT_THROTTLE_LIMIT } from './api-throttler.constant.js'
import { UserThrottlerGuard } from './user-throttler.guard.js'
import { UserThrottlerContext } from './user-throttler.context.js'

export interface ApiThrottlerOptions {
  /**
   * A redis client used to store throttler data.
   */
  redisClient: RedisClient
  
  /**
   * Throttler configuration.
   * TTL defaults to 1 minute.
   * Limit defaults to 120 requests
   */
  throttler: Partial<ThrottlerOptions>
}

/** Async registration options for ApiThrottlerModule */
export interface ApiThrottlerAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: unknown[]) => Promise<ApiThrottlerOptions> | ApiThrottlerOptions
  inject?: FactoryProvider['inject']
}

@Module({})
export class ApiThrottlerModule {
  static forRootAsync (options: ApiThrottlerAsyncOptions): DynamicModule {
    return {
      module: ApiThrottlerModule,
      imports: [
        ThrottlerModule.forRootAsync({
          imports: options.imports,
          inject: options.inject,
          useFactory: async (...args: unknown[]) => {
            const {throttler, redisClient} = await options.useFactory(...args)
            
            return {
              throttlers: [{
                ttl: throttler.ttl ?? API_DEFAULT_THROTTLE_LIMIT,
                limit: throttler.limit ?? API_DEFAULT_THROTTLE_LIMIT
              }],
              storage: new RedisThrottlerStorage(redisClient) 
            }
          }
        })
      ],
      providers: [
        UserThrottlerContext,
        {
          provide: APP_GUARD,
          useClass: UserThrottlerGuard
        }
      ],
      exports: [
        UserThrottlerContext
      ]
    }
  }
}
