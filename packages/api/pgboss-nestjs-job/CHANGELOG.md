# @wisemen/pgboss-nestjs-job

## 4.0.0

### Major Changes

- [#877](https://github.com/wisemen-digital/wisemen-core/pull/877) [`7ed8fad`](https://github.com/wisemen-digital/wisemen-core/commit/7ed8fad99f5a8833e3a2ace94584aaf2947baaf4) Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - feat!: support multiple queues per worker instance

  Breaking change: `PgBossWorkerModuleOptions` no longer accepts a single
  `queueName` and now expects the new multiple-queue configuration. The
  `bouncerModule` option was also removed/replaced.

  Migration: update worker configuration to use the new queues option shape
  and replace any usage of `bouncerModule` with the new configuration API.

  Bouncers are configured through the `@Bouncer("queue-name")` decorator.

## 3.3.6

### Patch Changes

- Updated dependencies [[`c448ae1`](https://github.com/wisemen-digital/wisemen-core/commit/c448ae1693045423b7959d7b2967b7e0a039f275)]:
  - @wisemen/opentelemetry@0.1.4
  - @wisemen/nestjs-typeorm@0.2.1

## 3.3.5

### Patch Changes

- Updated dependencies [[`4af27de`](https://github.com/wisemen-digital/wisemen-core/commit/4af27de58a8a6b47053bd65e682dccbb100ff290)]:
  - @wisemen/opentelemetry@0.1.3

## 3.3.4

### Patch Changes

- [#825](https://github.com/wisemen-digital/wisemen-core/pull/825) [`9701b57`](https://github.com/wisemen-digital/wisemen-core/commit/9701b572e17fe10813d592bb80d9440b0159540a) Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - bump dependencies

- Updated dependencies [[`9701b57`](https://github.com/wisemen-digital/wisemen-core/commit/9701b572e17fe10813d592bb80d9440b0159540a)]:
  - @wisemen/nestjs-typeorm@0.2.1
  - @wisemen/opentelemetry@0.1.2

## 3.3.3

### Patch Changes

- [#792](https://github.com/wisemen-digital/wisemen-core/pull/792) [`0f6efb2`](https://github.com/wisemen-digital/wisemen-core/commit/0f6efb266299e7067889a46ef74da93c503a1018) Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - TBN-890: add default onClientError behaviour to log message and allow onClientError handler in module options

- [#793](https://github.com/wisemen-digital/wisemen-core/pull/793) [`46de4ba`](https://github.com/wisemen-digital/wisemen-core/commit/46de4bac68e067a502893133db357b6fc9898381) Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - Rework internal dependencies to non-peer dependencies

- Updated dependencies [[`46de4ba`](https://github.com/wisemen-digital/wisemen-core/commit/46de4bac68e067a502893133db357b6fc9898381), [`e442406`](https://github.com/wisemen-digital/wisemen-core/commit/e442406b36bd0cf351d8e79d48798b98cf59372f)]:
  - @wisemen/nestjs-typeorm@0.2.0
  - @wisemen/opentelemetry@0.1.1

## 3.3.2

### Patch Changes

- c0d97a3: Add `runAndCaptureJobs` which delays scheduling of jobs in the given callback until after the callback
