import { DynamicModule, Module } from '@nestjs/common'
import { RateLimitConfigMap } from './rate-limit-config.js'
import { PgbossRateLimitRegistry } from './rate-limit.registry.js'
import { PgbossRateLimiter } from './rate-limiter.js'
import { RateLimitStore } from './rate-limit.store.js'
import { PostgresRateLimitStore } from './postgres-rate-limit.store.js'
import { RATE_LIMIT_LIMITS } from './rate-limit.tokens.js'

@Module({})
export class PgbossRateLimitModule {
  /**
   * @param limits central map of rate-limit key -> config. A job opts into a
   * limit with `super(data, { rateLimited: key })`. Defaults to `{}` so a worker
   * with no rate limits still resolves an (inert) limiter.
   */
  static forRoot (limits: RateLimitConfigMap = {}): DynamicModule {
    return {
      module: PgbossRateLimitModule,
      providers: [
        { provide: RATE_LIMIT_LIMITS, useValue: limits },
        PgbossRateLimitRegistry,
        PgbossRateLimiter,
        { provide: RateLimitStore, useClass: PostgresRateLimitStore }
      ],
      exports: [PgbossRateLimiter]
    }
  }
}
