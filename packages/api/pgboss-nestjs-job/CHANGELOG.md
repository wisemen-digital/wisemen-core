# @wisemen/pgboss-nestjs-job



## 5.0.0
<sub>2026-07-24</sub>

- [#1490](https://github.com/wisemen-digital/wisemen-core/pull/1490)  *(major)* Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - feat: remove serializable constraint from base job data
- [#1490](https://github.com/wisemen-digital/wisemen-core/pull/1490)  *(patch)* Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - feat: remove base job data

## 4.0.10
<sub>2026-07-13</sub>

- [#1417](https://github.com/wisemen-digital/wisemen-core/pull/1417)  *(patch)* Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - Added a shared NestJS provider explorer package and migrated existing packages to use it.

## 4.0.9

### Patch Changes

- Updated dependencies [[`25a324e`](https://github.com/wisemen-digital/wisemen-core/commit/25a324e11461b545ead511f2e99a533be8e280d2)]:
  - @wisemen/opentelemetry@0.2.2

## 4.0.8

### Patch Changes

- Updated dependencies [[`0bc5b42`](https://github.com/wisemen-digital/wisemen-core/commit/0bc5b42c8a9f15e696e01dc24b6fd228b6657405)]:
  - @wisemen/nestjs-typeorm@1.1.1

## 4.0.7

### Patch Changes

- Updated dependencies [[`23b823f`](https://github.com/wisemen-digital/wisemen-core/commit/23b823fd570e61b7d368b782e5330f9fd372e15d)]:
  - @wisemen/nestjs-typeorm@1.1.0

## 4.0.6

### Patch Changes

- Updated dependencies [[`0c248c2`](https://github.com/wisemen-digital/wisemen-core/commit/0c248c2b889d75496817e0fd5c8c5f217c1f9deb)]:
  - @wisemen/nestjs-typeorm@1.0.2

## 4.0.5

### Patch Changes

- Updated dependencies [[`baef816`](https://github.com/wisemen-digital/wisemen-core/commit/baef816c84226d2a17a780e26f844dc12e9c1b2c)]:
  - @wisemen/opentelemetry@0.2.1

## 4.0.4

### Patch Changes

- Updated dependencies [[`9f7b309`](https://github.com/wisemen-digital/wisemen-core/commit/9f7b3095e56284975d3b28e1ca1b4dfe25dc032f)]:
  - @wisemen/nestjs-typeorm@1.0.1

## 4.0.3

### Patch Changes

- [#1116](https://github.com/wisemen-digital/wisemen-core/pull/1116) [`c579547`](https://github.com/wisemen-digital/wisemen-core/commit/c579547eb4568b1e57c0edeaa6ec24fd931fd360) Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - feat: remove console logs from worker

## 4.0.2

### Patch Changes

- Updated dependencies [[`69126c5`](https://github.com/wisemen-digital/wisemen-core/commit/69126c58322d45bf1fb86220ced9301209509acb)]:
  - @wisemen/nestjs-typeorm@1.0.0

## 4.0.1

### Patch Changes

- Updated dependencies [[`a191064`](https://github.com/wisemen-digital/wisemen-core/commit/a19106462da14b0fb4644bbcc666cdea48e4032b)]:
  - @wisemen/opentelemetry@0.2.0

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
