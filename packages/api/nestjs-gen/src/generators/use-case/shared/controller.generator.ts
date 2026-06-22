import path from 'path'
import { constantCase, dotCase, kebabCase, pascalCase } from 'change-case'
import { importForModuleProperty } from '#src/manipulators/module-import.js'
import { importModule } from '#src/manipulators/helpers/import-module.js'
import { manipulateFile } from '#src/manipulators/helpers/manipulate-file.js'
import { extendEnum } from '#src/manipulators/helpers/extend-enum.js'
import { getRelativePath } from '#src/manipulators/helpers/relative-path.js'
import { Builder } from '#src/builder/builder.js'
import { ErrorOptions, GeneratorOptions } from '#src/type.js'
import { updateEntityUuidType } from '#src/manipulators/update-entity-uuid-type.js'
import { ExceptionsResolverRegistry, resolveResourceNotFoundErrorImport } from '#src/registry/exceptions.registry.js'

export function addController (
  builder: Builder,
  { dir, subdir, module, modulePlural }: GeneratorOptions,
  useCaseName: string,
  permissionName: string,
  templateFile: string,
  errorOptions?: ErrorOptions
): void {
  const controllerPath = path.join(dir, subdir, `${kebabCase(module)}/use-cases/${kebabCase(useCaseName)}/${kebabCase(useCaseName)}.controller.ts`)
  const notFoundErrorName = `${pascalCase(module)}NotFoundError`

  builder.addFile(`${useCaseName}-controller`, {
    path: controllerPath,
    templateFile,
    data: {
      moduleName: module,
      moduleNamePlural: modulePlural,
      useCaseName,
      permissionName,
      notFoundError: notFoundErrorName
    }
  })

  const useCaseModulePath = builder.getPathOrThrow(`${useCaseName}-module`)
  const permissionPath = builder.getPathOrThrow('permission-enum')
  const permissionDecoratorPath = builder.getPathOrThrow('permission-decorator')

  builder.addManipulation((): string => {
    importForModuleProperty(useCaseModulePath, controllerPath, 'controllers')

    return 'Imported controller'
  })

  builder.addManipulation((): string => {
    const relativePermissionPath = getRelativePath(
      controllerPath, permissionPath)
    const relativePermissionDecoratorPath = getRelativePath(
      controllerPath, permissionDecoratorPath)

    manipulateFile(controllerPath, (controllerFile) => {
      importModule(controllerFile, relativePermissionPath, 'Permission')
      importModule(controllerFile, relativePermissionDecoratorPath, 'Permissions')
    })

    updateEntityUuidType(controllerPath, 'uuid', module)

    manipulateFile(permissionPath, (permissionFile) => {
      extendEnum(permissionFile, 'Permission', {
        [constantCase(permissionName)]: dotCase(permissionName)
      })
    })

    return 'Extended permission enum'
  })

  if (errorOptions != null) {
    addErrorOptions(builder, controllerPath, errorOptions)
  }
}

function addErrorOptions (
  builder: Builder,
  controllerPath: string,
  options: ErrorOptions
) {
  if (options.notFoundErrorKey == null) {
    return
  }

  const notFoundErrorKey = options.notFoundErrorKey

  builder.addManipulation((): string => {
    const apiNotFoundErrorResponse = ExceptionsResolverRegistry.resolveImport('apiNotFoundErrorResponseDecorator')

    if (apiNotFoundErrorResponse != null) {
      const relativePath = getRelativePath(controllerPath, apiNotFoundErrorResponse.path)

      manipulateFile(controllerPath, (controllerFile) => {
        importModule(controllerFile, relativePath, apiNotFoundErrorResponse.name)
      })
    }

    const notFoundError = resolveResourceNotFoundErrorImport(notFoundErrorKey)

    if (notFoundError != null) {
      const relativePath = getRelativePath(controllerPath, notFoundError.path)

      manipulateFile(controllerPath, (controllerFile) => {
        importModule(controllerFile, relativePath, notFoundError.name)
      })
    }

    return 'Imported not found error'
  })
}
