---
"@wisemen/pgboss-nestjs-job": major
---
feat!: support multiple queues per worker instance

Breaking change: `PgBossWorkerModuleOptions` no longer accepts a single
`queueName` and now expects the new multiple-queue configuration. The
`bouncerModule` option was also removed/replaced.

Migration: update worker configuration to use the new queues option shape
and replace any usage of `bouncerModule` with the new configuration API.

Bouncers are configured through the `@Bouncer("queue-name")` decorator.
