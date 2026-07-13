---
name: job-generator
description: Use when scaffolding a queued background job (via @wisemen/pgboss-nestjs-job) and its handler/module with @wisemen/ngen.
---

# @wisemen/ngen - Job Generator

Run `pnpx @wisemen/ngen` and pick **`job`**. It scaffolds a
`@wisemen/pgboss-nestjs-job`-based job, its handler, and a module — targeting
an existing queue defined in the project's `QueueName` enum.

## Prompts

1. `App directory:` — default `src/app/`.
2. `Subdirectory:` — no default, free text.
3. `Job name:` — no default, free text.
4. `Queue name:` — a list whose choices come from the target project's
   `QueueName` enum, found by globbing `src/**/queue-name.enum.ts` (first
   enum in that file). **This queue must already exist** — if the file/enum
   isn't found, this prompt has zero choices and effectively blocks the
   generator. Add the queue to `QueueName` first if it's missing.

## What gets generated

All under `<dir>/<subdir>/use-cases/<kebab-name>/`:

| File | Class | Notes |
| --- | --- | --- |
| `<kebab-name>.job.ts` | `{Pascal}Job extends BaseJob<{Pascal}JobData>` | `@PgBossJob(QueueName.{CONSTANT_QUEUE})` |
| `<kebab-name>.handler.ts` | `{Pascal}Handler extends JobHandler<{Pascal}Job>` | `@PgBossJobHandler({Pascal}Job)`, `run()` stub |
| `<kebab-name>-job.module.ts` | `{Pascal}JobModule` | `@Module({ providers: [{Pascal}Handler] })` |

## Existing-file edits (optional, best-effort)

- Adds a `QueueName` import into the generated job file.
- If the target project has a per-queue worker module named
  `src/**/<kebab-queue>-worker.module.ts` exporting `{PascalQueue}WorkerModule`
  with a static `forRoot()` returning `{ imports: [...] }`, the new job
  module is appended to that array automatically. Without a matching
  worker module, the job/handler/module files are still generated but you
  must register the job module with the worker by hand.

## Gotchas

- The `Queue name:` prompt is empty (blocking) until the target project
  defines a `QueueName` enum member for the queue you want — this generator
  does not create queues.
- If more than one enum exists in `queue-name.enum.ts`, only the first one
  found is used.
- `name` drives kebab-case file names, PascalCase class names; the queue
  value is matched via `QueueName.{CONSTANT_CASE(queue)}`.
