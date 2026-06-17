import { kebabCase, pascalCase } from 'change-case'
import { Resolver } from './helpers/path-resolver.js'
import { ResolvedImport, ResolverRegistry } from './helpers/resolver-registry.js'

const GenericResolverRegistry = new ResolverRegistry<Record<string, Resolver>>({})

export function resolveEntityImport (resourceName: string): ResolvedImport | null {
  const resolver: Resolver = {
    glob: `src/**/entities/${kebabCase(resourceName)}.entity.ts`,
    type: 'class',
    name: pascalCase(resourceName)
  }

  return GenericResolverRegistry.resolveManualImport(resolver)
}

export function resolveUseCaseImport (name: string): ResolvedImport | null {
  const resolver: Resolver = {
    glob: `src/**/use-cases/${kebabCase(name)}/${kebabCase(name)}.use-case.ts`,
    type: 'class',
    name: `${pascalCase(name)}UseCase`
  }

  return GenericResolverRegistry.resolveManualImport(resolver)
}
