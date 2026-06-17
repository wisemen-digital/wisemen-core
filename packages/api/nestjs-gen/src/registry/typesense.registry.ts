import { ResolverRegistry } from './helpers/resolver-registry.js'

const typesenseResolvers = {
  registerTypesenseCollector: {
    glob: 'src/**/typesense-collector.decorator.ts',
    type: 'function',
    name: 'RegisterTypesenseCollector'
  },
  registerTypesenseCollection: {
    glob: 'src/**/typesense-collection.decorator.ts',
    type: 'function',
    name: 'RegisterTypesenseCollection'
  },
  typesenseCollectionName: {
    glob: 'src/**/typesense-collection-name.enum.ts',
    type: 'enum',
    name: 'TypesenseCollectionName'
  },
  typesenseCollector: {
    glob: 'src/**/typesense-collector.ts',
    type: 'interface',
    name: 'TypesenseCollector'
  },
  typesenseCollection: {
    glob: 'src/**/typesense.collection.ts',
    type: 'class',
    name: 'TypesenseCollection'
  },
  typesenseModule: {
    glob: 'src/**/typesense.module.ts',
    type: 'class',
    name: 'TypesenseModule'
  },
  typesenseCollectionSchema: {
    glob: 'src/**/multi-search.result.ts',
    type: 'interface',
    name: 'TypesenseCollectionSchema'
  }
} as const

export const TypesenseResolverRegistry = new ResolverRegistry(typesenseResolvers)
