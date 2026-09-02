import { addBuilder, BuilderOptions, EntityMeta } from './generic-builder.generator.js'
import { Builder } from '#src/builder/builder.js'
import { importModule } from '#src/manipulators/helpers/import-module.js'
import { manipulateFile } from '#src/manipulators/helpers/manipulate-file.js'
import { getRelativePath } from '#src/manipulators/helpers/relative-path.js'
import { UtilResolverRegistry } from '#src/registry/util.registry.js'

interface EntityBuilderMeta extends EntityMeta {
  entityUuidName?: string
}

export function generateEntityBuilder (
  builder: Builder,
  inputPath: string,
  outputPath: string
) {
  const options: BuilderOptions = {
    inputFileSuffix: '.entity.ts',
    outputFileSuffix: '.entity.builder.ts',
    templateFile: '../templates/builders/entity-builder.hbs'
  }

  const entityBuilderImport = addBuilder(
    builder,
    inputPath,
    outputPath,
    options,
    (entity) => {
      const meta: EntityBuilderMeta = entity

      meta.entityUuidName = `${entity.entityType}Uuid`

      return meta
    }
  )

  const generateUuidImport = UtilResolverRegistry.resolveImport('generateUuid')

  if (generateUuidImport === null) {
    return
  }

  builder.addManipulation((): string => {
    manipulateFile(entityBuilderImport.path, (file) => {
      const relativePath = getRelativePath(entityBuilderImport.path, generateUuidImport.path)

      importModule(file, relativePath, generateUuidImport.name)
    })

    return 'Added uuid generation imports'
  })
}
