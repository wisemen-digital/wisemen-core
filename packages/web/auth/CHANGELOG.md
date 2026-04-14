## 3.1.3

### Patch Changes

- [#825](https://github.com/wisemen-digital/wisemen-core/pull/825) [`9701b57`](https://github.com/wisemen-digital/wisemen-core/commit/9701b572e17fe10813d592bb80d9440b0159540a) Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - bump dependencies

## 3.1.2

### Patch Changes

- [#665](https://github.com/wisemen-digital/wisemen-core/pull/665) [`8f075e2`](https://github.com/wisemen-digital/wisemen-core/commit/8f075e27d9d3c637ea633f5e36f72fb53362287f) Thanks [@Robbe95](https://github.com/Robbe95)! - Updated linter

## 3.1.1

### Patch Changes

- f5bddce: Ran updated linter
- fce3eff: Updated linter dependency

## 1.1.0

## 3.1.0

### Minor Changes

- 7bcd018: add prefix prop to oidc client

## 3.0.1

### Patch Changes

- 347cf1a: Bumped dependency versions

## 3.0.0

### Major Changes

- 4eabb7f: replace ZitadelClient with OidcClient
  - rename ZitadelClient to OidcClient
  - scoped are now required; default scopes removed
  - remove organizationId

## 2.2.0

### Minor Changes

- 38fda81: Add `setConfig` method to zitadel client

## 2.1.0

### Minor Changes

- 7214bf6: add support for redirectUrl

### Major Changes

- Extracted logic that saves tokens to localStorage to a separate strategy
- Extracted logic that makes requests to the identity provider to a separate strategy
- Extracted logic that sets the authorization header to a separate strategy

- Created a new `FetchStrategy` interface that can be implemented to customize the way the client makes requests to the identity provider
- Created a new `TokensStrategy` interface that can be implemented to customize the way the client saves and retrieves tokens

- Created a new `new AxiosFetchStrategy(axiosInstance)` function that can be used to create a `FetchStrategy` that uses axios
- Created a new `new LocalStorageTokensStrategy()` function that can be used to create a `TokensStrategy` that uses localStorage
