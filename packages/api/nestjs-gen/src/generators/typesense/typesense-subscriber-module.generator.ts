import path from 'path'
import { kebabCase } from 'change-case'
import { Builder } from '#src/builder/builder.js'
import { TypesenseOptions } from '#src/type.js'
import { ResolvedImport } from '#src/registry/helpers/resolver-registry.js'
import { manipulateFile } from '#src/manipulators/helpers/manipulate-file.js'
import { getRelativePath } from '#src/manipulators/helpers/relative-path.js'
import { importModule } from '#src/manipulators/helpers/import-module.js'
import { DomainEventResolverRegistry } from '#src/registry/domain-event.registry.js'
import { importForModuleProperty } from '#src/manipulators/module-import.js'

export function addTypesenseSubscriberModule (
  builder: Builder,
  options: TypesenseOptions,
  subscriberImport: ResolvedImport
): ResolvedImport {
  const modulePath = path.join(options.dir, options.subdir, kebabCase(options.name), 'typesense', `${kebabCase(options.name)}.typesense-subscriber.module.ts`)

  builder.addFile(`${kebabCase(options.name)}-typesense-subscriber-module`, {
    templateFile: '../templates/typesense/typesense-subscriber-module.hbs',
    skipIfExists: true,
    path: modulePath,
    data: { name: options.name }
  })

  builder.addManipulation(() => {
    manipulateFile(modulePath, (file) => {
      const relativePath = getRelativePath(modulePath, subscriberImport.path)

      importModule(file, relativePath, subscriberImport.name)
    })

    return 'Imported Typesense subscriber'
  })

  const eventSubscriberModule = DomainEventResolverRegistry.resolveImport('domainEventSubscribersModule')

  if (eventSubscriberModule != null) {
    builder.addManipulation(() => {
      importForModuleProperty(eventSubscriberModule.path, modulePath, 'imports')

      return 'Imported Domain Event Subscribers Module into Typesense Subscriber Module'
    })
  }

  return {
    name: `${kebabCase(options.name)}TypesenseSubscriberModule`,
    path: modulePath
  }
}
