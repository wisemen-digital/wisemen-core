import { DynamicModule, Global, Module } from '@nestjs/common'
import { RedisModule } from '@wisemen/nestjs-redis'
import { RedisRateLimitStore } from './redis-rate-limit.store.js'

type RedisForRootOptions = Parameters<typeof RedisModule.forRoot>[0]
type RedisForRootAsyncOptions = Parameters<typeof RedisModule.forRootAsync>[0]

/**
 * Wires the Redis-backed rate-limit store on its own connection. `@Global` so `@Bouncer`
 * classes in feature modules can inject the store without importing this everywhere.
 *
 * ```ts
 * PgbossRateLimitModule.forRoot({ url: 'redis://localhost:6379' })
 * ```
 */
@Global()
@Module({})
export class PgbossRateLimitModule {
  static forRoot (options: RedisForRootOptions): DynamicModule {
    return {
      module: PgbossRateLimitModule,
      imports: [RedisModule.forRoot(options)],
      providers: [RedisRateLimitStore],
      exports: [RedisRateLimitStore]
    }
  }

  static forRootAsync (options: RedisForRootAsyncOptions): DynamicModule {
    return {
      module: PgbossRateLimitModule,
      imports: [RedisModule.forRootAsync(options)],
      providers: [RedisRateLimitStore],
      exports: [RedisRateLimitStore]
    }
  }
}
