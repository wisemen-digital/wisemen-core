import { Builder } from '#src/builder/builder.js'
import { UtilResolverRegistry } from '#src/registry/util.registry.js'

export function addUuid (
  builder: Builder
): void {
  const uuidTypeImport = UtilResolverRegistry.resolveImport('uuidType')

  if (uuidTypeImport) {
    return
  }

  builder.addFile('uuid-type', {
    skipIfExists: true,
    path: 'src/utils/types/uuid.ts',
    templateFile: '../templates/utils/uuid.hbs'
  })
}
