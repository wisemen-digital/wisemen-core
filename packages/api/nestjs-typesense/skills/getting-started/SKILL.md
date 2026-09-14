---
name: getting-started
description: Use when defining Typesense collections, collectors, and search queries in NestJS APIs.
---

# @wisemen/nestjs-typesense - Getting Started

Use `TypesenseModule.forRootAsync(...)` to register the client, define typed
collections with `Typesense.collection(...)`, implement a
`@RegisterTypesenseCollector(...)` provider to transform entities into search
documents, and query through `TypesenseClient` with
`Typesense.createSearchParamsBuilder(...)`.

## Register The Module

Wrap the package module in a local app module and point `collectionsGlob` at
the compiled `*.typesense-collection.js` files.

```ts
import { join } from 'node:path'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypesenseModule } from '@wisemen/nestjs-typesense'

@Module({
  imports: [TypesenseModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (cfg: ConfigService) => ({
      nodes: [{
        host: cfg.getOrThrow('TYPESENSE_HOST'),
        port: 8108,
        protocol: 'http'
      }],
      apiKey: cfg.getOrThrow('TYPESENSE_KEY'),
      collectionsGlob: join(process.cwd(), 'dist', '**', 'typesense', '**', '*.typesense-collection.js')
    })
  })],
  exports: [TypesenseModule]
})
export class TypesenseClientModule {}
```

If you keep collections in `src/**/typesense/*.typesense-collection.ts`, the
default glob already matches the compiled files. Override `collectionsGlob`
only when your app uses a different layout.

## Define A Collection

Define one exported collection object per searchable document shape. Use
`InferDocumentType<typeof Collection>` to derive the Typesense document type.

```ts
import { Typesense, type InferDocumentType } from '@wisemen/nestjs-typesense'

export const ContactCollection = Typesense.collection('contact', {
  id: Typesense.string().brand<ContactUuid>(),
  isActive: Typesense.bool().optional(),
  name: Typesense.string().sort().infix(),
  email: Typesense.string().sort().optional(),
  phone: Typesense.string().sort().optional(),
  country: Typesense.string().optional(),
  city: Typesense.string().optional(),
  postalCode: Typesense.string().optional(),
  streetName: Typesense.string().optional(),
  streetNumber: Typesense.string().optional(),
  unit: Typesense.string().optional(),
  coordinates: Typesense.geopoint().optional()
})

export type ContactCollection = typeof ContactCollection
export type TypesenseContact = InferDocumentType<typeof ContactCollection>
```

Use field flags deliberately:

- `sort()` is required before `addSortOn(...)`.
- `facet()` is required before `groupBy(...)`.
- `infix()` enables infix search for that field.
- `optional()` marks nullable or omitted document fields.
- `reference(...)` links collections for join queries.

Use `Typesense.createGeopoint(...)` and `Typesense.parseGeopoint(...)` when
mapping coordinate values to and from geopoint fields.

## Register A Collector

Collectors are the bridge between your persistence model and Typesense
documents. Register one provider per collection with
`@RegisterTypesenseCollector(...)`.

```ts
import { MoreThanOrEqual } from 'typeorm'
import { AnyOrIgnore, InjectRepository, TypeOrmRepository } from '@wisemen/nestjs-typeorm'
import { RegisterTypesenseCollector, Typesense, type TypesenseCollector } from '@wisemen/nestjs-typesense'
import { Contact } from '#src/app/contact/entities/contact.entity.js'

@RegisterTypesenseCollector(ContactCollection)
export class ContactTypesenseCollector implements TypesenseCollector<ContactCollection> {
  static readonly BATCH_SIZE = 10_000

  constructor (
    @InjectRepository(Contact) private contactRepository: TypeOrmRepository<Contact>
  ) {}

  transform (contacts: Contact[]): TypesenseContact[] {
    return contacts.map(contact => ({
      id: contact.uuid,
      name: (contact.firstName ?? '') + ' ' + (contact.lastName ?? ''),
      email: contact.email ?? undefined,
      phone: contact.phone ?? undefined,
      country: contact.address?.country ?? undefined,
      city: contact.address?.city ?? undefined,
      postalCode: contact.address?.postalCode ?? undefined,
      streetName: contact.address?.streetName ?? undefined,
      streetNumber: contact.address?.streetNumber ?? undefined,
      unit: contact.address?.unit ?? undefined,
      coordinates: Typesense.createGeopoint(contact.address?.coordinates),
      isActive: contact.isActive ?? undefined
    }))
  }

  fetch (uuids?: ContactUuid[]): AsyncGenerator<Contact[], void, void> {
    return this.contactRepository.findByInBatches({
      uuid: AnyOrIgnore(uuids)
    }, ContactTypesenseCollector.BATCH_SIZE)
  }

  fetchChanged (since: Date): AsyncGenerator<Contact[], void, void> {
    return this.contactRepository.findByInBatches({
      updatedAt: MoreThanOrEqual(since)
    }, ContactTypesenseCollector.BATCH_SIZE)
  }

  async* fetchRemoved (since: Date): AsyncGenerator<ContactUuid[], void, void> {
    const contacts = this.contactRepository.findInBatches({
      select: { uuid: true },
      where: { deletedAt: MoreThanOrEqual(since) },
      withDeleted: true
    }, ContactTypesenseCollector.BATCH_SIZE)

    for await (const batch of contacts) {
      yield batch.map(contact => contact.uuid)
    }
  }
}
```

`import(...)` uses `fetch(...)`, `importChanged(...)` uses `fetchChanged(...)`,
and `deleteRemoved(...)` uses `fetchRemoved(...)`. Keep these methods batch
oriented and return ids from `fetchRemoved(...)`, not full entities.

## Query A Collection

Inject `TypesenseClient`, build typed query params, then call `search(...)`.

```ts
import { Injectable } from '@nestjs/common'
import { Typesense, TypesenseClient } from '@wisemen/nestjs-typesense'
import { FilterOperator } from '@wisemen/nestjs-typesense/dist/params-builder/enums/typesense-filter-options.enum.js'

@Injectable()
export class ViewContactIndexUseCase {
  constructor (
    private typesense: TypesenseClient
  ) {}

  async execute (query: ViewContactIndexQuery): Promise<ViewContactIndexResponse> {
    const pb = Typesense.createSearchParamsBuilder(ContactCollection)
      .withQuery(query.search)
      .withLimit(query.pagination?.limit)
      .withOffset(query.pagination?.offset)

    if (query.filter?.isActive != null) {
      pb.addFilterOn(
        ContactCollection.isActive,
        FilterOperator.EQUALS,
        toBoolean(query.filter.isActive)
      )
    }

    pb.addSearchOn(ContactCollection.name)
      .addSearchOn(ContactCollection.email)
      .addSearchOn(ContactCollection.phone)
      .addSearchOn(ContactCollection.city)
      .addSearchOn(ContactCollection.country)

    if (query.sort != null) {
      for (const sort of query.sort) {
        if (sort.key === ViewContactIndexSortQueryKey.NAME) {
          pb.addSortOn(ContactCollection.name, sort.order)
        }
      }
    }

    const result = await this.typesense.search(ContactCollection, pb.build())

    return new ViewContactIndexResponse(result)
  }
}
```

The builder enforces field capabilities at compile time:

- `addSearchOn(...)` only accepts indexed fields.
- `addFilterOn(...)` only accepts indexed fields and valid operators.
- `addSortOn(...)` only accepts fields marked with `sort()`.
- `groupBy(...)` only accepts fields marked with `facet()`.

For cross-collection queries, use `innerJoin(...)`, `leftJoin(...)`, or
`inverseJoin(...)` on fields declared with `reference(...)`.

Control where `null`/missing values land in a sort with the optional
`missingValues` argument, backed by Typesense's `missing_values` sort
modifier:

```ts
import { TypesenseMissingValues } from '@wisemen/nestjs-typesense'

pb.addSortOn(ContactCollection.name, sort.order, TypesenseMissingValues.LAST)
```

## Import And Sync Documents

Use `TypesenseClient` methods according to the data you already have:

- `import(collectionName, uuids?)`: fetch entities through the registered
  collector and upsert them.
- `importChanged(collectionName, since)`: reindex changed entities since a
  timestamp.
- `deleteRemoved(collectionName, since)`: remove deleted document ids reported
  by the collector.
- `importManually(collectionName, entities)`: transform already loaded entities
  with the collector and upsert them.
- `addDocuments(collectionOrName, documents)`: upsert already transformed
  Typesense documents.
- `truncateCollection(collectionOrName)`: remove every document from the
  collection.

In application code, trigger synchronization from domain events or jobs rather
than from controllers directly.
