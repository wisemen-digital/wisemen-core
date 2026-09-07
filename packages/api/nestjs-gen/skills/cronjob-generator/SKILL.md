---
name: cronjob-generator
description: Use when scaffolding a NestJS cronjob module and use-case with @wisemen/ngen.
---

# @wisemen/ngen - Cronjob Generator

Run `pnpx @wisemen/ngen` and pick **`cronjob`**. It scaffolds a use-case and
a module that runs it once on application bootstrap — it does **not** add
any `@Cron()`/scheduling decorator itself. Actual periodic triggering is
expected to come from the target project's own `CronjobType` enum +
`CronjobFactory`, which this generator registers into if present.

## Prompts

1. `App directory:` — default `src/app/`.
2. `Subdirectory:` — no default, free text.
3. `Cronjob name:` — no default, free text.

Both `subdir` and `name` are required in practice — leaving either blank
produces a malformed path.

## What gets generated

Both files land at `<dir>/<subdir>/use-cases/<kebab-name>/`:

- `<kebab-name>.cron-job.use-case.ts` — `@Injectable() class {Pascal}CronjobUseCase`
  with a single `execute(): Promise<void>` stub — put the actual job logic
  here.
- `<kebab-name>.cron-job.module.ts` —
  ```ts
  @Module({ providers: [{Pascal}CronjobUseCase], exports: [{Pascal}CronjobUseCase] })
  export class {Pascal}CronjobModule implements OnApplicationBootstrap {
    constructor (private useCase: {Pascal}CronjobUseCase) {}
    @Trace()
    async onApplicationBootstrap (): Promise<void> {
      await this.useCase.execute()
    }
  }
  ```

## Existing-file edits (optional, best-effort)

If the target project has these conventional files, the generator wires
itself in automatically; otherwise it silently skips the step:

- `src/**/cronjob-type.enum.ts` (enum `CronjobType`) — a new member
  `{CONSTANT_NAME} = 'kebab-name'` is appended.
- `src/**/cronjob.factory.ts` (class `CronjobFactory` with a static `create`
  containing a `switch (type)`) — a new `case CronjobType.{CONSTANT_NAME}:
  return {Pascal}CronjobModule` is inserted, and the module is imported.

Without those two files in place, you get the module + use-case only, and
must wire scheduling/dispatch by hand.

## Gotchas

- No `@Cron()` decorator or scheduling logic is ever generated — the module
  only runs the use-case once at bootstrap; real periodic execution is
  entirely dependent on whatever consumes `CronjobFactory`/`CronjobType` in
  the target app.
- `name` drives file/folder names (kebab-case), class names (PascalCase),
  and the enum member (CONSTANT_CASE + kebab-case value) — pick one phrase
  and let `change-case` handle the transforms rather than pre-casing it
  yourself.
