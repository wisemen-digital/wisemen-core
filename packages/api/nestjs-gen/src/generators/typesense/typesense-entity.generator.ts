import path from 'path'
import { kebabCase, pascalCase } from 'change-case'
import { Builder } from '#src/builder/builder.js'
import { ResolvedImport } from '#src/registry/helpers/resolver-registry.js'
import { TypesenseOptions } from '#src/type.js'
import { resolveEntityImport } from '#src/registry/generic.registry.js'
import { getRelativePath } from '#src/manipulators/helpers/relative-path.js'
import { importModule } from '#src/manipulators/helpers/import-module.js'
import { manipulateFile } from '#src/manipulators/helpers/manipulate-file.js'
import { updateEntityUuidType } from '#src/manipulators/update-entity-uuid-type.js'

export function addTypesenseEntity (builder: Builder, options: TypesenseOptions): ResolvedImport {
  const entityPath = path.join(options.dir, options.subdir, kebabCase(options.name), 'typesense', `typesense-${kebabCase(options.name)}.ts`)

  builder.addFile(`${kebabCase(options.name)}-typesense-entity`, {
    path: entityPath,
    skipIfExists: true,
    templateFile: '../templates/typesense/typesense-entity.hbs',
    data: { name: options.name }
  })

  addImports(builder, options, entityPath)

  return {
    name: `Typesense${pascalCase(options.name)}`,
    path: entityPath
  }
}

function addImports (builder: Builder, options: TypesenseOptions, path: string): void {
  builder.addManipulation(() => {
    const entityImport = resolveEntityImport(options.name)

    if (entityImport === null) {
      return 'Failed to resolve entity import'
    }

    manipulateFile(path, (file) => {
      const relativePath = getRelativePath(path, entityImport.path)

      importModule(file, relativePath, entityImport.name)
    })

    updateEntityUuidType(path, 'id', options.name)

    return 'Importing entity'
  })
}
