import { globSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import {
  Inject,
  Injectable,
  type OnApplicationBootstrap
} from '@nestjs/common'
import {
  getTypesenseCollectionName,
  isCollection,
  type TypesenseCollection,
  type TypesenseCollectionName
} from '../schema/collection.js'
import { TYPESENSE_DEFAULT_COLLECTIONS_GLOB } from '../typesense.constant.js'
import { MODULE_OPTIONS_TOKEN } from '../typesense.module-definitions.js'
import type { TypesenseModuleOptions } from '../typesense.module-options.js'

@Injectable()
export class TypesenseCollections implements OnApplicationBootstrap {
  private readonly collections = new Map<string, TypesenseCollection>()

  constructor (
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly options: TypesenseModuleOptions
  ) {}

  async onApplicationBootstrap (): Promise<void> {
    for (const file of this.getCollectionFiles()) {
      const absolutePath = resolve(process.cwd(), file)
      const moduleExports = await import(pathToFileURL(absolutePath).href) as Record<string, object>

      for (const exported of Object.values(moduleExports)) {
        if (typeof exported !== 'object' || exported == null) {
          continue
        }

        if (isCollection(exported)) {
          this.collections.set(getTypesenseCollectionName(exported), exported)
        }
      }
    }
  }

  get<TCollection extends TypesenseCollection> (
    collection: TCollection | TypesenseCollectionName<TCollection> | string
  ): TCollection {
    const collectionName = getTypesenseCollectionName(collection)
    const registeredCollection = this.collections.get(collectionName)

    if (registeredCollection === undefined) {
      throw new Error(`No collection set for ${collectionName}`
        + '\n - Did you export the collection from a file matched by the configured collectionsGlob?'
        + '\n - Did you name the file *.typesense-collection.ts?')
    }

    return registeredCollection as TCollection
  }

  private getCollectionFiles (): string[] {
    const collectionsGlob = this.options.collectionsGlob ?? TYPESENSE_DEFAULT_COLLECTIONS_GLOB
    const patterns = Array.isArray(collectionsGlob)
      ? collectionsGlob
      : [collectionsGlob]

    return [...new Set(patterns.flatMap(pattern => globSync(pattern)))]
  }
}
