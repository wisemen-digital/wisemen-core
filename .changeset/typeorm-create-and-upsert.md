---
"@wisemen/nestjs-typeorm": minor
---

Add `TypeOrmRepository.createAndUpsert`, the upsert counterpart of `createAndInsert`.

`upsert` takes `QueryDeepPartialEntity<T>`, which recurses through every relation of `T`. On a large,
cyclic entity graph TypeScript exhausts its comparison budget and rejects a perfectly valid entity,
forcing a cast at every call site. `createAndUpsert` takes `DeepPartial<T> | T` instead, so the
recursive type never reaches the caller:

```ts
await this.preferencesRepository.createAndUpsert(preference, { conflictPaths: { userUuid: true } })
await this.roleRepository.createAndUpsert(userRoles, ['userUuid', 'roleUuid'])
```

It accepts a single value or an array, takes the same `string[] | UpsertOptions<T>` second argument
as `upsert`, and returns the entity (or entities) it wrote — passing an existing instance returns
that same instance rather than a copy.
