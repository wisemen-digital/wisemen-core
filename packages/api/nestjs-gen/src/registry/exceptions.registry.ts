import { kebabCase, pascalCase } from 'change-case'
import { ResolvedImport, ResolverRegistry } from './helpers/resolver-registry.js'
import { Resolver } from './helpers/path-resolver.js'

const exceptionsResolvers = {
  apiErrorCodeDecorator: {
    glob: 'src/**/api-error-code.decorator.ts',
    type: 'function',
    name: 'ApiErrorCode'
  },
  notFoundApiError: {
    glob: 'src/**/not-found.api-error.ts',
    type: 'class',
    name: 'NotFoundApiError'
  },
  apiNotFoundErrorResponseDecorator: {
    glob: 'src/**/api-error-response.decorator.ts',
    type: 'function',
    name: 'ApiNotFoundErrorResponse'
  }
} as const

export const ExceptionsResolverRegistry = new ResolverRegistry(exceptionsResolvers)

export function resolveResourceNotFoundErrorImport (resourceName: string): ResolvedImport | null {
  const resolver: Resolver = {
    glob: `src/**/errors/${kebabCase(resourceName)}.not-found.error.ts`,
    type: 'class',
    name: `${pascalCase(resourceName)}NotFoundError`
  }

  return ExceptionsResolverRegistry.resolveManualImport(resolver)
}
