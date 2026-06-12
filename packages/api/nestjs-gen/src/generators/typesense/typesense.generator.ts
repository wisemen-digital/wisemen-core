import { constantCase, dotCase } from 'change-case'
import { addTypesenseModule } from './typesense-module.generator.js'
import { addTypesenseCollection } from './typesense-collection.generator.js'
import { addTypesenseCollector } from './typesense-collector.generator.js'
import { addTypesenseEntity } from './typesense-entity.generator.js'
import { addTypesenseSubscriber } from './typesense-subscriber.generator.js'
import { addTypesenseSubscriberModule } from './typesense-subscriber-module.generator.js'
import { addTypesenseIntegrationTest } from './typesense-integration-test.js'
import { Builder } from '#src/builder/builder.js'
import { TypesenseOptions } from '#src/type.js'
import { TypesenseResolverRegistry } from '#src/registry/typesense.registry.js'
import { manipulateFile } from '#src/manipulators/helpers/manipulate-file.js'
import { extendEnum } from '#src/manipulators/helpers/extend-enum.js'
import { ResolvedImport } from '#src/registry/helpers/resolver-registry.js'
import { getRelativePath } from '#src/manipulators/helpers/relative-path.js'
import { importModule } from '#src/manipulators/helpers/import-module.js'

export function addTypesense (builder: Builder, options: TypesenseOptions): void {
  const entityImport = addTypesenseEntity(builder, options)
  const collectionImport = addTypesenseCollection(builder, options)
  const collectorImport = addTypesenseCollector(builder, options, entityImport)

  addTypesenseModule(builder, options, [
    collectionImport,
    collectorImport
  ])

  extendCollectionNameEnum(builder, options)
  registerEntityToMultiSearch(builder, options, entityImport)

  if (options.includeSubscriber) {
    const subscriberImport = addTypesenseSubscriber(builder, options)

    addTypesenseSubscriberModule(builder, options, subscriberImport)
  }

  addTypesenseIntegrationTest(builder, options)
}

function extendCollectionNameEnum (
  builder: Builder,
  options: TypesenseOptions
): void {
  const collectionNameImport = TypesenseResolverRegistry.resolveImport('typesenseCollectionName')

  if (collectionNameImport != null) {
    builder.addManipulation(() => {
      manipulateFile(collectionNameImport.path, (file) => {
        extendEnum(file, collectionNameImport.name, {
          [constantCase(options.name)]: dotCase(options.name)
        })
      })

      return 'Extending Typesense collection name enum'
    })
  }
}

function registerEntityToMultiSearch (
  builder: Builder,
  options: TypesenseOptions,
  entityImport: ResolvedImport
): void {
  const collectionSchemaImport = TypesenseResolverRegistry.resolveImport('typesenseCollectionSchema')

  if (collectionSchemaImport == null) {
    return
  }

  builder.addManipulation(() => {
    manipulateFile(collectionSchemaImport.path, (file) => {
      const relativePath = getRelativePath(
        collectionSchemaImport.path,
        entityImport.path
      )

      importModule(file, relativePath, entityImport.name)

      const interfaceDecl = file.getInterface('TypesenseCollectionSchema')

      if (!interfaceDecl) {
        return
      }

      const propName = `[TypesenseCollectionName.${constantCase(
        options.name
      )}]`

      const existingProps = interfaceDecl.getProperties()
      const insertIndex = existingProps.findIndex(p => p.getName().localeCompare(propName) > 0)
      const actualInsertIndex = insertIndex === -1 ? existingProps.length : insertIndex

      interfaceDecl.insertProperty(actualInsertIndex, {
        name: propName,
        type: entityImport.name
      })
    })

    return 'Registering entity in multi search'
  })
}
