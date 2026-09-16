---
name: typesense-generator
description: Use when scaffolding a Typesense collection, collector, and module for an existing entity with @wisemen/ngen.
---

# @wisemen/ngen - Typesense Generator

Run `pnpx @wisemen/ngen` and pick **`typesense`**. It scaffolds the search
integration for one entity: a Typesense-facing DTO, a collection definition,
a collector, and a module wired into the app's global Typesense module —
optionally also a subscriber that reacts to domain events.

Requires the target entity to already exist at
`src/**/entities/<entity>.entity.ts` (typically produced first by the
[module-generator](../module-generator/SKILL.md)) and requires
`@wisemen/nestjs-typeorm` to be installed in the target app.

## Prompts

1. `App directory:` — default `src/app/`.
2. `Subdirectory:` — default `/`.
3. `Entity (singular):` — must match an existing entity's singular name.
4. `Create subscriber module:` — confirm, default `false`.

All files land under `<dir>/<subdir>/<entity>/typesense/`.

## What gets generated

| File | Class | Notes |
| --- | --- | --- |
| `typesense-<entity>.ts` | `Typesense{Entity}` | wraps the entity, sets `id` from `<entity>.uuid` |
| `<entity>.typesense-collection.ts` | `{Entity}TypesenseCollection extends TypesenseCollection` | `@RegisterTypesenseCollection(TypesenseCollectionName.X)`, empty `searchableFields`/`filterableFields`/`referenceFields` arrays — fill these in |
| `<entity>.typesense-collector.ts` | `{Entity}TypesenseCollector implements TypesenseCollector` | `@RegisterTypesenseCollector(...)`, injects the TypeORM repository, implements `transform`/`fetch`/`fetchChanged`; adds `fetchRemoved` only if the entity has a `deletedAt` property |
| `<entity>.typesense.module.ts` | `Typesense{Entity}Module` | registers `TypeOrmModule.forFeature([Entity])` + the collector/collection as providers, and is itself registered into the app's global `typesense.module.ts` if found |
| `<entity>.typesense-subscriber.ts` *(if subscriber)* | `{Entity}TypesenseSubscriber` | empty stub injecting `PgBossScheduler` — add `@On(...)` domain-event handlers yourself |
| `<entity>.typesense-subscriber.module.ts` *(if subscriber)* | registers the subscriber, and registers itself into the app's domain-event-subscribers module if found |
| `tests/typesense-<entity>.integration.test.ts` | smoke tests | migrates the collection and imports one document, asserts no throw |

## Existing-file edits

- Adds a member to the target project's `TypesenseCollectionName` enum
  (`src/**/typesense-collection-name.enum.ts`).
- Adds a property to `TypesenseCollectionSchema`
  (`src/**/multi-search.result.ts`) — optional, no-ops if that file doesn't
  exist.
- Registers the new module into `src/**/typesense.module.ts` and (if a
  subscriber was created) into the domain-event-subscribers module — both
  optional, no-op silently if not found.

All these edits and the generated files themselves are idempotent
(`skipIfExists`, duplicate-member checks) — safe to re-run.

## Gotchas

- The generated collection/collector leave `searchableFields`/
  `filterableFields`/`referenceFields` empty — fill these in by hand to
  match the fields you want indexed.
- If the entity file can't be resolved, the entity import step silently
  fails and the generated files won't compile — create the entity first.
- `fetchRemoved` (which lets removed documents get cleaned out of the
  index) is only generated if the entity **already** has a `deletedAt`
  property (soft-delete) at generation time. If the entity doesn't have
  one yet, add it to the entity first and re-run the generator — otherwise
  deleted rows will never be removed from the collection automatically.
