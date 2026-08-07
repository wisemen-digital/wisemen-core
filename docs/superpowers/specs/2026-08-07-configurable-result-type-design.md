# Configurable per-rule result type

## Problem

Every built-in Danger rule hardcodes its own severity (`ResultType.WARN` /
`ResultType.FAIL`) when it fails — e.g. `conventional-commits.ts` always
warns, `changelog-updated` always fails the build. A consuming repo cannot
change this without forking the rule. We want the severity to be
configurable from the consuming repo's `dangerfile.ts`.

## Design

Add a per-rule config key, `resultType`, accepted as `'warn' | 'message' |
'fail'`. When set, it overrides the `type` a rule returns, but **only when
the rule's result is `passed: false`** — passing results keep defaulting to
a plain `message` as they do today.

```ts
// dangerfile.ts
export function configureDanger (config: DefaultConfig): DefaultConfig {
  config.rules['conventional-commits'] = { enabled: true, resultType: 'warn' }
  config.rules['changelog-updated'] = { resultType: 'fail' }

  return config
}
```

This maps directly onto Danger's own primitives:
- `resultType: 'warn'` → failure posts a warning comment, does not fail CI.
- `resultType: 'fail'` → failure calls `fail()`, which fails the Danger step/CI.
- `resultType: 'message'` → failure posts a neutral comment, no pass/fail signal.

### Where the override lives

Centralized in `createRuleRunner.run()` (`lib/index.ts`), not inside
individual rules. Right after a rule returns its result:

```ts
const result = await rule.run(context)

if (!result.passed && ruleConfig.resultType) {
  result.type = ruleConfig.resultType as ResultType
}
```

Rules (`conventional-commits.ts`, `changelog.ts`) are unchanged — they keep
returning their current default `type` on failure, which is only used when
`resultType` isn't configured. This also means any future built-in or local
rule gets this behavior for free, without its author having to implement it.

The `catch` block that reports a genuine runtime error (an exception thrown
by a rule) is **not** affected — it always reports `ResultType.FAIL`. A
crash is a bug, not a normal rule violation, so it isn't user-configurable.

### Type

Added to `RuleConfig` in `lib/config.ts`:

```ts
export interface RuleConfig {
  enabled?: boolean
  /**
   * Overrides the severity Danger reports when this rule fails ('warn' | 'message' | 'fail').
   * Has no effect when the rule passes, or when unset (the rule's own default applies).
   */
  resultType?: 'warn' | 'message' | 'fail'
  [key: string]: unknown
}
```

This is a plain string union rather than importing the `ResultType` enum
from `lib/interface.ts`, to avoid a circular import (`interface.ts` already
imports `RuleConfig` from `config.ts`). The string values are identical to
the enum's values, so the cast in the runner (`as ResultType`) is safe.

### Documentation

`README.md` gets a short addition under "Configuring rules" / "Built-in
rules" showing the `resultType` override with an example.

## Out of scope

- The existing `failOnError` global config flag (`config.ts`) is currently
  dead code — nothing reads it. This spec does not wire it up; that's a
  separate, unrelated fix if ever needed.
- No changes to `interface.ts`, `scope.ts`, or rule logic files.
- No automated tests are added — this package has no test framework
  (build+lint only); verification is via `tsc` and `eslint`.
