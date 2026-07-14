---
name: builder-generator
description: Use when generating a fluent test-data builder (.withX().build()) for an existing entity, command, query, or interface with @wisemen/ngen.
---

# @wisemen/ngen - Builder Generator

Run `pnpx @wisemen/ngen` and pick **`builder`**. Unlike the other
generators, this one doesn't scaffold a feature — it reads an **existing**
TypeScript class or interface with ts-morph and generates a fluent builder
(`.withX(value)` setters + `.build()`) for it, useful for tests and fixtures.

## Prompts

1. `Input path:` — path to the existing `.ts` file containing the class or
   interface to build. Must exist and contain at least one top-level
   `class`/`interface`, or the command throws.
2. `Output path (optional):` — leave blank to write next to the input file
   (see below).
3. `What kind of builder do you want to generate?` — `Entity`, `Command`,
   `Query`, or `Interface`.

The four "kinds" only differ in filename convention and one special case for
entities — the ts-morph extraction (walk the file's classes/interfaces, read
each property's name/type/optionality) is identical for all four.

| Kind | Input suffix | Output suffix | Special-cased behavior |
| --- | --- | --- | --- |
| Entity | `.entity.ts` | `.entity.builder.ts` | constructor also calls `generateUuid<{Entity}Uuid>()` to seed `.uuid` |
| Command | `.command.ts` | `.command.builder.ts` | — |
| Query | `.query.ts` | `.query.builder.ts` | — |
| Interface | any `.ts` | `.builder.ts` | works for interfaces or plain classes |

Naming your source files with the matching suffix (`*.entity.ts`,
`*.command.ts`, `*.query.ts`) isn't enforced but keeps the derived output
filename clean — the suffix is only stripped from the input basename, so a
non-matching file produces an odd double-extension output name.

## Non-interactive (agent) usage

No terminal/TTY needed — this generator has no conditional or dynamic-choice
prompts, so plop's own bypass mechanism (built into `ngen`, no extra flags or
tooling) can supply every answer up front by name:

```sh
pnpx @wisemen/ngen builder --inputPath=src/app/book/entities/book.entity.ts --outputPath= --type=entity
```

`inputPath` and `type` have no default and must be supplied; `outputPath` also
has no default, so pass it explicitly as empty (`--outputPath=`) for the
"write next to input file" behavior. `type` accepts the list's value, name, or
index (`entity`/`command`/`query`/`interface`).

## Output shape

```ts
export class {Type}Builder {
  private {entityName}: {Type}

  constructor () {
    this.{entityName} = new {Type}()       // or `{}` for interfaces
  }

  with{Property} ({property}?: {PropertyType} | null): this {
    this.{entityName}.{property} = {property}
    return this
  }

  build (): {Type} {
    return this.{entityName}
  }
}
```

One `.withX()` per **own** declared property (inherited properties aren't
picked up). Optional (`?`) and nullable (`| null`) property types are
mirrored on the setter parameter. There is no faker/random-value generation
— setters just assign what's passed in; nothing is populated until you call
a setter.

After the template is written, imports for the type itself and any
non-primitive property types are added automatically via ts-morph.

## Gotchas

- Only own properties on the file's first matching class/interface are
  covered; base-class properties are not flattened in.
- If `Output path` is omitted, the file is written next to the input file
  (e.g. `user.entity.ts` → `user.entity.builder.ts`) and **is not
  overwritten** if it already exists — delete the old builder first to
  regenerate.
- The entity builder hard-assumes a `uuid` property and a companion branded
  `{Entity}Uuid` type; if `generateUuid` can't be resolved in the target
  project, the import is silently skipped and the file won't compile until
  fixed by hand.
- `isNullable` detection is a string check for `| null` in the type text —
  unusual union types may not be detected correctly.
