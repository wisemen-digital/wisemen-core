import path from 'path'
import { camelCase, constantCase, dotCase, kebabCase, pascalCase } from 'change-case'
import { Builder } from '#src/builder/builder.js'
import { GeneratorOptions } from '#src/type.js'
import { manipulateFile } from '#src/manipulators/helpers/manipulate-file.js'
import { extendEnum } from '#src/manipulators/helpers/extend-enum.js'
import { updateEntityUuidType } from '#src/manipulators/update-entity-uuid-type.js'
import { getRelativePath } from '#src/manipulators/helpers/relative-path.js'
import { importModule } from '#src/manipulators/helpers/import-module.js'
import { DomainEventResolverRegistry } from '#src/registry/domain-event.registry.js'

export function addEntityBaseEvent (
  builder: Builder,
  options: GeneratorOptions
): void {
  const eventBasePath = path.join(
    options.dir,
    options.subdir,
    `${kebabCase(options.module)}/events/${kebabCase(options.module)}.event.ts`
  )

  const className = `${pascalCase(options.module)}Event`
  const subjectPropertyName = `${camelCase(options.module)}Uuid`
  const subjectPropertyType = `${pascalCase(options.module)}Uuid`
  const subjectType = constantCase(options.module)

  builder.addFile(`${options.module}-base-event`, {
    path: eventBasePath,
    templateFile: '../templates/events/base-event.hbs',
    skipIfExists: true,
    data: {
      className,
      subjectPropertyName,
      subjectPropertyType,
      subjectType
    }
  })

  builder.addManipulation((): string => {
    const eventBaseImports = DomainEventResolverRegistry.resolveImports(['domainEvent', 'domainEventSubjectType', 'subjectedEventOptions'])
    const domainEventSubjectTypeImport = DomainEventResolverRegistry.resolveImport('domainEventSubjectType')

    if (domainEventSubjectTypeImport !== null) {
      manipulateFile(domainEventSubjectTypeImport.path, (file) => {
        extendEnum(file, domainEventSubjectTypeImport.name, {
          [constantCase(options.module)]: dotCase(options.module)
        })
      })
    }

    if (eventBaseImports.length > 0) {
      manipulateFile(eventBasePath, (file) => {
        eventBaseImports.forEach((item) => {
          const relativePath = getRelativePath(eventBasePath, item.path)

          importModule(file, relativePath, item.name)
        })
      })
    }

    updateEntityUuidType(
      eventBasePath,
      subjectPropertyName,
      options.module
    )

    return 'Add imports for entity base event'
  })
}
