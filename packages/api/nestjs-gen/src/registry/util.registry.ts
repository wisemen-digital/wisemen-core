import { kebabCase, pascalCase } from 'change-case'
import { Resolver } from './helpers/path-resolver.js'
import { ResolvedImport, ResolverRegistry } from './helpers/resolver-registry.js'

const utilResolvers = {
  uuidType: {
    glob: 'src/**/uuid.ts',
    type: 'alias',
    name: 'Uuid'
  },
  generateUuid: {
    glob: 'src/utils/types/uuid.ts',
    type: 'function',
    name: 'generateUuid'
  }
} as const

export const UtilResolverRegistry = new ResolverRegistry(utilResolvers)

export function resolveResourceUuidTypeImport (resourceName: string): ResolvedImport | null {
  const resolver: Resolver = {
    glob: `src/**/${kebabCase(resourceName)}.uuid.ts`,
    type: 'alias',
    name: `${pascalCase(resourceName)}Uuid`
  }

  return UtilResolverRegistry.resolveManualImport(resolver)
}
