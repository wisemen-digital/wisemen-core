# @wisemen/nestjs-typeorm







## 1.2.4
<sub>2026-08-27</sub>

- [#1626](https://github.com/wisemen-digital/wisemen-core/pull/1626)  *(patch)* Thanks [@maartensijmkens](https://github.com/maartensijmkens)! - Quantity add delta class to disable addition and multiplication with temperature

## 1.2.3
<sub>2026-07-28</sub>

- [#1505](https://github.com/wisemen-digital/wisemen-core/pull/1505)  *(patch)* Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - Updated the shared NestJS dependency catalog across affected API packages and fixed compatibility with newer `@nestjs/swagger` releases.

## 1.2.2
<sub>2026-07-22</sub>

- [#1471](https://github.com/wisemen-digital/wisemen-core/pull/1471)  *(patch)* Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - fix: expose insert types

## 1.2.1
<sub>2026-07-15</sub>

- [#1435](https://github.com/wisemen-digital/wisemen-core/pull/1435)  *(patch)* Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - feat: add entitymanager to readonly callback

## 1.2.0
<sub>2026-07-08</sub>

- [#1217](https://github.com/wisemen-digital/wisemen-core/pull/1217)  *(minor)* Thanks [@maartensijmkens](https://github.com/maartensijmkens)! - add support for embedded and relations with insert type
- [#1217](https://github.com/wisemen-digital/wisemen-core/pull/1217)  *(patch)* Thanks [@maartensijmkens](https://github.com/maartensijmkens)! - add support for embbeded and relations on entityInsert type

## 1.1.2
<sub>2026-06-25</sub>

- [#1314](https://github.com/wisemen-digital/wisemen-core/pull/1314)  *(patch)* Thanks [@SebastiaanVanspauwen](https://github.com/SebastiaanVanspauwen)! - Add custom data types before initializing datasource

## 1.1.1

### Patch Changes

- [#1190](https://github.com/wisemen-digital/wisemen-core/pull/1190) [`0bc5b42`](https://github.com/wisemen-digital/wisemen-core/commit/0bc5b42c8a9f15e696e01dc24b6fd228b6657405) Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - feat(TBN-1200): add AndOrIgnore FindOperator

## 1.1.0

### Minor Changes

- [`23b823f`](https://github.com/wisemen-digital/wisemen-core/commit/23b823fd570e61b7d368b782e5330f9fd372e15d) Thanks [@jorenvandeweyer](https://github.com/jorenvandeweyer)! - Add array support to `createAndInsert` — passing an array now returns `Promise<T[]>` and inserts all entities in a single call

## 1.0.2

### Patch Changes

- [#1162](https://github.com/wisemen-digital/wisemen-core/pull/1162) [`0c248c2`](https://github.com/wisemen-digital/wisemen-core/commit/0c248c2b889d75496817e0fd5c8c5f217c1f9deb) Thanks [@jorenvandeweyer](https://github.com/jorenvandeweyer)! - Add `createAndInsert` method to TypeORM repository extension

## 1.0.1

### Patch Changes

- [#1053](https://github.com/wisemen-digital/wisemen-core/pull/1053) [`9f7b309`](https://github.com/wisemen-digital/wisemen-core/commit/9f7b3095e56284975d3b28e1ca1b4dfe25dc032f) Thanks [@jorenvandeweyer](https://github.com/jorenvandeweyer)! - Add createAndInsert function on TypeOrm repository

## 1.0.0

### Major Changes

- [#1099](https://github.com/wisemen-digital/wisemen-core/pull/1099) [`69126c5`](https://github.com/wisemen-digital/wisemen-core/commit/69126c58322d45bf1fb86220ced9301209509acb) Thanks [@senne-vanreusel](https://github.com/senne-vanreusel)! - Added support for typeorm v1.0.0

## 0.2.1

### Patch Changes

- [#825](https://github.com/wisemen-digital/wisemen-core/pull/825) [`9701b57`](https://github.com/wisemen-digital/wisemen-core/commit/9701b572e17fe10813d592bb80d9440b0159540a) Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - bump dependencies

## 0.2.0

### Minor Changes

- [#776](https://github.com/wisemen-digital/wisemen-core/pull/776) [`e442406`](https://github.com/wisemen-digital/wisemen-core/commit/e442406b36bd0cf351d8e79d48798b98cf59372f) Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - feat(TBN-819): move time column to time package

### Patch Changes

- [#793](https://github.com/wisemen-digital/wisemen-core/pull/793) [`46de4ba`](https://github.com/wisemen-digital/wisemen-core/commit/46de4bac68e067a502893133db357b6fc9898381) Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - Rework internal dependencies to non-peer dependencies
