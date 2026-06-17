# @wisemen/api-error

## 1.0.0

### Major Changes

- [#1188](https://github.com/wisemen-digital/wisemen-core/pull/1188) [`5266dcc`](https://github.com/wisemen-digital/wisemen-core/commit/5266dcce66c1df54ba1fbccb831186800c8db66b) Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - feat(TBN-1187):
  replace http status specific error response decorators with `@ApiErrorResponse` which catches all status types automatically.

  migration guide:
  replace the following with `ApiErrorResponse`:

  - ApiNotFoundErrorResponse
  - ApiBadRequestErrorResponse
  - ApiConflictErrorResponse

## 0.0.13

### Patch Changes

- [#825](https://github.com/wisemen-digital/wisemen-core/pull/825) [`9701b57`](https://github.com/wisemen-digital/wisemen-core/commit/9701b572e17fe10813d592bb80d9440b0159540a) Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - bump dependencies

## 0.0.12

### Patch Changes

- [#793](https://github.com/wisemen-digital/wisemen-core/pull/793) [`46de4ba`](https://github.com/wisemen-digital/wisemen-core/commit/46de4bac68e067a502893133db357b6fc9898381) Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - Rework internal dependencies to non-peer dependencies
