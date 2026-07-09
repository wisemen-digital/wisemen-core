import { Injectable, type OnApplicationBootstrap } from '@nestjs/common'
import {
  getTypesenseCollectionName,
  type TypesenseCollection,
  type TypesenseCollectionName
} from '../schema/collection.js'
import { ProvidersExplorer } from '../providers/providers-explorer.js'
import type { TypesenseCollector } from './typesense-collector.js'
import {
  getTypesenseCollectorCollection,
  isTypesenseCollector
} from './typesense-collector.decorator.js'

@Injectable()
export class TypesenseCollectors implements OnApplicationBootstrap {
  private readonly collectors = new Map<string, TypesenseCollector>()

  constructor (
    private readonly providersExplorer: ProvidersExplorer
  ) {}

  onApplicationBootstrap (): void {
    for (const provider of this.providersExplorer.providers) {
      if (!isTypesenseCollector(provider.providerClass)) {
        continue
      }

      this.collectors.set(
        getTypesenseCollectorCollection(provider.providerClass),
        provider.providerInstance as TypesenseCollector
      )
    }
  }

  get<TCollection extends TypesenseCollection> (
    collection: TCollection | TypesenseCollectionName<TCollection> | string
  ): TypesenseCollector<TCollection> {
    const collectionName = getTypesenseCollectionName(collection)
    const collector = this.collectors.get(collectionName)

    if (collector === undefined) {
      throw new Error(`No collector set for ${collectionName}`
        + '\n - Did you forget to add the @RegisterTypesenseCollector(...) decorator?'
        + '\n - Did you forget to add the collector as a provider in a Nest module imported by the application?')
    }

    return collector as TypesenseCollector<TCollection>
  }
}
