import path from 'path'
import { kebabCase, pascalCase } from 'change-case'
import { Builder } from '#src/builder/builder.js'
import { TypesenseOptions } from '#src/type.js'
import { ResolvedImport } from '#src/registry/helpers/resolver-registry.js'

export function addTypesenseSubscriber (
  builder: Builder,
  options: TypesenseOptions
): ResolvedImport {
  const subscriberPath = path.join(options.dir, options.subdir, kebabCase(options.name), 'typesense', `${kebabCase(options.name)}.typesense-subscriber.ts`)

  builder.addFile(`${kebabCase(options.name)}-typesense-subscriber`, {
    templateFile: '../templates/typesense/typesense-subscriber.hbs',
    skipIfExists: true,
    path: subscriberPath,
    data: { name: options.name }
  })

  return {
    name: `${pascalCase(options.name)}TypesenseSubscriber`,
    path: subscriberPath
  }
}
