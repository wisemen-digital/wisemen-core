import path from 'path'
import { kebabCase, pascalCase } from 'change-case'
import { Builder } from '#src/builder/builder.js'
import { ResolvedImport } from '#src/registry/helpers/resolver-registry.js'
import { TypesenseOptions } from '#src/type.js'
import { manipulateFile } from '#src/manipulators/helpers/manipulate-file.js'
import { importModule } from '#src/manipulators/helpers/import-module.js'
import { getRelativePath } from '#src/manipulators/helpers/relative-path.js'
import { resolveEntityImport } from '#src/registry/generic.registry.js'
import { TypesenseResolverRegistry } from '#src/registry/typesense.registry.js'
import { importForModuleProperty } from '#src/manipulators/module-import.js'

export function addTypesenseModule (
  builder: Builder,
  options: TypesenseOptions,
  imports: ResolvedImport[]
): ResolvedImport {
  const modulePath = path.join(options.dir, options.subdir, kebabCase(options.name), 'typesense', `${kebabCase(options.name)}.typesense.module.ts`)

  builder.addFile(`${kebabCase(options.name)}-typesense-module`, {
    skipIfExists: true,
    templateFile: '../templates/typesense/typesense-module.hbs',
    path: modulePath,
    data: { name: options.name }
  })

  const moduleImport: ResolvedImport = {
    name: `Typesense${pascalCase(options.name)}Module`,
    path: modulePath
  }

  addImports(builder, options, modulePath, imports)
  registerModule(builder, moduleImport)

  return moduleImport
}

function addImports (
  builder: Builder,
  options: TypesenseOptions,
  path: string,
  imports: ResolvedImport[]
) {
  const entityImport = resolveEntityImport(options.name)

  if (entityImport !== null) {
    imports.push(entityImport)
  }

  builder.addManipulation(() => {
    manipulateFile(path, (file) => {
      for (const resolvedImport of imports) {
        const relativePath = getRelativePath(path, resolvedImport.path)

        importModule(file, relativePath, resolvedImport.name)
      }
    })

    return 'Adding imports to Typesense collector module'
  })
}

function registerModule (
  builder: Builder,
  moduleImport: ResolvedImport
) {
  const typesenseModuleImport = TypesenseResolverRegistry.resolveImport('typesenseModule')

  if (typesenseModuleImport != null) {
    builder.addManipulation(() => {
      importForModuleProperty(typesenseModuleImport.path, moduleImport.path, 'imports')

      manipulateFile(typesenseModuleImport.path, (file) => {
        const relativePath = getRelativePath(typesenseModuleImport.path, moduleImport.path)

        importModule(file, relativePath, moduleImport.name)
      })

      return 'Registering Typesense module'
    })
  }
}
