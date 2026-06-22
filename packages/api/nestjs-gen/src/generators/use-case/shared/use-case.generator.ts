import path from 'path'
import { kebabCase, pascalCase } from 'change-case'
import { addTypeOrmModuleImport } from '#src/manipulators/import-typeorm-module.js'
import { importForModuleProperty } from '#src/manipulators/module-import.js'
import { Builder } from '#src/builder/builder.js'
import { ErrorOptions, EventOptions, GeneratorOptions } from '#src/type.js'
import { updateEntityUuidType } from '#src/manipulators/update-entity-uuid-type.js'
import { importModule } from '#src/manipulators/helpers/import-module.js'
import { manipulateFile } from '#src/manipulators/helpers/manipulate-file.js'
import { getRelativePath } from '#src/manipulators/helpers/relative-path.js'
import { DomainEventResolverRegistry } from '#src/registry/domain-event.registry.js'
import { resolveResourceNotFoundErrorImport } from '#src/registry/exceptions.registry.js'

export function addUseCase (
  builder: Builder,
  { dir, subdir, module }: GeneratorOptions,
  useCaseName: string,
  templateFile: string,
  eventOptions?: EventOptions,
  errorOptions?: ErrorOptions
): void {
  const useCasePath = path.join(dir, subdir, `${kebabCase(module)}/use-cases/${kebabCase(useCaseName)}/${kebabCase(useCaseName)}.use-case.ts`)
  const notFoundErrorName = `${pascalCase(module)}NotFoundError`

  const entityPath = builder.getPathOrThrow(`${module}-entity`)
  const entityImportPath = getRelativePath(useCasePath, entityPath)

  builder.addFile(`${useCaseName}-use-case`, {
    path: useCasePath,
    templateFile,
    data: {
      useCaseName,
      entityName: module,
      eventClassName: eventOptions?.name,
      notFoundError: notFoundErrorName,
      entityImportPath
    }
  })

  const useCaseModulePath = builder.getPathOrThrow(`${useCaseName}-module`)

  builder.addManipulation((): string => {
    importForModuleProperty(useCaseModulePath, useCasePath, 'providers')

    return 'Imported use case'
  })

  builder.addManipulation((): string => {
    updateEntityUuidType(useCasePath, 'uuid', module)

    return 'Updated entity UUID type'
  })

  if (eventOptions != null) {
    addEventOptions(builder, useCasePath, eventOptions)
  }

  if (errorOptions != null) {
    addErrorOptions(builder, useCasePath, errorOptions)
  }

  builder.addManipulation((): string => {
    addTypeOrmModuleImport(useCaseModulePath, [entityPath])

    return 'Imported TypeormModule.forFeature'
  })
}

function addEventOptions (
  builder: Builder,
  useCasePath: string,
  eventOptions: EventOptions
) {
  builder.addManipulation((): string => {
    const domainEventEmitter = DomainEventResolverRegistry.resolveImport('domainEventEmitter')

    const eventPath = eventOptions.path
    const relativeEventPath = getRelativePath(useCasePath, eventPath)

    manipulateFile(useCasePath, (file) => {
      importModule(file, relativeEventPath, eventOptions.name)

      if (domainEventEmitter != null) {
        const relativeDomainEventEmitterPath = getRelativePath(
          useCasePath,
          domainEventEmitter.path
        )

        importModule(file, relativeDomainEventEmitterPath, domainEventEmitter.name)
      }
    })

    return 'Imported event and domain event emitter'
  })
}

function addErrorOptions (
  builder: Builder,
  useCasePath: string,
  errorOptions: ErrorOptions
) {
  if (errorOptions.notFoundErrorKey == null) {
    return
  }

  const notFoundErrorKey = errorOptions.notFoundErrorKey

  builder.addManipulation((): string => {
    const notFoundError = resolveResourceNotFoundErrorImport(notFoundErrorKey)

    if (notFoundError != null) {
      const relativePath = getRelativePath(useCasePath, notFoundError.path)

      manipulateFile(useCasePath, (file) => {
        importModule(file, relativePath, notFoundError.name)
      })
    }

    return 'Imported not found error'
  })
}
