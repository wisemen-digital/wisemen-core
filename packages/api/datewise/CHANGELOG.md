# @wisemen/datewise

## 1.0.2

### Patch Changes

- [#1085](https://github.com/wisemen-digital/wisemen-core/pull/1085) [`8be066b`](https://github.com/wisemen-digital/wisemen-core/commit/8be066be205affe4b1bf8b5221ee9756ce22b1e8) Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - feat: add duration getter on `DateTimeRange`

## 1.0.1

### Patch Changes

- [#1059](https://github.com/wisemen-digital/wisemen-core/pull/1059) [`a26da5a`](https://github.com/wisemen-digital/wisemen-core/commit/a26da5a8af508d7021cf00dea23ecd74f49a3396) Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - feat: add EndsBeforeOrAt and StartsAfertOrAt typeorm operators'

- Updated dependencies [[`bd0ed26`](https://github.com/wisemen-digital/wisemen-core/commit/bd0ed260d360559ca551f70e383e9c7ff7591113), [`f659833`](https://github.com/wisemen-digital/wisemen-core/commit/f65983333ed3cb8d2a16129d082d1fa482655853)]:
  - @wisemen/quantity@0.7.0

## 1.0.0

### Major Changes

- [#1019](https://github.com/wisemen-digital/wisemen-core/pull/1019) [`46f65c4`](https://github.com/wisemen-digital/wisemen-core/commit/46f65c4a777e18cafd7845d16684f69ccb0022d1) Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - rework: `StartsAfter` and `EndsBefore` typeorm operators to work on timestamps / plaindates instead of ranges

- [#1014](https://github.com/wisemen-digital/wisemen-core/pull/1014) [`ba4b6c7`](https://github.com/wisemen-digital/wisemen-core/commit/ba4b6c7473388aa828e171e9856277b02f3d0c9a) Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - feat: add `expanded` on `DateRange` and `DateTimeRange` to symmetrically move both boundaries outwards by a specified duration
  feat: add `addDuration` and `subtractDuration` on `PlainDate`
  rework: rename `setFrom` and similar methods to `withFrom` to better indicate the immutability of the instances

## 0.1.19

### Patch Changes

- [#1006](https://github.com/wisemen-digital/wisemen-core/pull/1006) [`c2ea224`](https://github.com/wisemen-digital/wisemen-core/commit/c2ea2242cda60150f6fb0365d0b01d0a50c31369) Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - fix: add overload for from factory method on responses

## 0.1.18

### Patch Changes

- [#998](https://github.com/wisemen-digital/wisemen-core/pull/998) [`0e17410`](https://github.com/wisemen-digital/wisemen-core/commit/0e174107e7bbdca69f1cc7deef2fe24c1118e921) Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - feat: allow caller specified inclusivity on parse of range dtos
  feat: add static `from` factory function which deals with `null` types on range responses

## 0.1.17

### Patch Changes

- [#996](https://github.com/wisemen-digital/wisemen-core/pull/996) [`b0a5b64`](https://github.com/wisemen-digital/wisemen-core/commit/b0a5b6420787d3865713d0753c71bb3d7434be1c) Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - fix: make type of ContainedIn a generic for Date or Timestamp

## 0.1.16

### Patch Changes

- [#992](https://github.com/wisemen-digital/wisemen-core/pull/992) [`02c8997`](https://github.com/wisemen-digital/wisemen-core/commit/02c89977034deb52b8ed4e7012dbbda3897668e1) Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - fix: add overload for Date in ContainedIn

## 0.1.15

### Patch Changes

- [#989](https://github.com/wisemen-digital/wisemen-core/pull/989) [`f9cb344`](https://github.com/wisemen-digital/wisemen-core/commit/f9cb34483a1f3d8613851079ecc859b5a68b5cc3) Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - fix: allow Date columns in ContainedIn

## 0.1.14

### Patch Changes

- [#982](https://github.com/wisemen-digital/wisemen-core/pull/982) [`7543996`](https://github.com/wisemen-digital/wisemen-core/commit/754399631d3a1df3182b104b94db25ac7931225f) Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - feat: add ContainedIn typeorm operator

## 0.1.13

### Patch Changes

- [#958](https://github.com/wisemen-digital/wisemen-core/pull/958) [`cb28106`](https://github.com/wisemen-digital/wisemen-core/commit/cb28106428925abacac5e7934405b61a580d7033) Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - feat: add new `compare` method to PlainTime, PlainDate, Timestamp, DateRange and DateTimeRange to assist in `sort` calls

## 0.1.12

### Patch Changes

- [#897](https://github.com/wisemen-digital/wisemen-core/pull/897) [`14da59c`](https://github.com/wisemen-digital/wisemen-core/commit/14da59c9ef1dc462a3a54a5d20224f8a7d17ce75) Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - feat: add isStrictlyBefore and isStrictlyAfter to DateTimeRange and DateRange to support range order comparissions

## 0.1.11

### Patch Changes

- [#845](https://github.com/wisemen-digital/wisemen-core/pull/845) [`c7942ae`](https://github.com/wisemen-digital/wisemen-core/commit/c7942ae90807975f02f077b7346ac36ca590c925) Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - feat: add incl and excl upper and lower getters

- Updated dependencies []:
  - @wisemen/pagination@0.1.1
  - @wisemen/quantity@0.6.1

## 0.1.10

### Patch Changes

- [#825](https://github.com/wisemen-digital/wisemen-core/pull/825) [`9701b57`](https://github.com/wisemen-digital/wisemen-core/commit/9701b572e17fe10813d592bb80d9440b0159540a) Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - bump dependencies

- Updated dependencies [[`9701b57`](https://github.com/wisemen-digital/wisemen-core/commit/9701b572e17fe10813d592bb80d9440b0159540a)]:
  - @wisemen/pagination@0.1.1
  - @wisemen/quantity@0.6.1

## 0.1.9

### Patch Changes

- Updated dependencies [[`959c850`](https://github.com/wisemen-digital/wisemen-core/commit/959c850769865c477309253bde938de94fe2f63f)]:
  - @wisemen/pagination@0.1.0
  - @wisemen/quantity@0.6.0

## 0.1.8

### Patch Changes

- [#817](https://github.com/wisemen-digital/wisemen-core/pull/817) [`d3c7794`](https://github.com/wisemen-digital/wisemen-core/commit/d3c7794a6843db18f2c057bd3a2b4c47e6d6f65b) Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - support construction of plain date with format

## 0.1.7

### Patch Changes

- Updated dependencies [[`8c1e355`](https://github.com/wisemen-digital/wisemen-core/commit/8c1e355e000ec830d383c89261e5edbf5850dee8), [`1308fb4`](https://github.com/wisemen-digital/wisemen-core/commit/1308fb4e12a24d4ddaf4d1a72cecd9ac342d29be)]:
  - @wisemen/quantity@0.5.0

## 0.1.6

### Patch Changes

- Updated dependencies [[`b4ada66`](https://github.com/wisemen-digital/wisemen-core/commit/b4ada66c9c9f5c43f1c897d27214854a776493e3)]:
  - @wisemen/quantity@0.4.1
  - @wisemen/pagination@0.0.13

## 0.1.5

### Patch Changes

- [#793](https://github.com/wisemen-digital/wisemen-core/pull/793) [`46de4ba`](https://github.com/wisemen-digital/wisemen-core/commit/46de4bac68e067a502893133db357b6fc9898381) Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - Rework internal dependencies to non-peer dependencies

- [#739](https://github.com/wisemen-digital/wisemen-core/pull/739) [`28dda82`](https://github.com/wisemen-digital/wisemen-core/commit/28dda82e0b75787a0d9573616ea4c66e76138996) Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - Added the option `finiteOnly?: boolean` to both columns and dto validators.

- Updated dependencies [[`a3c7fca`](https://github.com/wisemen-digital/wisemen-core/commit/a3c7fca07968693f3e5a5f1850cbc3814f0cb3d7), [`46de4ba`](https://github.com/wisemen-digital/wisemen-core/commit/46de4bac68e067a502893133db357b6fc9898381)]:
  - @wisemen/quantity@0.4.0
  - @wisemen/pagination@0.0.13
