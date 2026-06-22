import path from 'path'
import { camelCase, constantCase, dotCase, kebabCase, pascalCase } from 'change-case'
import { Builder } from '#src/builder/builder.js'
import { extendEnum } from '#src/manipulators/helpers/extend-enum.js'
import { importModule } from '#src/manipulators/helpers/import-module.js'
import { manipulateFile } from '#src/manipulators/helpers/manipulate-file.js'
import { getRelativePath } from '#src/manipulators/helpers/relative-path.js'
import { updateEntityUuidType } from '#src/manipulators/update-entity-uuid-type.js'
import { GeneratorOptions } from '#src/type.js'
import { DomainEventResolverRegistry } from '#src/registry/domain-event.registry.js'

export function addEvent (
  builder: Builder,
  { dir, subdir, module }: GeneratorOptions,
  useCaseName: string,
  action: string
): string {
  const eventPath = path.join(dir, subdir, `${kebabCase(module)}/use-cases/${kebabCase(useCaseName)}/${kebabCase(action)}.event.ts`)
  const eventBasePath = path.join(dir, subdir, `${kebabCase(module)}/events/${kebabCase(module)}.event.ts`)

  const className = `${action}Event`
  const contentClassName = `${className}Content`

  const propertyName = `${camelCase(module)}Uuid`
  const eventType = constantCase(action)
  const baseEventClassName = `${pascalCase(module)}Event`

  const domainEventEnumKey = constantCase(action)
  const domainEventEnumValue = dotCase(eventType)

  builder.addFile(`${action}-event`, {
    path: eventPath,
    skipIfExists: true,
    templateFile: '../templates/events/event.hbs',
    data: {
      className,
      contentClassName,
      eventType,
      baseEventClassName,
      propertyName
    }
  })

  builder.addManipulation((): string => {
    const resolvedImports = DomainEventResolverRegistry.resolveImports(['domainEventType', 'domainEventLog', 'registerDomainEventDecorator'])
    const domainEventType = DomainEventResolverRegistry.resolveImport('domainEventType')

    const relativeBaseEventPath = getRelativePath(eventPath, eventBasePath)

    manipulateFile(eventPath, (file) => {
      importModule(file, relativeBaseEventPath, baseEventClassName)

      resolvedImports.forEach((item) => {
        const relativePath = getRelativePath(eventPath, item.path)

        importModule(file, relativePath, item.name)
      })
    })

    if (domainEventType !== null) {
      manipulateFile(domainEventType.path, (file) => {
        extendEnum(file, domainEventType.name, {
          [domainEventEnumKey]: domainEventEnumValue
        })
      })
    }

    updateEntityUuidType(eventPath, propertyName, module)

    return 'Add imports for event'
  })

  return eventPath
}
