---
name: module-generator
description: Use when scaffolding a new NestJS module, entity, or CRUD use-case (create/update/delete/detail/index/custom) with @wisemen/ngen.
---

# @wisemen/ngen - Module / Use-Case Generator

Run `pnpx @wisemen/ngen` from the target project root and pick **`module / useCase`**
from the generator list. It scaffolds a module folder, optionally its entity,
and one bundle per use-case type you select (controller + use-case + module +
tests, wired into the entity module and permission enum).

This generator expects the classic Wisemen NestJS boilerplate layout
(`src/app/<module>/...`) and edits existing project files in place (via
ts-morph) — a permission enum, a domain-event-subject enum, and any parent
module it registers new use-case modules into. Run it from the project root;
generated files fail to compile if those conventional files don't exist yet
in the expected shape.

## Prompts

1. `App directory:` — default `src/app/`.
2. `Subdirectory:` — default `/`. Nests under a domain folder, e.g. `billing`.
3. `Module (singular):` — e.g. `book`. Give the **singular** noun; the plural
   used in routes/permissions is derived with `pluralize`, so check irregular
   nouns (`person` → `people`).
4. `Create entity?` — boolean, default `true`.
5. `What do you want to create?` — checkbox: `Custom`, `Create`, `Index`,
   `Detail`, `Update`, `Delete`. None checked by default; pick any subset.
6. If `Custom` is checked: `Custom use case module name:` — the action verb,
   e.g. `archive` (not a boolean — this becomes part of the use-case name).
7. If `Custom` is checked: `What do you want to add?` — checkbox: `Response`,
   `Command`, `Query` (dead option, has no effect — skip it), `Event`.
8. If `Event` is checked: `Domain event name:` — e.g. `Archived` → emits an
   `ArchivedEvent`.

## Non-interactive (agent) usage

No terminal/TTY needed, including for the `custom` flow. Every prompt, static
or conditional, can be bypassed via plop's own bypass mechanism (built into
`ngen`, no extra flags or tooling), by name. This generator's name is
`module / useCase` (with spaces) — quote it as a single CLI argument:

```sh
pnpx @wisemen/ngen "module / useCase" --dir=src/app/ --subdir=/ --module=book --createEntity=yes --type=create,index,detail,update,delete
```

`dir`/`subdir`/`createEntity` fall back to their defaults if omitted;
`module` and `type` have no default and must be supplied. `type` is a
checkbox — pass a comma-separated list of values.

For the `custom` flow, include `custom` and (if relevant) `custom_addons` /
`domain_event_name` — they only apply when `type` includes `"custom"` /
`custom_addons` includes `"domain_event"`, so omit them otherwise:

```sh
pnpx @wisemen/ngen "module / useCase" --dir=src/app/ --subdir=/ --module=book --createEntity=yes --type=custom --custom=archive --custom_addons=response,command,domain_event --domain_event_name=Archived
```

(Conditional prompts like `custom` are only bypassable here because this repo
patches `node-plop` via `patches/node-plop.patch` to evaluate each prompt's
`when` against the answers gathered so far, instead of hard-refusing any
conditional prompt outright — upstream `node-plop@0.32.3` throws `You can not
bypass conditional prompts: custom` instead, with no workaround.)

## What always gets generated

- A `Permission` enum + `Permissions()`/`Public()` decorator (created once,
  reused afterwards — resolved from the target project if it already exists).
- A branded `Uuid<Brand>` util type (created once if missing).
- `<module-dir>/<module>.module.ts` — an empty `@Module({ imports: [] })`
  shell that each use-case module gets registered into.

`createEntity: true` additionally generates
`<module-dir>/entities/<module>.entity.ts` (TypeORM `@Entity()` with
`uuid`/`createdAt`/`updatedAt`) and a companion `<module>.uuid.ts` branded
UUID type, then retypes the entity's `uuid` property from `string` to that
branded type.

## Use-case bundles

Each checked type produces `<module-dir>/use-cases/<use-case-name>/` with a
module, a use-case (`@Injectable()`), a controller, and matching e2e/unit
tests — auto-registered into the parent module's `imports`, and the
controller/use-case/`TypeOrmModule.forFeature([Entity])` auto-registered into
the use-case module. A base domain event is added once if any of
`create`/`update`/`delete` is picked; a not-found error is added once if any
of `detail`/`update`/`delete` is picked.

| Type | Route | Generates | Notes |
| --- | --- | --- | --- |
| Create | `POST /api/v1/{plural}` → 201 | command + response + command builder, emits `{Module}CreatedEvent` | |
| Update | `PUT /api/v1/{plural}/:uuid` → 204 | command + command builder, emits `{Module}UpdatedEvent` | throws not-found if missing |
| Delete | `DELETE /api/v1/{plural}/:uuid` → 204 | (no command/response), emits `{Module}DeletedEvent` | throws not-found if missing |
| Detail | `GET /api/v1/{plural}/:uuid` → 200 | response only | throws not-found if missing |
| Index | `GET /api/v1/{plural}` → 200 | paginated `FilterQuery` + `PaginatedOffsetResponse` (uses `@wisemen/pagination`) | |
| Custom | `POST /api/v1/{plural}/{custom}` (hardcoded, always POST) | minimal use-case/controller stub | see below |

Generated bodies are intentionally skeletal (placeholder `name: string`
field, `throw new Error('To be implemented')` for custom) — fill in real
fields and business logic afterward.

## Custom use-case addons

- `Response` adds a response DTO and sets the controller/use-case return type
  to it.
- `Command` adds a command DTO and a `@Body() command` param, forwarded into
  `useCase.execute(command)`.
- `Event` adds the event class and import, **but does not insert the
  `emitter.emitOne(...)` call** — unlike create/update/delete, you must wire
  the emit yourself.
- The custom route's HTTP verb is always `POST` at `/{plural}/{custom}` — hand-edit
  the `@Post(...)` decorator afterward if you need a different verb/path.

## Gotchas

- Selecting `Update`/`Delete`/`Detail` without an existing (or newly created)
  entity throws — the generator can't resolve the entity path.
- Files under `use-cases/<name>/` are **not** skip-if-exists — re-running the
  generator for the same use-case name overwrites it. Entity/module/event/
  error/permission files are skip-if-exists and won't be clobbered.
- Enum extensions (permission, domain-event-subject) and module-array
  registrations are idempotent — re-running won't duplicate entries.
