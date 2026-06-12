import path from 'path'
import { camelCase, kebabCase, pascalCase, snakeCase } from 'change-case'
import { Builder } from '#src/builder/builder.js'
import { GeneratorOptions } from '#src/type.js'
import { updateEntityUuidType } from '#src/manipulators/update-entity-uuid-type.js'
import { ExceptionsResolverRegistry } from '#src/registry/exceptions.registry.js'
import { getRelativePath } from '#src/manipulators/helpers/relative-path.js'
import { manipulateFile } from '#src/manipulators/helpers/manipulate-file.js'
import { importModule } from '#src/manipulators/helpers/import-module.js'

export function addEntityNotFoundError (
  builder: Builder,
  { dir, subdir, module }: GeneratorOptions
): void {
  const errorPath = path.join(dir, subdir, `${kebabCase(module)}/errors/${kebabCase(module)}.not-found.error.ts`)
  const errorCode = `${snakeCase(module)}_not_found`

  const entityName = pascalCase(module)
  const propertyName = `${camelCase(module)}Uuid`
  const propertyNameTemplate = `\${${propertyName}}`

  builder.addFile(`${kebabCase(module)}not-found-error`, {
    skipIfExists: true,
    path: errorPath,
    templateFile: '../templates/errors/entity-not-found-error.hbs',
    data: {
      errorCode,
      entityName,
      propertyName,
      propertyNameTemplate
    }
  })

  const resolvedImports = ExceptionsResolverRegistry.resolveImports(['notFoundApiError', 'apiErrorCodeDecorator'])

  builder.addManipulation((): string => {
    manipulateFile(errorPath, (file) => {
      resolvedImports.forEach((resolvedImport) => {
        const relativePath = getRelativePath(errorPath, resolvedImport.path)

        importModule(file, relativePath, resolvedImport.name)
      })
    })

    return 'Added imports for not found error'
  })

  builder.addManipulation((): string => {
    updateEntityUuidType(errorPath, `${module.toLowerCase()}Uuid`, module)

    return 'Imported entity uuid type'
  })
}
