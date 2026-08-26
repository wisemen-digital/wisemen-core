# @wisemen/opentelemetry








## 0.3.0
<sub>2026-08-26</sub>

- [#1610](https://github.com/wisemen-digital/wisemen-core/pull/1610)  *(minor)* Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - Added explicit OpenTelemetry tracing, metrics, and SigNoz exporter configuration helpers.

## 0.2.8
<sub>2026-08-07</sub>

- [#1563](https://github.com/wisemen-digital/wisemen-core/pull/1563)  *(patch)* Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - release @wisemen/nestjs-throttler

## 0.2.7
<sub>2026-07-29</sub>

- [#1519](https://github.com/wisemen-digital/wisemen-core/pull/1519)  *(patch)* Thanks [@SebastiaanVanspauwen](https://github.com/SebastiaanVanspauwen)! - Added correct semantic convention and added more error options

## 0.2.6
<sub>2026-07-28</sub>

- [#1505](https://github.com/wisemen-digital/wisemen-core/pull/1505)  *(patch)* Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - Updated the shared NestJS dependency catalog across affected API packages and fixed compatibility with newer `@nestjs/swagger` releases.

## 0.2.5
<sub>2026-07-23</sub>

- [#1477](https://github.com/wisemen-digital/wisemen-core/pull/1477)  *(patch)* Thanks [@daanpersoons](https://github.com/daanpersoons)! - drop Redis key from span name to prevent cardinality explosion

## 0.2.4
<sub>2026-07-17</sub>

- [#1399](https://github.com/wisemen-digital/wisemen-core/pull/1399)  *(patch)* Thanks [@PauwelsPieter](https://github.com/PauwelsPieter)! - Add Nestjs otel logger

## 0.2.3
<sub>2026-06-30</sub>

- [#1332](https://github.com/wisemen-digital/wisemen-core/pull/1332)  *(patch)* Thanks [@sander-coemans](https://github.com/sander-coemans)! - Added UniciInstrumentation for requests using fetch api

## 0.2.2

### Patch Changes

- [#1156](https://github.com/wisemen-digital/wisemen-core/pull/1156) [`25a324e`](https://github.com/wisemen-digital/wisemen-core/commit/25a324e11461b545ead511f2e99a533be8e280d2) Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - feat: add attribute filter span processor

## 0.2.1

### Patch Changes

- [#1153](https://github.com/wisemen-digital/wisemen-core/pull/1153) [`baef816`](https://github.com/wisemen-digital/wisemen-core/commit/baef816c84226d2a17a780e26f844dc12e9c1b2c) Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - feat(elt-94): disable auto detect resources on NodeSDK

## 0.2.0

### Minor Changes

- [#991](https://github.com/wisemen-digital/wisemen-core/pull/991) [`a191064`](https://github.com/wisemen-digital/wisemen-core/commit/a19106462da14b0fb4644bbcc666cdea48e4032b) Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - Security updates: resolved npm vulnerabilities via pnpm overrides
  - Fixed critical protobufjs vulnerabilities (CVE: GHSA-xq3m-2v4x-88gg)
  - Fixed high severity vite vulnerabilities
  - Fixed high severity fastify vulnerability (CVE: GHSA-247c-9743-5963)
  - Fixed moderate follow-redirects vulnerability (CVE: GHSA-r4q5-vmmm-2653)
  - Fixed moderate fast-xml-parser vulnerability (CVE: GHSA-gh4j-gqv2-49f6)
  - Fixed moderate uuid vulnerability (CVE: GHSA-w5hq-g745-h8pq)

## 0.1.4

### Patch Changes

- [#840](https://github.com/wisemen-digital/wisemen-core/pull/840) [`c448ae1`](https://github.com/wisemen-digital/wisemen-core/commit/c448ae1693045423b7959d7b2967b7e0a039f275) Thanks [@SebastiaanVanspauwen](https://github.com/SebastiaanVanspauwen)! - Reduce trace noise by requiring parent trace for redis, and ignoring pg-connect for postgres.

## 0.1.3

### Patch Changes

- [#753](https://github.com/wisemen-digital/wisemen-core/pull/753) [`4af27de`](https://github.com/wisemen-digital/wisemen-core/commit/4af27de58a8a6b47053bd65e682dccbb100ff290) Thanks [@SebastiaanVanspauwen](https://github.com/SebastiaanVanspauwen)! - Add exception span when there is no parent span

## 0.1.2

### Patch Changes

- [#825](https://github.com/wisemen-digital/wisemen-core/pull/825) [`9701b57`](https://github.com/wisemen-digital/wisemen-core/commit/9701b572e17fe10813d592bb80d9440b0159540a) Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - bump dependencies

## 0.1.1

### Patch Changes

- [#793](https://github.com/wisemen-digital/wisemen-core/pull/793) [`46de4ba`](https://github.com/wisemen-digital/wisemen-core/commit/46de4bac68e067a502893133db357b6fc9898381) Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - Rework internal dependencies to non-peer dependencies
