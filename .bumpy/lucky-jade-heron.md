---
"@wisemen/pgboss-nestjs-job": minor
---

feat: rate-limited queues via bouncers backed by Redis

A queue's `@Bouncer` can now act as its rate limiter, gating `canProceed()` on shared
Redis state and learning from real HTTP traffic through `useRateLimiting(client, bouncer)`.
Three modes: `StaticRateLimitBouncer` (known budget per window), `HeaderRateLimitBouncer`
(mirrors the API's own `X-RateLimit-*` headers) and `FailureBackoffBouncer` (backs off only
after a failure). Throttled responses record a cooldown and throw `RateLimitError` so the
job retries once it clears. Which statuses count as throttling is configurable via
`throttleStatuses`, and a queue can hold instead of running unprotected when Redis is
unreachable via `onStoreUnavailable: StoreUnavailablePolicy.BLOCK`.
