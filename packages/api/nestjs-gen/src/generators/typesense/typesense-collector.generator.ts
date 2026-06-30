import path from 'path'
import { kebabCase, pascalCase } from 'change-case'
import pluralize from 'pluralize'
import { Project } from 'ts-morph'
import { Builder } from '#src/builder/builder.js'
import { ResolvedImport } from '#src/registry/helpers/resolver-registry.js'
import { TypesenseOptions } from '#src/type.js'
import { resolveEntityImport } from '#src/registry/generic.registry.js'
import { manipulateFile } from '#src/manipulators/helpers/manipulate-file.js'
import { getRelativePath } from '#src/manipulators/helpers/relative-path.js'
import { importModule } from '#src/manipulators/helpers/import-module.js'
import { TypesenseResolverRegistry } from '#src/registry/typesense.registry.js'
import { resolveResourceUuidTypeImport } from '#src/registry/util.registry.js'

export function addTypesenseCollector (
  builder: Builder,
  options: TypesenseOptions,
  typesenseEntityImport: ResolvedImport
): ResolvedImport {
  const collectorPath = path.join(options.dir, options.subdir, kebabCase(options.name), 'typesense', `${kebabCase(options.name)}.typesense-collector.ts`)
  const hasDeletedAtProperty = hasEntityDeletedAt(options)

  builder.addFile(`${kebabCase(options.name)}-typesense-collector`, {
    skipIfExists: true,
    path: collectorPath,
    templateFile: '../templates/typesense/typesense-collector.hbs',
    data: {
      name: options.name,
      pluralName: pluralize(options.name),
      hasDeletedAt: hasDeletedAtProperty
    }
  })

  addImports(builder, options, collectorPath, typesenseEntityImport)

  return {
    name: `${pascalCase(options.name)}TypesenseCollector`,
    path: collectorPath
  }
}

function addImports (
  builder: Builder,
  options: TypesenseOptions,
  path: string,
  typesenseEntityImport: ResolvedImport
): void {
  const typesenseImports = TypesenseResolverRegistry.resolveImports(['registerTypesenseCollector', 'typesenseCollectionName', 'typesenseCollector'])
  const entityImport = resolveEntityImport(options.name)
  const entityUuidImport = resolveResourceUuidTypeImport(options.name)

  const imports = [
    ...typesenseImports,
    entityImport,
    entityUuidImport,
    typesenseEntityImport
  ].filter(i => i != null)

  builder.addManipulation(() => {
    manipulateFile(path, (file) => {
      for (const resolvedImport of imports) {
        const relativePath = getRelativePath(path, resolvedImport.path)

        importModule(file, relativePath, resolvedImport.name)
      }
    })

    return 'Adding imports for Typesense collector'
  })
}

function hasEntityDeletedAt (options: TypesenseOptions): boolean {
  const entityImport = resolveEntityImport(options.name)

  if (entityImport == null) {
    return false
  }

  const project = new Project()
  const file = project.addSourceFileAtPath(entityImport.path)
  const entityClass = file.getClassOrThrow(entityImport.name)

  return entityClass.getProperty('deletedAt') != undefined
}
