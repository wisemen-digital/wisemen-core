import path from 'path'
import { kebabCase, pascalCase } from 'change-case'
import { Builder } from '#src/builder/builder.js'
import { GeneratorOptions } from '#src/type.js'
import { getRelativePath } from '#src/manipulators/helpers/relative-path.js'
import { manipulateFile } from '#src/manipulators/helpers/manipulate-file.js'
import { importModule } from '#src/manipulators/helpers/import-module.js'
import { UtilResolverRegistry } from '#src/registry/util.registry.js'
import { updateEntityUuidType } from '#src/manipulators/update-entity-uuid-type.js'
import { ResolvedImport } from '#src/registry/helpers/resolver-registry.js'

export function addModuleEntity (
  builder: Builder,
  { dir, subdir, module }: GeneratorOptions
): void {
  const baseRelativePath = `${kebabCase(module)}/entities/${kebabCase(module)}`
  const entityUuidPath = path.join(dir, subdir, `${baseRelativePath}.uuid.ts`)
  const entityPath = path.join(dir, subdir, `${baseRelativePath}.entity.ts`)

  builder.addFile(`${module}-entity`, {
    skipIfExists: true,
    path: entityPath,
    templateFile: '../templates/module/entity.hbs',
    data: {
      entityName: module
    }
  })

  const uuidTypeImport = UtilResolverRegistry.resolveImport('uuidType')

  if (uuidTypeImport !== null) {
    addEntityUuid(builder, module, entityUuidPath)
    importUuidTypes(builder, module, entityPath, entityUuidPath, uuidTypeImport)

    return
  }

  const uuidTypeFilePath = builder.getPath('uuid-type')

  if (uuidTypeFilePath !== null) {
    addEntityUuid(builder, module, entityUuidPath)
    importUuidTypes(builder, module, entityPath, entityUuidPath, {
      name: 'Uuid',
      path: uuidTypeFilePath
    })
  }
}

function addEntityUuid (
  builder: Builder,
  module: string,
  entityUuidPath: string
) {
  builder.addFile(`${module}-entity-uuid`, {
    skipIfExists: true,
    path: entityUuidPath,
    templateFile: '../templates/module/entity-uuid.hbs',
    data: { resourceName: pascalCase(module) }
  })
}

function importUuidTypes (
  builder: Builder,
  module: string,
  entityPath: string,
  entityUuidPath: string,
  uuidTypeImport: ResolvedImport
) {
  builder.addManipulation((): string => {
    const relativeUuidPath = getRelativePath(entityUuidPath, uuidTypeImport.path)
    const relativeUuidEntityPath = getRelativePath(entityPath, entityUuidPath)

    manipulateFile(entityUuidPath, (uuidFile) => {
      importModule(uuidFile, relativeUuidPath, uuidTypeImport.name)
    })

    manipulateFile(entityPath, (entityFile) => {
      importModule(entityFile, relativeUuidEntityPath, buildEntityUuidType(module))
    })

    updateEntityUuidType(entityPath, 'uuid', module)

    return 'Imported Uuid type'
  })
}

export function buildEntityUuidType (name: string): string {
  return pascalCase(`${pascalCase(name)}Uuid`)
}
