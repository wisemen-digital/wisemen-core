import type { InferDocumentType, TypesenseCollection } from '../index.js'

export interface TypesenseCollector<
  TCollection extends TypesenseCollection = TypesenseCollection
> {
  transform: (entities: unknown[]) => InferDocumentType<TCollection>[]
  fetch: (uuids?: string[]) => AsyncGenerator<unknown[], void, void>
  fetchChanged: (since: Date) => AsyncGenerator<unknown[], void, void>
  fetchRemoved?: (since: Date) => AsyncGenerator<string[], void, void>
}
