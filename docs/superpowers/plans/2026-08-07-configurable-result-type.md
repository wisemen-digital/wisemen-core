# Configurable Per-Rule Result Type Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let a consuming repo's `dangerfile.ts` override a rule's failure severity (`warn` / `message` / `fail`) via `config.rules['<rule-id>'].resultType`, instead of each rule hardcoding its own severity.

**Architecture:** Add a `resultType?: 'warn' | 'message' | 'fail'` field to `RuleConfig` (`lib/config.ts`). Centralize the override in `createRuleRunner.run()` (`lib/index.ts`): right after a rule returns its result, if the result failed (`passed: false`) and `resultType` is configured for that rule, overwrite `result.type` before it's reported. No individual rule file changes.

**Tech Stack:** TypeScript, no test framework in this package (build via `tsc`, lint via `eslint`) — verification is via type-check, lint, and a throwaway smoke script run against the built output, per the approved spec.

**Spec:** `docs/superpowers/specs/2026-08-07-configurable-result-type-design.md`

## Global Constraints

- Per-rule config only — no global `defaultResultType` (spec decision).
- Override applies **only when `result.passed === false`**. Passing results are untouched.
- Override is centralized in the rule runner, not implemented inside individual rules.
- The `catch` block in `run()` that handles a rule throwing an exception always reports `ResultType.FAIL`, regardless of `resultType` config — a crash is not a configurable rule violation.
- `resultType`'s three string values (`'warn' | 'message' | 'fail'`) are a plain string union, not an import of the `ResultType` enum from `lib/interface.ts` — importing it into `lib/config.ts` would create a circular import (`interface.ts` already imports from `config.ts`).
- No automated tests are added (package has no test framework). No changes to `interface.ts`, `scope.ts`, or the built-in rule files (`conventional-commits.ts`, `changelog.ts`).
- This package builds/lints via `pnpm --filter @wisemen/danger build` / `pnpm --filter @wisemen/danger lint`, run from the repo root (`/Users/sennevanreusel/Documents/work/wisemen-core`).

---

### Task 1: Add `resultType` to `RuleConfig`

**Files:**
- Modify: `packages/dev-ops/danger/lib/config.ts:9-12`

**Interfaces:**
- Produces: `RuleConfig.resultType?: 'warn' | 'message' | 'fail'` — read by Task 2's override logic in `lib/index.ts`.

- [ ] **Step 1: Add the field**

In `packages/dev-ops/danger/lib/config.ts`, replace the current `RuleConfig` interface:

```ts
// Type for individual rule configuration
export interface RuleConfig {
  enabled?: boolean
  [key: string]: unknown
}
```

with:

```ts
// Type for individual rule configuration
export interface RuleConfig {
  enabled?: boolean
  /**
   * Overrides the severity Danger reports when this rule fails.
   * Has no effect when the rule passes, or when unset (the rule's own
   * default `type` applies instead).
   */
  resultType?: 'warn' | 'message' | 'fail'
  [key: string]: unknown
}
```

- [ ] **Step 2: Type-check**

Run: `pnpm --filter @wisemen/danger build`
Expected: succeeds with no errors (this is an additive optional field, so nothing existing breaks).

- [ ] **Step 3: Commit**

```bash
git add packages/dev-ops/danger/lib/config.ts
git commit -m "feat(danger): add resultType field to RuleConfig"
```

---

### Task 2: Apply the override in the rule runner

**Files:**
- Modify: `packages/dev-ops/danger/lib/index.ts:104-162` (the `run` method inside `createRuleRunner`)

**Interfaces:**
- Consumes: `RuleConfig.resultType` from Task 1.
- Consumes: `ResultType` enum, already imported in `lib/index.ts` from `./interface.js`.
- Produces: no new exports — behavior change only, verified by the smoke script in Step 2.

- [ ] **Step 1: Add the override**

In `packages/dev-ops/danger/lib/index.ts`, inside the `run` method's `for` loop, find:

```ts
          const result = await rule.run(context)

          results.push({ ruleId, ruleName: rule.name, result })

          // Report the result
          this.reportResult(ruleId, rule.name, result)
```

Replace with:

```ts
          const result = await rule.run(context)

          // Let the consuming repo's config override this rule's severity on
          // failure - rules keep returning their own default `type`, which is
          // only used when no override is configured.
          if (!result.passed && ruleConfig.resultType) {
            result.type = ruleConfig.resultType as ResultType
          }

          results.push({ ruleId, ruleName: rule.name, result })

          // Report the result
          this.reportResult(ruleId, rule.name, result)
```

Do **not** touch the `catch` block below it (the one building `errorMessage` /
`Error running rule ${ruleId}`) - that path stays hardcoded to
`ResultType.FAIL`.

- [ ] **Step 2: Build, then run a smoke script against the compiled output**

Run: `pnpm --filter @wisemen/danger build`
Expected: succeeds with no errors.

Create a throwaway script (not committed) at
`/private/tmp/claude-501/-Users-sennevanreusel-Documents-work-wisemen-core/0eb8230c-5db7-4622-8f6a-13749b7dc28f/scratchpad/smoke-result-type.mjs`:

```js
import path from 'node:path'

const distPath = path.resolve(
  '/Users/sennevanreusel/Documents/work/wisemen-core/packages/dev-ops/danger/dist/index.js'
)
const { createRuleRunner, createRule, ResultType } = await import(distPath)

const calls = { warn: [], fail: [], message: [] }
globalThis.warn = (msg) => calls.warn.push(msg)
globalThis.fail = (msg) => calls.fail.push(msg)
globalThis.message = (msg) => calls.message.push(msg)

const fakeDanger = {
  git: { modified_files: [], created_files: [], deleted_files: [] }
}

function resetCalls () {
  calls.warn.length = 0
  calls.fail.length = 0
  calls.message.length = 0
}

// 1. Rule fails, no resultType configured -> keeps its own hardcoded type (FAIL).
const failingRule = createRule('fake-rule', 'Fake Rule', 'desc', async () => ({
  passed: false,
  message: 'boom',
  type: ResultType.FAIL
}))

let runner = createRuleRunner({ rules: { 'fake-rule': {} } })
await runner.run(fakeDanger, { 'fake-rule': failingRule })
assertEqual(calls.fail.length, 1, 'no override: expected fail() to be called')
assertEqual(calls.warn.length, 0, 'no override: expected warn() not to be called')

// 2. Rule fails, resultType: 'warn' configured -> overridden to warn().
resetCalls()
runner = createRuleRunner({ rules: { 'fake-rule': { resultType: 'warn' } } })
await runner.run(fakeDanger, { 'fake-rule': failingRule })
assertEqual(calls.warn.length, 1, 'override to warn: expected warn() to be called')
assertEqual(calls.fail.length, 0, 'override to warn: expected fail() not to be called')

// 3. Rule passes, resultType: 'warn' configured -> override must NOT apply (still message()).
resetCalls()
const passingRule = createRule('fake-rule', 'Fake Rule', 'desc', async () => ({
  passed: true,
  message: 'all good'
}))
runner = createRuleRunner({ rules: { 'fake-rule': { resultType: 'warn' } } })
await runner.run(fakeDanger, { 'fake-rule': passingRule })
assertEqual(calls.message.length, 1, 'passing + override: expected message() to be called')
assertEqual(calls.warn.length, 0, 'passing + override: expected warn() not to be called')

console.log('All smoke checks passed')

function assertEqual (actual, expected, label) {
  if (actual !== expected) {
    console.error(`FAILED: ${label} (actual=${actual}, expected=${expected})`)
    process.exit(1)
  }
}
```

Run: `node /private/tmp/claude-501/-Users-sennevanreusel-Documents-work-wisemen-core/0eb8230c-5db7-4622-8f6a-13749b7dc28f/scratchpad/smoke-result-type.mjs`
Expected output: `All smoke checks passed` and exit code 0.

- [ ] **Step 3: Lint**

Run: `pnpm --filter @wisemen/danger lint`
Expected: no lint errors.

- [ ] **Step 4: Commit**

```bash
git add packages/dev-ops/danger/lib/index.ts
git commit -m "feat(danger): let resultType config override a rule's failure severity"
```

(The smoke script lives in the scratchpad directory, not the repo, so there's nothing else to stage.)

---

### Task 3: Document `resultType` in the README

**Files:**
- Modify: `packages/dev-ops/danger/README.md`

**Interfaces:**
- Consumes: nothing (docs only).
- Produces: nothing (docs only).

- [ ] **Step 1: Add an example under "Configuring rules"**

In `packages/dev-ops/danger/README.md`, in the `## Configuring rules` section, right after the existing example block that ends with:

```ts
export const rules: Record<string, Rule> = {
  // your custom rules
}
```

add:

````markdown

Each rule's failure severity can also be overridden with `resultType`
(`'warn' | 'message' | 'fail'`) - it only affects failing results; passing
results are unaffected:

```ts
export function configureDanger (config: DefaultConfig): DefaultConfig {
  // Warn instead of fail when commits aren't conventional
  config.rules['conventional-commits'] = { enabled: true, resultType: 'warn' }

  return config
}
```
````

- [ ] **Step 2: Add a note to "Built-in rules"**

In the `## Built-in rules` section at the bottom of the README, after the
existing two bullet points (`changelog-updated` / `conventional-commits`),
add:

```markdown

Both built-in rules' default severity can be overridden per-rule with
`resultType` (see "Configuring rules" above) - e.g. to make
`changelog-updated` warn instead of fail the build.
```

- [ ] **Step 3: Commit**

```bash
git add packages/dev-ops/danger/README.md
git commit -m "docs(danger): document the resultType config override"
```

---

## Final check

- [ ] Re-run `pnpm --filter @wisemen/danger build` and `pnpm --filter @wisemen/danger lint` once more from the repo root to confirm the full set of changes together still builds and lints cleanly.
