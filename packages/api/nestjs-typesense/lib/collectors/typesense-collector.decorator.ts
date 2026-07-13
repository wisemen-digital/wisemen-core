// oxlint-disable typescript/no-unsafe-function-type
import 'reflect-metadata'
import { applyDecorators, Injectable } from '@nestjs/common'
import {
  getTypesenseCollectionName,
  type TypesenseCollection,
  type TypesenseCollectionName
} from '../schema/collection.js'

const TYPESENSE_COLLECTOR_KEY = Symbol('wisemen.typesense-collector')

export function RegisterTypesenseCollector<
  TCollection extends TypesenseCollection
> (
  collection: TCollection | TypesenseCollectionName<TCollection> | string
): ClassDecorator {
  const collectionName = getTypesenseCollectionName(collection)

  return applyDecorators(
    Injectable(),
    (target: Function): void => {
      Reflect.defineMetadata(TYPESENSE_COLLECTOR_KEY, collectionName, target)
    }
  )
}

export function isTypesenseCollector (collector: Function): boolean {
  return Reflect.getMetadata(TYPESENSE_COLLECTOR_KEY, collector) !== undefined
}

export function getTypesenseCollectorCollection (collector: Function): string {
  const collection = Reflect.getMetadata(TYPESENSE_COLLECTOR_KEY, collector) as unknown

  if (collection === undefined) {
    throw new Error(`${collector.name} is not a valid typesense collector`
      + '\nDid you forget to add the @RegisterTypesenseCollector(...) decorator?')
  }

  return collection as string
}
