import path from 'path'
import { kebabCase, pascalCase } from 'change-case'
import { Builder } from '#src/builder/builder.js'
import { TypesenseOptions } from '#src/type.js'
import { ResolvedImport } from '#src/registry/helpers/resolver-registry.js'
import { TypesenseResolverRegistry } from '#src/registry/typesense.registry.js'
import { manipulateFile } from '#src/manipulators/helpers/manipulate-file.js'
import { importModule } from '#src/manipulators/helpers/import-module.js'
import { getRelativePath } from '#src/manipulators/helpers/relative-path.js'

export function addTypesenseCollection (
  builder: Builder,
  options: TypesenseOptions
): ResolvedImport {
  const collectionPath = path.join(options.dir, options.subdir, kebabCase(options.name), 'typesense', `${kebabCase(options.name)}.typesense-collection.ts`)

  builder.addFile(`${kebabCase(options.name)}-typesense-collection`, {
    skipIfExists: true,
    path: collectionPath,
    templateFile: '../templates/typesense/typesense-collection.hbs',
    data: { name: options.name }
  })

  addImports(builder, collectionPath)

  return {
    name: `${pascalCase(options.name)}TypesenseCollection`,
    path: collectionPath
  }
}

function addImports (builder: Builder, path: string) {
  const imports = TypesenseResolverRegistry.resolveImports(['registerTypesenseCollection', 'typesenseCollectionName', 'typesenseCollection'])

  builder.addManipulation(() => {
    manipulateFile(path, (file) => {
      for (const resolvedImport of imports) {
        const relativePath = getRelativePath(path, resolvedImport.path)

        importModule(file, relativePath, resolvedImport.name)
      }
    })

    return 'Adding imports for Typesense collection'
  })
}
