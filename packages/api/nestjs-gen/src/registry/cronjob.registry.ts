import { ResolverRegistry } from './helpers/resolver-registry.js'

const cronjobResolvers = {
  cronjobType: {
    glob: 'src/**/cronjob-type.enum.ts',
    type: 'enum',
    name: 'CronjobType'
  },
  cronjobFactory: {
    glob: 'src/**/cronjob.factory.ts',
    type: 'class',
    name: 'CronjobFactory'
  }
} as const

export const CronjobResolverRegistry = new ResolverRegistry(cronjobResolvers)
