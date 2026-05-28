---
name: bouncers
description: >
  Gate job processing with @Bouncer decorator and PgbossBouncer base class. Prevents
  a worker from polling a queue when external conditions are not met (e.g., downstream
  service unhealthy, feature flag disabled).
type: feature
library: pgboss-nestjs-job
requires:
  - getting-started
exports:
  - PgbossBouncer
  - Bouncer
---

# @wisemen/pgboss-nestjs-job — Bouncers

Conditionally pause job processing for a specific queue by implementing a health check that runs before each poll cycle.

## When to Use

- Pausing job processing when an external service is down (payment gateway, email provider)
- Gating queue polling on feature flags or rate limits
- Preventing wasted retries when a downstream dependency is known to be unavailable

**Use instead:** Job-level retry logic when failures are transient and per-job, not systemic.

## Import

```ts
import { PgbossBouncer, Bouncer } from '@wisemen/pgboss-nestjs-job'
```

## Quick Start

```ts
import { PgbossBouncer, Bouncer } from '@wisemen/pgboss-nestjs-job'

@Bouncer('payment-processing')
export class PaymentServiceBouncer extends PgbossBouncer {
  constructor(private readonly paymentService: PaymentService) {
    super()
  }

  async canProceed(): Promise<boolean> {
    try {
      await this.paymentService.healthCheck()
      return true
    } catch {
      return false
    }
  }
}
```

Register the bouncer as a provider in the same module as the worker. The `@Bouncer` decorator automatically applies `@Injectable()`. When `canProceed()` returns `false`, the worker skips polling that queue until the next cycle. If no bouncer is registered for a queue, all jobs are processed (default `AllowBouncer`).

## Source Files

For full API details, read the source files.

- Bouncer base class: `lib/worker/pgboss-bouncer.ts`
- Decorator: `lib/worker/pgboss-bouncer.decorator.ts`
- Registry: `lib/worker/pgboss-bouncer.registry.ts`

## See Also

- [getting-started](../getting-started/SKILL.md) -- Set up the worker module and define jobs
