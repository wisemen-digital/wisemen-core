import { Inject, Injectable, Logger } from '@nestjs/common'
import { RateLimitConfig, RateLimitConfigMap } from './rate-limit-config.js'
import { RateLimitStrategy } from './rate-limit.strategy.js'
import { RATE_LIMIT_LIMITS } from './rate-limit.tokens.js'
import { FailureBackoffStrategy } from './strategies/failure-backoff.strategy.js'
import { HeaderRateStrategy } from './strategies/header-rate.strategy.js'
import { StaticRateStrategy } from './strategies/static-rate.strategy.js'

/**
 * Holds the central rate-limit config supplied via `PgbossRateLimitModule.forRoot`
 * and builds one strategy per key. Keyed entirely by rate-limit key — jobs carry
 * that key as their group id, so no job-class discovery is needed.
 */
@Injectable()
export class PgbossRateLimitRegistry {
  private readonly logger = new Logger(PgbossRateLimitRegistry.name)
  private readonly keyToConfig = new Map<string, RateLimitConfig>()
  private readonly keyToStrategy = new Map<string, RateLimitStrategy>()

  constructor (@Inject(RATE_LIMIT_LIMITS) limits: RateLimitConfigMap) {
    for (const [key, config] of Object.entries(limits)) {
      this.keyToConfig.set(key, config)
      this.keyToStrategy.set(key, this.buildStrategy(config))
      this.logger.log(`Registered rate limit '${key}' (${config.source})`)
    }
  }

  getStrategy (key: string): RateLimitStrategy | undefined {
    return this.keyToStrategy.get(key)
  }

  getConfig (key: string): RateLimitConfig | undefined {
    return this.keyToConfig.get(key)
  }

  getAllKeys (): string[] {
    return [...this.keyToStrategy.keys()]
  }

  private buildStrategy (config: RateLimitConfig): RateLimitStrategy {
    switch (config.source) {
      case 'static':
        return new StaticRateStrategy(config)
      case 'headers':
        return new HeaderRateStrategy(config)
      case 'failure':
        return new FailureBackoffStrategy(config)
    }
  }
}
