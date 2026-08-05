# Changelog










## 1.3.0
<sub>2026-08-03</sub>

- [#1542](https://github.com/wisemen-digital/wisemen-core/pull/1542)  *(minor)* Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - feat: add maxInFlight option for NATS handlers

## 1.2.0
<sub>2026-08-02</sub>

- [#1539](https://github.com/wisemen-digital/wisemen-core/pull/1539)  *(minor)* Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - feat: add nats publisher with async publish jobs
- [#1539](https://github.com/wisemen-digital/wisemen-core/pull/1539)  *(minor)* Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - add configurable NATS outbox modules

## 1.1.4
<sub>2026-07-31</sub>

- [#1412](https://github.com/wisemen-digital/wisemen-core/pull/1412)  *(patch)* Thanks [@JonasVannieuwenhuijsen](https://github.com/JonasVannieuwenhuijsen)! - Added a way to publish on a stream

## 1.1.3
<sub>2026-07-29</sub>

- [#1518](https://github.com/wisemen-digital/wisemen-core/pull/1518)  *(patch)* Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - add class-validator json api error conversion

## 1.1.2
<sub>2026-07-28</sub>

- [#1505](https://github.com/wisemen-digital/wisemen-core/pull/1505)  *(patch)* Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - Updated the shared NestJS dependency catalog across affected API packages and fixed compatibility with newer `@nestjs/swagger` releases.

## 1.1.1
<sub>2026-07-13</sub>

- [#1417](https://github.com/wisemen-digital/wisemen-core/pull/1417)  *(patch)* Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - Added a shared NestJS provider explorer package and migrated existing packages to use it.

## 1.1.0
<sub>2026-07-08</sub>

- [#1380](https://github.com/wisemen-digital/wisemen-core/pull/1380)  *(minor)* Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - feat: remove `nkey` config on client, pass authenticator instead. Add optional callback on connection error.
- [#1381](https://github.com/wisemen-digital/wisemen-core/pull/1381)  *(patch)* Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - feat: handle service messages in parallel

## 1.0.0
<sub>2026-06-25</sub>

- [#1316](https://github.com/wisemen-digital/wisemen-core/pull/1316)  *(major)* Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - feat: self healing nats client

## 0.4.0
<sub>2026-06-18</sub>

- [#1222](https://github.com/wisemen-digital/wisemen-core/pull/1222)  *(minor)* Thanks [@PauwelsPieter](https://github.com/PauwelsPieter)! - Add nakBackoff option to @Consumer

## 0.3.6

### Patch Changes

- Updated dependencies [[`25a324e`](https://github.com/wisemen-digital/wisemen-core/commit/25a324e11461b545ead511f2e99a533be8e280d2)]:
  - @wisemen/opentelemetry@0.2.2

## 0.3.5

### Patch Changes

- Updated dependencies [[`5266dcc`](https://github.com/wisemen-digital/wisemen-core/commit/5266dcce66c1df54ba1fbccb831186800c8db66b)]:
  - @wisemen/api-error@1.0.0

## 0.3.4

### Patch Changes

- [#1155](https://github.com/wisemen-digital/wisemen-core/pull/1155) [`c195c82`](https://github.com/wisemen-digital/wisemen-core/commit/c195c82a932ed78db52480d87263edbf5da6370f) Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - feat(elt-95): remove data from nats span and add better span names

- Updated dependencies [[`baef816`](https://github.com/wisemen-digital/wisemen-core/commit/baef816c84226d2a17a780e26f844dc12e9c1b2c)]:
  - @wisemen/opentelemetry@0.2.1

## 0.3.3

### Patch Changes

- [#1110](https://github.com/wisemen-digital/wisemen-core/pull/1110) [`f37658c`](https://github.com/wisemen-digital/wisemen-core/commit/f37658c4c3e9089a98ca565f8631b0beb72d8feb) Thanks [@JonasVannieuwenhuijsen](https://github.com/JonasVannieuwenhuijsen)! - Added optional parameter for forbidNonWhitelisted validation and set default to false

## 0.3.2

### Patch Changes

- Updated dependencies [[`a191064`](https://github.com/wisemen-digital/wisemen-core/commit/a19106462da14b0fb4644bbcc666cdea48e4032b)]:
  - @wisemen/opentelemetry@0.2.0

## 0.3.1

### Patch Changes

- [#872](https://github.com/wisemen-digital/wisemen-core/pull/872) [`94518a4`](https://github.com/wisemen-digital/wisemen-core/commit/94518a48cacb22a41e78eca3090de2ce36445ac2) Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - fix: strip connection options

## 0.3.0

### Minor Changes

- [#869](https://github.com/wisemen-digital/wisemen-core/pull/869) [`dea871f`](https://github.com/wisemen-digital/wisemen-core/commit/dea871f8167868e8440ee145adfb8371f0f0de00) Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - feat: require connection parameter on decorators, remove default connection

## 0.2.1

### Patch Changes

- Updated dependencies [[`c448ae1`](https://github.com/wisemen-digital/wisemen-core/commit/c448ae1693045423b7959d7b2967b7e0a039f275)]:
  - @wisemen/opentelemetry@0.1.4
  - @wisemen/api-error@0.0.13

## 0.2.0

### Minor Changes

- [#835](https://github.com/wisemen-digital/wisemen-core/pull/835) [`d8c814a`](https://github.com/wisemen-digital/wisemen-core/commit/d8c814a4528d005655bf27a5500b9fd349632517) Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - fix: rename exports

## 0.1.1

### Patch Changes

- [#815](https://github.com/wisemen-digital/wisemen-core/pull/815) [`e335dd4`](https://github.com/wisemen-digital/wisemen-core/commit/e335dd4deefc337b17908c69837ab4ca86dbbde3) Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - release nestjs-nats

- Updated dependencies [[`4af27de`](https://github.com/wisemen-digital/wisemen-core/commit/4af27de58a8a6b47053bd65e682dccbb100ff290)]:
  - @wisemen/opentelemetry@0.1.3
