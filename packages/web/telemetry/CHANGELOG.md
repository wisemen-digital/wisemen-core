## 1.0.0

### Major Changes

- [#916](https://github.com/wisemen-digital/wisemen-core/pull/916) [`c36431e`](https://github.com/wisemen-digital/wisemen-core/commit/c36431e1a757f6001ecea6cc2cc32e0bee0e9ef8) Thanks [@maltsavkiryl](https://github.com/maltsavkiryl)! - Removed sentry. Cleanup package and add default configuration.
- Breaking change: migrate `@wisemen/vue-core-telemetry` to OpenTelemetry-only and remove all Sentry integration.
- Replace the public API with OTEL-native configuration and helpers:
  `TelemetryOptions` is now a single OTEL config,
  `recordException()` replaces `captureException()`,
  `log()` replaces `captureMessage()`,
  and `setAttribute()` / `setAttributes()` replace the Sentry tag/extra helpers.
- Add OTEL metrics support via `metricsEndpoint`, OTEL logging support via `logEndpoint`, OTEL-based Vue/browser runtime error capture, and package tests for the new behavior.

## 0.0.6

### Patch Changes

- [#825](https://github.com/wisemen-digital/wisemen-core/pull/825) [`9701b57`](https://github.com/wisemen-digital/wisemen-core/commit/9701b572e17fe10813d592bb80d9440b0159540a) Thanks [@Kobe-Kwanten](https://github.com/Kobe-Kwanten)! - bump dependencies

## 0.0.5

### Patch Changes

- [#665](https://github.com/wisemen-digital/wisemen-core/pull/665) [`8f075e2`](https://github.com/wisemen-digital/wisemen-core/commit/8f075e27d9d3c637ea633f5e36f72fb53362287f) Thanks [@Robbe95](https://github.com/Robbe95)! - Updated linter

## 1.0.0

## 0.0.4

### Patch Changes

- 347cf1a: Bumped dependency versions

## 0.0.2

### Patch Changes

- f96edd5: feat(telemetry): add package for telemetry configuration
