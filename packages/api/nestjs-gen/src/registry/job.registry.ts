import { kebabCase, pascalCase } from 'change-case'
import { Resolver } from './helpers/path-resolver.js'
import { ResolvedImport, ResolverRegistry } from './helpers/resolver-registry.js'

const jobResolvers = {
  queueName: {
    glob: 'src/**/queue-name.enum.ts',
    type: 'enum',
    name: 'QueueName'
  }
} as const

export const JobResolverRegistry = new ResolverRegistry(jobResolvers)

export function resolveWorkerModule (queue: string): ResolvedImport | null {
  const resolver: Resolver = {
    glob: `src/**/${kebabCase(queue)}-worker.module.ts`,
    type: 'class',
    name: `${pascalCase(queue)}WorkerModule`
  }

  return JobResolverRegistry.resolveManualImport(resolver)
}
